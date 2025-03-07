# Wheel of Time

## Objective
History is often perceived as dull or overwhelming due to the vast amount of information and lack of engaging learning methods. This project aims to solve that by creating an AI-powered, interactive, and visually immersive platform that makes learning history fun.

### Target Audience
- **Students (8-18 years old)** – Making history more engaging for school learning.
- **History Enthusiasts** – Quick and deep dives into historical events.
- **Educators & Parents** – An interactive teaching tool for kids.

## Concept and Approach
The platform will function as a web-based interactive experience with the following features:

1. **Wheel of Time** – A user-friendly scrollable timeline that lets users travel through different eras.
2. **Historical Map** – Users can click on a location to see key events of that time in that place.
3. **AI-Powered Narration** – AI will read out summaries of historical moments with natural voice generation.
4. **Event Images & Media** – Using AI-generated or real historical images for a visual experience.
5. **Theme-Based Filters** – Users can explore history through categories like War, Art, Inventions, Diseases, Empires, etc.
6. **AI + Web Search for Accuracy** – AI-generated summaries will be fact-checked using live web searches to ensure historical accuracy.

## Impact
This project will revolutionize how history is taught and learned by making it:

- **Engaging & Fun** – Interactive storytelling makes history exciting.
- **Accessible & Personalized** – Users can explore what interests them.
- **Educational & Accurate** – AI and web searches ensure reliable content.
- **Interactive & Immersive** – Users don’t just read history, they experience it.

## Feasibility & Implementation

### Resources Needed
- **AI & ML Models** – To generate historical narratives and images.
- **Data Sources** – Wikipedia, Google Knowledge Graph, history databases.
- **Hosting & Cloud Services** – To deploy the web app.

### Implementation Plan
1. Build a basic time scroll and map feature.
2. Implement AI text-to-speech and historical data retrieval.
3. Web search ability to retrieve historical data and images related to that event.

## Tech Stack
- **Frontend:** React.js with Next.js
- **3D Animations:** Three.js
- **Styling:** TailwindCSS
- **Backend:** FastAPI
- **AI Components:** Text-to-Speech, Any LLM model for content generation, Image generation AI
- **Web Scraping:** BeautifulSoup

## Sustainability & Growth
- **Expanding Content** – Add more historical themes over time.
- **AI Improvements** – Enhance the accuracy and storytelling abilities.
- **Partnerships** – Collaborate with schools & museums to promote usage.
- **Mobile App Version** – Expand to iOS & Android for wider reach.

## How to Run the Project
1. Clone the repository:
   ```bash
   git clone https://github.com/atPavithran/Wheel-of-Time.git
   cd wheel-of-time
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. For the backend, navigate to the FastAPI directory and run:
   ```bash
   uvicorn main:app --reload
   ```

## Contributions
We welcome contributions! Feel free to submit issues, feature requests, or pull requests to enhance the platform.

## License
This project is licensed under the MIT License.

