"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface YearSelectorProps {
  onSelect: (year: number) => void;
  minYear?: number;
  selectedYear: number;
}

interface Era {
  name: string;
  startYear: number;
  endYear: number;
  image: string;
}

const eras: Era[] = [
  { name: "Ancient Era", startYear: -3000, endYear: 476, image: "/ancient.png" },
  { name: "Medieval Era", startYear: 477, endYear: 1400, image: "/medieval.png" },
  { name: "Renaissance Era", startYear: 1401, endYear: 1760, image: "/renaissance.png" },
  { name: "Industrial Era", startYear: 1761, endYear: 1900, image: "/industrial.png" },
  { name: "Modern Era", startYear: 1901, endYear: 2100, image: "/modern.png" },
];

export default function YearSelector({ onSelect, minYear = -3000, selectedYear }: YearSelectorProps) {
  const [showEraNotification, setShowEraNotification] = useState(false);
  const [currentEra, setCurrentEra] = useState<Era | null>(null);
  const prevEraRef = useRef<Era | null>(null);
  const prevYearRef = useRef<number>(selectedYear);

  const getEraForYear = (year: number): Era | null => {
    return eras.find((era) => year >= era.startYear && year <= era.endYear) || null;
  };

  useEffect(() => {
    const newEra = getEraForYear(selectedYear);
    if (newEra) {
      setCurrentEra(newEra);
    }
  }, []);

  useEffect(() => {
    onSelect(selectedYear);
    const newEra = getEraForYear(selectedYear);
  
    if (newEra) {
      setCurrentEra(newEra);
      
      if (!prevEraRef.current) {
        prevEraRef.current = newEra;
        prevYearRef.current = selectedYear;
      } else {
        const prevEra = prevEraRef.current;
        const prevYear = prevYearRef.current;
  
        if (newEra !== prevEra) {
          if (
            (selectedYear > prevEra.endYear && prevYear <= prevEra.endYear) ||
            (selectedYear < prevEra.startYear && prevYear >= prevEra.startYear)
          ) {
            setShowEraNotification(true);
  
            const timer = setTimeout(() => {
              setShowEraNotification(false);
            }, 3000);
  
            prevEraRef.current = newEra; 
            prevYearRef.current = selectedYear;
          }
        }
      }
    }
  }, [selectedYear, onSelect]);

  return (
    <>
      <div className="flex flex-col items-center overflow-hidden h-22 w-40">
        {/* Era Image */}
        <AnimatePresence mode="wait">
          {currentEra && (
            <motion.div
              key={currentEra.name}
              className="w-32 h-20 mb-[-50%] relative"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Image
                src={currentEra.image}
                alt={currentEra.name}
                layout="fill"
                objectFit="contain"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Year Display */}
        <div className="relative flex flex-col items-center w-32 cursor-pointer select-none">
          <div className="relative h-40 w-full flex mt-[30] mb-[-60] flex-col items-center justify-center">
            <AnimatePresence mode="wait">
            <motion.div
  layout
  key={selectedYear}
  className="absolute px-2 py-2 text-[#3d2b1f] rounded-lg flex items-center justify-center"
  style={{ fontSize: "1.8rem", fontWeight: "bold" }}
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
>
  <span>{selectedYear}</span>
</motion.div>

            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Era transition notification overlay */}
      <AnimatePresence>
        {showEraNotification && currentEra && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <motion.div
              className="text-white text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <h1 className="text-5xl font-bold mb-4">{currentEra.name}</h1>
              <p className="text-xl">
                {currentEra.startYear} - {currentEra.endYear}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}