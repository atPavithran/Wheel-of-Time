from fastapi import FastAPI, HTTPException
import google.generativeai as genai
from dotenv import load_dotenv
import os
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="Historical Events Finder API",
              description="Fetch historical events using Gemini AI",
              version="1.0.0")

def ask_gemini(question: str) -> str:
    """Fetches response from Google Gemini API."""
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(question)
        return response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/historical-events", tags=["Historical Events"])
def get_historical_events(place: str, year: str = None):
    if not place.strip():
        raise HTTPException(status_code=400, detail="Place is required.")

    # Generate the prompt based on input
    if year:
        prompt = f"List major historical events that happened in {place} in the year {year}. Keep the response short. Not more than 50 words and in bullet points."
    else:
        prompt = f"List the 5 most important historical events of {place}. Keep the response short. Not more than 50 words and in bullet points."

    response = ask_gemini(prompt)
    return {"place": place, "year": year, "events": response}

@app.get("/chatbot")
async def get_chatbot_response(question: str):
    """API endpoint to fetch history-related responses."""
    prompt = (
        "You are a historian. Whatever question the user asks, give a short response up to 100 words."
        "If the question is completely unrelated to history, respond with an appropriate denial. "
        f"This is the Question: {question}"
    )
    res = ask_gemini(prompt)
    return {"response": res}