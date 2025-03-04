"use client";

import { useState } from "react";
import WorldMap from "@/components/WorldMap";
import RotatableWheel from "@/components/RotatableWheel";
import { Button, Select, Dialog } from "@/components/ui";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [blurEffect, setBlurEffect] = useState(false);
  const [currentEra, setCurrentEra] = useState("Ancient");

  const handleWheelRotate = (isRotating: boolean, era?: string) => {
    setBlurEffect(isRotating);
    if (isRotating && era) {
      setCurrentEra(era);
    }
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center relative overflow-hidden"
      style={{ backgroundImage: "url('/background.svg')" }}
    >
      {/* Full Page Blur & Transition */}
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

      {/* Title */}
      <h1 className="text-[#3a2b24] text-5xl font-medium font-serif mt-3 mb-2">
        WHEEL OF TIME
      </h1>

      {/* Search bar */}
      <div className="w-3/4 max-w-[600px] relative mb-2">
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

      {/* Map container */}
      <div
        className="w-2/3 border-2 border-[#724f27] items-center rounded-3xl mb-28"
        style={{ height: "calc(100vh - 280px)" }}
      >
        <WorldMap />
      </div>

      {/* Character */}
      <div className="absolute top-5 right-5 h-40 w-32">
        <Image
          src="/person.png"
          alt="Character"
          width={150}
          height={200}
          className="object-contain"
        />
      </div>

      {/* Bottom */}
      <div className="absolute bottom-[-6] w-full px-16 flex justify-center items-center">
        <div className="flex w-full justify-between items-center gap-4">
          <Select>
            <option hidden>All Genres</option>
            <option>War</option>
            <option>Art</option>
            <option>Science</option>
            <option>Diseases</option>
          </Select>

          <Select>
            <option hidden>All Years</option>
            <option>Ancient</option>
            <option>Medieval</option>
            <option>1800s</option>
            <option>1900s</option>
            <option>2000s</option>
          </Select>

          <div className="relative z-10">
            <RotatableWheel onRotate={handleWheelRotate} />
          </div>

          <Select>
            <option hidden>Global</option>
            <option>Europe</option>
            <option>Asia</option>
            <option>Africa</option>
            <option>Americas</option>
            <option>Oceania</option>
          </Select>

          <Button onClick={() => setIsPopupOpen(true)}>Find Events</Button>
        </div>
      </div>

      {/* Dialog popup */}
      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <div>
          <h2>Historical Events</h2>
          <p>
            Select a location on the map or refine your search using filters.
          </p>
        </div>
      </Dialog>
    </div>
  );
}