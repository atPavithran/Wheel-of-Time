"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WorldMap from "@/components/WorldMap";
import RotatableWheel from "@/components/RotatableWheel";
import { motion, AnimatePresence } from "framer-motion";
import EventsDialog from "@/components/EventsDialog";
import ThemeSelector from "@/components/ThemeSelector";
import YearSelector from "@/components/YearSelector";
import LocationSelector from "@/components/LocationSelector";

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [blurEffect, setBlurEffect] = useState(false);
  const [currentEra, setCurrentEra] = useState("Ancient");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const router = useRouter();


  const handleWheelRotate = (isRotating: boolean, era?: string) => {
    setBlurEffect(isRotating);
    if (isRotating && era) {
      setCurrentEra(era);
    }
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      router.push(`/event?title=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleChatbotRedirect = () => {
    router.push("/chatbot");
  };

  const fetchHistoricalEvents = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/historical-events?place=${encodeURIComponent(
          selectedLocation
        )}&year=${encodeURIComponent(selectedYear ?? "")}&theme=${encodeURIComponent(
          selectedTheme ?? ""
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      console.log("API Response:", data);
      setEvents(Array.isArray(data.events) ? data.events : []);
      setIsPopupOpen(true);
    } catch (error) {
      console.error("Error fetching historical events:", error);
      setEvents([]);
    }
  };
  const columns = 12; // Number of vertical slices for flag effect
  const columnWidth = 100 / columns;
  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center relative overflow-hidden"
      style={{ backgroundImage: "url('/background.svg')" }}
    >

{/* Chatbot Image + Speech Bubble */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 cursor-pointer" onClick={handleChatbotRedirect}>
        {/* Speech Bubble */}
        <div className="relative">
          <motion.div
            className="bg-white text-black px-4 py-2 rounded-full shadow-lg text-sm font-semibold"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Click here for chatbot
          </motion.div>
          <div className="absolute -bottom-2 left-3 w-4 h-4 bg-white rotate-45" />
        </div>

        {/* Chatbot Image */}
        <img
          src="/chatbot-historian.png"
          alt="Chatbot"
          className="w-16 h-16 object-contain hover:scale-105 transition-transform duration-200"
        />
      </div>

      <AnimatePresence>
        {blurEffect && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-lg flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.h1
              className="text-white text-5xl font-bold"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentEra} Era
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-5xl mt-2 mb-2 text-[#3d2b1f] font-bold">WHEEL OF TIME</h1>

      <div className="w-3/4 max-w-[700px] relative mb-2">
        <div
          className="w-full relative flex items-center"
          style={{
            height: "45px",
            backgroundImage: "url('/search-background.png')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          }}
        >
          <input
            type="text"
            placeholder="Search Events"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-full py-2 px-16 bg-transparent border-none outline-none text-[#724f27] placeholder-[#5d4c2e] font-medium text-xl"
          />
          <div
            className="absolute right-16 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={handleSearch}
          >
            <img src="/magnifier.png" alt="Search" width="24" height="24" />
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center mt-2" style={{ height: "calc(100vh - 280px)", maxWidth: "90vw" }}>
        <WorldMap onSelectCountry={setSelectedLocation} />
      </div>

      <div className="absolute bottom-0 w-full px-16 flex justify-center items-center">
        <div className="flex w-full justify-between items-center gap-4">
          <ThemeSelector onSelect={(theme: string) => setSelectedTheme(theme)} />
          <YearSelector 
  selectedYear={selectedYear ?? new Date().getFullYear()} 
  onSelect={(year: number) => setSelectedYear(year)} 
/>

<RotatableWheel 
  onRotate={handleWheelRotate} 
  onYearChange={(delta) => 
    setSelectedYear((prev) => (prev ?? new Date().getFullYear()) + delta)
  } 
/>

  <LocationSelector
            onSelect={handleLocationSelect}
            selectedLocation={selectedLocation}
          />
         <div
      className="relative w-40 h-40 cursor-pointer overflow-hidden flex"
      onClick={fetchHistoricalEvents}
    >
      {/* Create multiple animated columns */}
      {Array.from({ length: columns }).map((_, index) => (
        <motion.div
          key={index}
          className="relative h-full"
          style={{
            width: `${columnWidth}%`,
            backgroundImage: "url('/mag_glass.png')",
            backgroundSize: `${columns * 100}% 100%`, // Scale image to match columns
            backgroundPosition: `${-index * columnWidth * columns}% 0`, // Position each slice
          }}
          animate={{
            y: [-10, 10, -10], // Move up and down
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            delay: index * 0.1, // Staggered delay for wave effect
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="absolute bottom-2 left-[-10] text-[#3d2b1f] text-xl font-semibold px-4 py-1 rounded-md">
                 SEARCH
               </div>
    </div>
        </div>
      </div>
      
      <EventsDialog open={isPopupOpen} onOpenChange={setIsPopupOpen} events={events} />
    </div>
  );
}