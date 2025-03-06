"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface YearSelectorProps {
  onSelect: (year: number) => void;
  minYear?: number;
}

export default function YearSelector({ onSelect, minYear = 1900 }: YearSelectorProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const lastScrollTime = useRef(0);

  useEffect(() => {
    onSelect(selectedYear);
  }, [selectedYear, onSelect]);

  const handleYearChange = (newYear: number) => {
    if (newYear <= currentYear && newYear >= minYear) {
      setSelectedYear(newYear);
    }
  };

  const handleScroll = (e: React.WheelEvent) => {
    e.preventDefault();
    const now = Date.now();

    if (now - lastScrollTime.current < 300) return; // Slow down scrolling speed
    lastScrollTime.current = now;

    const direction = e.deltaY > 0 ? 1 : -1;
    handleYearChange(selectedYear + direction);
  };

  const getYearsToRender = () => {
    return [selectedYear + 1, selectedYear, selectedYear - 1].filter(
      (year) => year <= currentYear && year >= minYear
    );
  };

  return (
    <div className="flex flex-col items-center overflow-hidden h-48 w-40">
      <div
        className="relative flex flex-col items-center w-32 cursor-pointer select-none"
        onWheel={handleScroll}
      >
        <div className="relative h-40 w-full flex flex-col items-center justify-center">
          <AnimatePresence>
            {getYearsToRender().map((year) => (
              <motion.div
                key={year}
                className="absolute px-6 py-2 rounded-lg flex items-center justify-center"
                style={{
                  opacity: year === selectedYear ? 1 : 0.5,
                  color: year === selectedYear ? "#000" : "#777",
                  fontWeight: year === selectedYear ? "bold" : "normal",
                  fontSize: year === selectedYear ? "1.8rem" : "1.4rem",
                }}
                initial={{ opacity: 0, scale: 0.9, y: 40 * (year - selectedYear) }}
                animate={{ opacity: 1, scale: year === selectedYear ? 1.1 : 0.9, y: 40 * (year - selectedYear) }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                onClick={() => handleYearChange(year)}
              >
                <span>{year}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
