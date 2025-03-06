import requests
import re
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from duckduckgo_search import DDGS  
from dotenv import load_dotenv
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import wikipediaapi

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Historical Events Finder API",
              description="Fetch historical events using Gemini AI and event images using DuckDuckGo",
              version="2.0.0")

# Configure Gemini API (API key from .env file)
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Load Sentence Transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Load FAISS index (if exists), otherwise create a new one
try:
    index = faiss.read_index("wiki_index.faiss")
    print("Loaded existing FAISS index.")
except:
    index = faiss.IndexFlatL2(384)  # 384 is the MiniLM embedding size
    print("Created new FAISS index.")

# Dictionary to track added events
event_chunks = {}
event_mapping = {}
chunk_start_index = 0  # Initialize chunk index tracking

def sanitize_filename(filename):
    """Sanitize filename to remove invalid characters."""
    return re.sub(r'[<>:"/\\|?*]', '', filename)

def fetch_event_image(event_name: str):
    """Fetch an image URL for the given event name."""
    sanitized_name = sanitize_filename(event_name)
    with DDGS() as ddgs:
        search_results = list(ddgs.images(event_name, max_results=1))
    
    if not search_results:
        raise HTTPException(status_code=404, detail="No images found.")
    
    image_url = search_results[0]["image"]
    
    response = requests.get(image_url, stream=True)
    if response.status_code == 200:
        filename = f"{sanitized_name}.jpg"
        with open(filename, "wb") as file:
            for chunk in response.iter_content(1024):
                file.write(chunk)
        return {"filename": filename, "image_url": image_url}
    else:
        raise HTTPException(status_code=500, detail="Failed to download image.")

def add_event_to_faiss(event_name):
    """Fetch Wikipedia, chunk text, encode, and add to FAISS with tracking."""
    global chunk_start_index

    wiki_wiki = wikipediaapi.Wikipedia(user_agent='your-user-agent', language='en')
    page = wiki_wiki.page(event_name)

    if not page.exists():
        return "Wikipedia page not found."

    wikipedia_text = page.text
    print(f"\n📄 Wikipedia Content for {event_name} (First 500 chars):\n{wikipedia_text[:500]}\n")

    chunks = wikipedia_text.split("\n\n")
    event_chunks[event_name] = chunks

    new_embeddings = np.array([model.encode(chunk) for chunk in chunks])
    event_mapping[event_name] = (chunk_start_index, chunk_start_index + len(chunks) - 1)
    chunk_start_index += len(chunks)
    index.add(new_embeddings)
    faiss.write_index(index, "wiki_index.faiss")
    print(f"✅ Added {event_name} to FAISS with {len(chunks)} chunks.")

def retrieve_relevant_chunks(event_name, top_k=3):
    """Retrieve relevant chunks using FAISS, restricting results to the correct event."""
    if event_name not in event_mapping:
        return ["No relevant information found."]
    
    query_text = f"The historical significance and major events of {event_name}."
    query_embedding = model.encode([query_text])
    
    start_idx, end_idx = event_mapping[event_name]
    subset_index = faiss.IndexFlatL2(384)
    subset_vectors = np.array([index.reconstruct(i) for i in range(start_idx, end_idx + 1)])
    subset_index.add(subset_vectors)
    
    distances, indices = subset_index.search(query_embedding, top_k)
    valid_indices = [start_idx + i for i in indices[0] if start_idx + i <= end_idx]
    
    if not valid_indices or event_name not in event_chunks:
        return ["No relevant information found in Wikipedia."]
    
    retrieved_texts = [event_chunks[event_name][i - start_idx] for i in valid_indices]
    return retrieved_texts

def generate_summary(retrieved_chunks):
    """Use Gemini API to summarize retrieved content."""
    if not retrieved_chunks:
        return "No relevant information found."
    
    text = " ".join(retrieved_chunks)
    prompt = f"Summarize the following historical event concisely:\n\n{text}\n\nProvide a clear and factual summary in about 150 words only."
    
    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(prompt)
    return response.text

def summarize_event(event_name):
    """Full RAG pipeline for any event dynamically."""
    if event_name not in event_chunks:
        add_event_to_faiss(event_name)
    
    retrieved_chunks = retrieve_relevant_chunks(event_name)
    return generate_summary(retrieved_chunks)

@app.get("/get_event_image")
def get_event_image(event_name: str):
    return fetch_event_image(event_name)

@app.get("/generate_event_text")
def generate_event_text(event_name: str):
    return {"text": summarize_event(event_name)}

@app.get("/historical-events")
def get_historical_events(place: str = None, year: str = None):
    if year:
        prompt = f"List major historical events that happened in {place or 'the world'} in the year {year}. Keep the response short. Not more than 50 words and in bullet points."
    else:
        prompt = f"List the 5 most important historical events of {place or 'the world'}. Keep the response short. Not more than 50 words and in bullet points."
    
    response = summarize_event(place or 'the world')
    return {"place": place, "year": year, "events": response}

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