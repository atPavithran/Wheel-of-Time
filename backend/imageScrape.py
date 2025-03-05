import requests
import re
from duckduckgo_search import DDGS  

def sanitize_filename(filename):
    """Sanitize filename to remove invalid characters"""
    return re.sub(r'[<>:"/\\|?*]', '', filename)

def get_event_image(event_name):
    sanitized_name = sanitize_filename(event_name)  # Clean the filename
    with DDGS() as ddgs:
        search_results = list(ddgs.images(event_name, max_results=1))
    
    if not search_results:
        print("No images found.")
        return
    
    image_url = search_results[0]["image"]
    
    response = requests.get(image_url, stream=True)
    if response.status_code == 200:
        filename = f"{sanitized_name}.jpg"
        with open(filename, "wb") as file:
            for chunk in response.iter_content(1024):
                file.write(chunk)
        print(f"Image saved as {filename} from {image_url}")
    else:
        print("Failed to download image.")

event_name = input("Enter an event name: ")
get_event_image(event_name)
