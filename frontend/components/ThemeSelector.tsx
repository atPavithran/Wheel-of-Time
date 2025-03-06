import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import themes from "@/data/themes";

interface ThemeSelectorProps {
  onSelect: (theme: string) => void;
}

export default function ThemeSelector({ onSelect }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    onSelect(theme);
    setIsOpen(false);
  };

  const positions = [
    { left: "-100px", top: "-20px" },
    { left: "-15px", top: "5px" },
    { left: "70px", top: "60px" },
    { left: "110px", top: "150px" },
  ];

  return (
    <div className="relative flex flex-col items-center">
      {/* Image as Button */}
      <img
        src="/book.jpeg"
        alt="Theme Button"
        className="w-20 h-30 mt-5 cursor-pointer object-cover"
        onClick={() => setIsOpen(!isOpen)}
      />

      {/* Display selected theme below the image */}
      {selectedTheme && (
        <p className="mt-2 text-xl font-semibold text-[#3d2b1f]">
          {selectedTheme.toUpperCase()}
        </p>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              width: "200px",
              height: "200px",
            }}
          >
            {themes.map((theme, index) => {
              const position = positions[index] || { left: "0px", top: "0px" };

              return (
                <div
                  key={theme.name}
                  className="absolute flex flex-col items-center"
                  style={{
                    left: position.left,
                    top: position.top,
                  }}
                  onMouseEnter={() => setHoveredTheme(theme.name)}
                  onMouseLeave={() => setHoveredTheme(null)}
                >
                  {/* Tooltip */}
                  <motion.span
                    className={`absolute -top-10 text-[#3d2b1f] text-lg px-2 py-1 rounded transition-opacity duration-300 ${
                      hoveredTheme === theme.name ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {theme.name}
                  </motion.span>

                  {/* Theme Icon */}
                  <motion.div
                    className={`w-14 h-14 flex items-center bg-[#724e27] justify-center rounded-full shadow-lg cursor-pointer transition-transform ${
                      selectedTheme === theme.name ? "border-4 border-yellow-500" : ""
                    }`}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => handleThemeSelect(theme.name)}
                  >
                    <img src={theme.icon} alt={theme.name} className="w-10 h-10" />
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}