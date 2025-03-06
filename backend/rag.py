from fastapi import FastAPI, HTTPException
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import wikipediaapi
import google.generativeai as genai
import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"  # Suppress TensorFlow warnings
os.environ["TF_FORCE_GPU_ALLOW_GROWTH"] = "true"

from dotenv import load_dotenv

load_dotenv()
# Initialize FastAPI
app = FastAPI(title="RAG + Gemini API")

# Load Sentence Transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Initialize FAISS index
try:
    index = faiss.read_index("wiki_index.faiss")
    print("✅ Loaded existing FAISS index.")
except:
    index = faiss.IndexFlatL2(384)  # 384 is the MiniLM embedding size
    print("🆕 Created new FAISS index.")

# Dictionary to track added events
event_chunks = {}
event_mapping = {}  # To track FAISS chunk positions
chunk_start_index = 0  # Track where chunks start in FAISS

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

@app.get("/")
def root():
    return {"message": "Welcome to RAG + Gemini API!"}

@app.post("/add_event/")
def add_event_to_faiss(event_name: str):
    """Fetch Wikipedia, chunk text, encode, and add to FAISS with tracking."""
    global chunk_start_index  

    wiki_wiki = wikipediaapi.Wikipedia(user_agent='your-user-agent', language='en')
    page = wiki_wiki.page(event_name)

    if not page.exists():
        raise HTTPException(status_code=404, detail="Wikipedia page not found.")

    wikipedia_text = page.text
    print(f"\n📄 Wikipedia Content for {event_name} (First 500 chars):\n{wikipedia_text[:500]}\n")

    # Chunk and encode
    chunks = wikipedia_text.split("\n\n")
    event_chunks[event_name] = chunks  # ✅ Store chunks for retrieval later

    new_embeddings = np.array([model.encode(chunk) for chunk in chunks])

    # Store mapping of event name to chunk positions
    event_mapping[event_name] = (chunk_start_index, chunk_start_index + len(chunks) - 1)

    # Update chunk start index
    chunk_start_index += len(chunks)

    # Add to FAISS
    index.add(new_embeddings)
    faiss.write_index(index, "wiki_index.faiss")

    return {
        "message": f"✅ Added {event_name} to FAISS with {len(chunks)} chunks.",
        "total_vectors": index.ntotal
    }

@app.get("/retrieve_chunks/")
def retrieve_relevant_chunks(event_name: str, top_k: int = 3):
    """Retrieve relevant chunks using FAISS, restricting results to the correct event."""
    if event_name not in event_mapping:
        raise HTTPException(status_code=404, detail="Event not found in FAISS mapping!")

    query_text = f"The historical significance and major events of {event_name}."
    query_embedding = model.encode([query_text])

    start_idx, end_idx = event_mapping[event_name]
    print(f"📌 Valid Index Range for {event_name}: {start_idx} to {end_idx}")

    # **Force FAISS to search only within this range**
    subset_index = faiss.IndexFlatL2(384)
    subset_vectors = np.array([index.reconstruct(i) for i in range(start_idx, end_idx + 1)])

    subset_index.add(subset_vectors)

    # Search in FAISS
    distances, indices = subset_index.search(query_embedding, top_k)
    valid_indices = [start_idx + i for i in indices[0] if start_idx + i <= end_idx]

    if not valid_indices:
        raise HTTPException(status_code=404, detail="No relevant information found in FAISS.")

    if event_name not in event_chunks:
        raise HTTPException(status_code=500, detail="Error: Event chunks not found!")

    retrieved_texts = [event_chunks[event_name][i - start_idx] for i in valid_indices]
    print(f"\n✅ Retrieved Chunks for '{event_name}':\n{retrieved_texts}\n")

    return {"retrieved_chunks": retrieved_texts}

@app.get("/summarize/")
def summarize_event(event_name: str):
    """Full RAG pipeline for any event dynamically."""
    if event_name not in event_chunks:
        print(f"{event_name} not found in FAISS, fetching...")
        add_event_to_faiss(event_name)

    retrieved_chunks = retrieve_relevant_chunks(event_name)["retrieved_chunks"]

    return generate_summary(retrieved_chunks)

def generate_summary(retrieved_chunks):
    """Use Gemini API to summarize retrieved content."""
    if not retrieved_chunks:
        return {"summary": "No relevant information found."}

    text = " ".join(retrieved_chunks)
    prompt = f"Summarize the following historical event concisely:\n\n{text}\n\nProvide a clear and factual summary in about 150 words."

    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(prompt)

    return {"summary": response.text}
