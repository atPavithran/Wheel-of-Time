"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function MagnifyingGlassEffect() {
  const [flyAway, setFlyAway] = useState(false);

  return (
    <div className="relative flex justify-center items-center h-[400px]">
      {/* Map with flag effect */}
      <motion.img
        src="/mag_glass.png"
        alt="Map"
        className="w-[500px] h-auto"
        animate={{
          rotate: [-1, 1, -1], // Subtle waving effect
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
        exit={flyAway ? { y: -500, opacity: 0 } : {}}
      />

      {/* Magnifying Glass */}
      <motion.img
        src="/magnifier.png"
        alt="Magnifying Glass"
        className="absolute w-[120px] h-auto"
        animate={{
          x: [-2, 2, -2], // Vibrating effect
          transition: { duration: 0.1, repeat: Infinity },
        }}
      />

      {/* Button to trigger flying effect */}
      <button
        className="absolute bottom-4 px-6 py-3 bg-gradient-to-r from-yellow-500 to-red-500 text-white font-bold text-xl rounded-full shadow-lg"
        onClick={() => setFlyAway(true)}
      >
        🔍 Activate Map Effect
      </button>
    </div>
  );
}