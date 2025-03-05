from fastapi import FastAPI, HTTPException
import google.generativeai as genai

# Configure Gemini API
GEMINI_API_KEY = "AIzaSyC98W8sgyUcu8v2raMd8PiFKtz10gyv01E"
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
