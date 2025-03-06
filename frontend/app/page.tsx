"use client";

import { useState, useEffect } from "react";
import WorldMap from "@/components/WorldMap";
import RotatableWheel from "@/components/RotatableWheel";
import { Button, Select } from "@/components/ui";
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

  const handleWheelRotate = (isRotating: boolean, era?: string) => {
    setBlurEffect(isRotating);
    if (isRotating && era) {
      setCurrentEra(era);
    }
  };

  const numColumns = 12;
  const columnWidth = 100 / numColumns;

  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center relative overflow-hidden"
      style={{ backgroundImage: "url('/background.svg')" }}
    >
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
            className="w-full h-full py-2 px-16 bg-transparent border-none outline-none text-[#724f27] placeholder-[#5d4c2e] font-medium text-xl"
          />
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
            <img src="/magnifier.png" alt="Search" width="24" height="24" />
          </div>
        </div>
      </div>

      <div
        className="w-full flex justify-center items-center mt-2"
        style={{ height: "calc(100vh - 280px)", maxWidth: "90vw" }}
      >
        <WorldMap onSelectCountry={setSelectedLocation} />
      </div>

      <div className="absolute bottom-0 w-full px-16 flex justify-center items-center">
        <div className="flex w-full justify-between items-center gap-4">
          <ThemeSelector onSelect={(theme: string) => setSelectedTheme(theme)} />
          <YearSelector onSelect={(year: number) => setSelectedYear(year)} />
          <RotatableWheel onRotate={handleWheelRotate} />
          <LocationSelector onSelect={setSelectedLocation} />
          
          <div 
            className="relative w-40 h-40 cursor-pointer overflow-hidden"
            onClick={() => setIsPopupOpen(true)}
          >
            <div className="relative w-full h-full">
              {Array.from({ length: numColumns }).map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute top-0 h-full"
                  style={{
                    left: `${index * columnWidth}%`,
                    width: `${columnWidth}%`,
                    backgroundImage: "url('/mag_glass.png')",
                    backgroundSize: `${numColumns * 100}% 100%`,
                    backgroundPosition: `${-index * 100}% 0%`,
                    zIndex: 10,
                  }}
                  animate={{
                    y: [
                      0, 
                      Math.sin((index / numColumns) * Math.PI) * 5,
                      0
                    ]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    delay: index * 0.1,
                    ease: "easeInOut"
                  }}
                />
              ))}
              
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-black opacity-30 rounded-full blur-sm"></div>
            </div>
          </div>
        </div>
      </div>

      <EventsDialog open={isPopupOpen} onOpenChange={setIsPopupOpen} />
    </div>
  );
}