"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Volume2, Pause, ChevronLeft, Home, MessageCircle } from "lucide-react";

const EventPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventTitle = searchParams.get("title") || "Unknown Event";

  const [eventContent, setEventContent] = useState("Loading event details...");
  const [eventImage, setEventImage] = useState("/placeholder.jpg");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (eventTitle !== "Unknown Event") {
      fetchEventData(eventTitle);
    }
  }, [eventTitle]);

  const fetchEventData = async (title: string) => {
    try {
      const textResponse = await fetch(
        `http://localhost:8000/eventinfo?question=${encodeURIComponent(title)}`
      );
      const textData = await textResponse.json();
      setEventContent(textData.response || "No details available.");

      const imageResponse = await fetch(
        `http://localhost:8000/get_event_image?event_name=${encodeURIComponent(
          title
        )}`
      );
      const imageData = await imageResponse.json();
      setEventImage(imageData.image_url || "/placeholder.jpg");
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  const handleTextToSpeech = async () => {
    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/tts?text=${encodeURIComponent(
          eventTitle + ". " + eventContent
        )}`
      );
      if (!response.ok) throw new Error("Failed to fetch speech");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const newAudio = new Audio(audioUrl);

      newAudio.onended = () => setIsPlaying(false);
      setAudio(newAudio);
      setIsPlaying(true);
      newAudio.play();
    } catch (error) {
      console.error("Error fetching speech:", error);
    }
  };

  const handleBack = () => {
    if (searchParams.get("popup") === "open") {
      router.push("/?popup=open");
    } else {
      router.back();
    }
  };  

  return (
    <div
      className="flex flex-col min-h-screen bg-fixed bg-center bg-contain"
      style={{ backgroundImage: "url('/event-bg.jpg')" } as React.CSSProperties}
    >
      {/* Navigation Bar */}
      <nav className="w-full py-4 px-6 flex justify-between items-center bg-transparent backdrop-blur-sm shadow-md">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center font-semibold text-white hover:text-black transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft size={24} />
          <span className="ml-1 font-medium">Back</span>
        </button>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center font-semibold text-white hover:text-black transition-colors"
          >
            <Home size={20} />
            <span className="ml-2 font-medium">Home</span>
          </button>

          <button
            onClick={() => router.push("/chatbot")}
            className="flex items-center font-semibold text-white hover:text-black transition-colors"
          >
            <MessageCircle size={20} />
            <span className="ml-2 font-medium">Chatbot</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      {/* <div className="flex-1 flex justify-center items-center p-6"> */}
        <div className="flex w-full flex-col md:flex-row items-center justify-center md:space-x-10 px-4">
          {/* Event Image */}
        {/* ✅ Event Image with Proper Fit */}
        <div className="w-[400px] h-[450px] md:w-[350px] md:h-[450px] lg:w-[400px] lg:h-[500px] mb-6 md:mb-0 flex items-center justify-center">
          <img 
            src={eventImage} 
            alt={eventTitle} 
            className="w-full h-full object-contain rounded-md shadow-lg"
          />
        </div>
          {/* Event Details */}
          <div
            className="relative p-6 w-full h-[600px] md:w-[500px] lg:w-[900px] flex-col max-w-3xl text-gray-800 leading-relaxed"
            style={
              {
                backgroundColor: "transparent",
                borderImageSource: "url('/wooden-frame.png')",
                borderImageSlice: "30",
                borderImageRepeat: "stretch",
                borderWidth: "30px",
                borderStyle: "solid",
                boxShadow: "0 12px 35px rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(3px)",
                borderRadius: "12px",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                height: "auto",
                maxHeight: "450px",
              } as React.CSSProperties
            }
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#3d2b1f]">
                {eventTitle}
              </h2>
              <button
                onClick={handleTextToSpeech}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-700 hover:bg-amber-600 text-white transition-colors"
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
                title={isPlaying ? "Stop reading" : "Read aloud"}
              >
                {isPlaying ? <Pause size={20} /> : <Volume2 size={20} />}
              </button>
            </div>

            {/* Text Container */}
            <p
              className="text-base md:text-lg text-[#5d4c2e] overflow-auto max-h-[400px] px-3"
              style={{ textAlign: "justify", lineHeight: "1.5" }}
            >
              {eventContent}
            </p>

            {isPlaying && (
              <div className="absolute bottom-2 right-6">
                <div className="text-xs text-amber-700 animate-pulse">
                  Reading aloud...
                </div>
              </div>
            )}
          </div>
        </div>
      {/* </div> */}
    </div>
  );
};

export default EventPage;
