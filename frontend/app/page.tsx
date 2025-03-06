"use client";

import { useState, useEffect, useRef } from "react";
import WorldMap from "@/components/WorldMap";
import RotatableWheel from "@/components/RotatableWheel";
import { motion, AnimatePresence } from "framer-motion";
import EventsDialog from "@/components/EventsDialog";
import ThemeSelector from "@/components/ThemeSelector";
import YearSelector from "@/components/YearSelector";
import LocationSelector from "@/components/LocationSelector";
import StardustText from "@/components/StardustText";

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [blurEffect, setBlurEffect] = useState(false);
  const [currentEra, setCurrentEra] = useState("Ancient");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // Search related states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Handle click outside suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Wikipedia API search for suggestions
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.length > 2) {
        fetchWikipediaSuggestions(searchTerm);
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const fetchWikipediaSuggestions = async (term: string) => {
    try {
      // Optionally filter by era, location, theme or year
      let searchQuery = term;
      if (currentEra && currentEra !== "All") {
        searchQuery += ` ${currentEra}`;
      }
      if (selectedLocation) {
        searchQuery += ` ${selectedLocation}`;
      }

      const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(searchQuery)}&limit=10&namespace=0&format=json&origin=*`;

      setIsSearching(true);
      const response = await fetch(url);
      const data = await response.json();

      // data[1] contains the titles of suggested pages
      setSearchResults(data[1] || []);
      setShowSuggestions(data[1].length > 0);
      setIsSearching(false);
    } catch (error) {
      console.error("Error fetching Wikipedia suggestions:", error);
      setIsSearching(false);
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchTerm) {
      fetchWikipediaEvent(searchTerm);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setSelectedEvent(suggestion);
    setShowSuggestions(false);
    fetchWikipediaEvent(suggestion);
  };

  const fetchWikipediaEvent = async (eventTitle: string) => {
    try {
      // This fetches the actual page content
      const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(eventTitle)}&prop=extracts&exintro=1&format=json&origin=*`;

      setIsSearching(true);
      const response = await fetch(url);
      const data = await response.json();

      // Process the response
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      const eventContent = pages[pageId].extract;

      setIsPopupOpen(true);

      console.log("Event content:", eventContent);

      setIsSearching(false);
    } catch (error) {
      console.error("Error fetching Wikipedia event:", error);
      setIsSearching(false);
    }
  };

  const handleWheelRotate = (isRotating: boolean, era?: string) => {
    setBlurEffect(isRotating);
    if (isRotating && era) {
      setCurrentEra(era);
    }
  };

  const fetchHistoricalEvents = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/historical-events?place=${encodeURIComponent(selectedLocation)}&year=${encodeURIComponent(selectedYear ?? '')}&theme=${encodeURIComponent(selectedTheme ?? '')}`
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
  
      const data = await response.json();
      
      console.log("API Response:", data); // ✅ Debug API response in browser console
  
      // Ensure `events` is always an array
      setEvents(Array.isArray(data.events) ? data.events : []);
      setIsPopupOpen(true);
    } catch (error) {
      console.error("Error fetching historical events:", error);
      setEvents([]); // Prevent `undefined` crashes
    }
  };
  
  

  const numColumns = 12;
  const columnWidth = 100 / numColumns;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center relative overflow-hidden"
      style={{ backgroundImage: "url('/background.svg')" }}
    >
      <AnimatePresence>
        {pageLoading && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-md flex items-center justify-center z-[100]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.img
              src="/cloud 1.png"
              alt="Left Cloud"
              className="absolute w-[60%] h-full opacity-90 top-0 object-cover"
              style={{
                left: "-10%",
                objectPosition: "right center"
              }}
              initial={{ x: "33.33% + 10%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 1.5,
                exit: { duration: 0.8 }
              }}
            />

            <motion.img
              src="/cloud 4.png"
              alt="Right Cloud"
              className="absolute w-[60%] h-full opacity-90 top-0 object-cover"
              style={{
                right: "-10%",
                objectPosition: "left center"
              }}
              initial={{ x: "-33.33% - 10%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: 1.5,
                exit: { duration: 0.8 }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

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

      <div className="flex items-center justify-center gap-2">
        {/* Left Star */}
        <img
          src="/clock.png"
          alt="Star"
          className="mt-4 w-12 h-12"
        />

        {/* Title */}
        <h1 className="text-5xl mt-6 mb-2 text-[#3d2b1f] font-bold">WHEEL OF TIME</h1>

        {/* Right Star */}
        <img
          src="/clock.png"
          alt="Star"
          className="mt-4 w-12 h-12"
        />
      </div>

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
            ref={searchInputRef}
            type="text"
            placeholder="Search Historical Events"
            className="w-full h-full py-2 px-16 bg-transparent border-none outline-none text-[#724f27] placeholder-[#5d4c2e] font-medium text-xl"
            value={searchTerm}
            onChange={handleSearchInputChange}
            onFocus={() => searchTerm.length > 2 && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
          />
          <div
            className="absolute right-16 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={handleSearchSubmit}
          >
            {isSearching ? (
              <motion.div
                className="w-6 h-6 border-2 border-[#724f27] border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <img src="/magnifier.png" alt="Search" width="24" height="24" />
            )}
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && searchResults.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 w-full mt-1 bg-[#f9ecd7] border border-[#724f27] rounded-md shadow-lg z-50 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-[#724f27] scrollbar-track-[#f9ecd7]"
            >
              {searchResults.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-[#e6d5b8] text-[#724f27] transition-colors duration-150"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className="w-full flex justify-center items-center mt-2"
        style={{ height: "calc(100vh - 280px)", maxWidth: "90vw" }}
      >
        <WorldMap onSelectCountry={setSelectedLocation} />
      </div>

      <div className="absolute bottom-[-16] w-full px-16 flex justify-center items-center">
        <div className="flex w-full justify-between items-center gap-4">
          <ThemeSelector onSelect={(theme: string) => setSelectedTheme(theme)} />
          <YearSelector
  onSelect={(year: number) => setSelectedYear(year)}
  minYear={-3000}
  selectedYear={selectedYear ?? new Date().getFullYear()} // Ensure it's always a number
/>

          <RotatableWheel
            onRotate={handleWheelRotate}
            onYearChange={(delta) =>
              setSelectedYear(
                (prev) => (prev ?? new Date().getFullYear()) + delta
              )
            }
          />
          <LocationSelector 
          onSelect={handleLocationSelect} 
          selectedLocation={selectedLocation}
        />

<div
            className="relative w-40 h-40 cursor-pointer overflow-hidden"
            onClick={() => setIsPopupOpen(true)}
            style={{ zIndex: pageLoading ? 1 : 10 }}
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

              {/* "GO" Label on the button */}
              <div className="absolute bottom-2 left-[-10] text-[#3d2b1f] text-xl font-semibold px-4 py-1 rounded-md">
                SEARCH
              </div>
              
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-black opacity-30 rounded-full blur-sm"></div>
            </div>
          </div>
        </div>
      </div>

      <EventsDialog
        open={isPopupOpen}
        onOpenChange={setIsPopupOpen}
      />
    </div>
  );
}
