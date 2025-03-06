import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const countries: string[] = [
  "Afghanistan", "Angola", "Albania", "United Arab Emirates", "Argentina",
  "Armenia", "Australia", "Austria", "Azerbaijan", "Burundi", "Belgium",
  "Benin", "Burkina Faso", "Bangladesh", "Bulgaria", "Bahrain",
  "Bosnia and Herzegovina", "Belize", "Bolivia", "Brazil", "Brunei Darussalam",
  "Bhutan", "Botswana", "Central African Republic", "Canada", "Switzerland",
  "Chile", "China", "Côte d'Ivoire", "Cameroon", "Democratic Republic of the Congo",
  "Republic of Congo", "Colombia", "Costa Rica", "Cuba", "Czech Republic",
  "Germany", "Djibouti", "Denmark", "Dominican Republic", "Algeria",
  "Ecuador", "Egypt", "Eritrea", "Estonia", "Ethiopia", "Finland",
  "Fiji", "Gabon", "United Kingdom", "Georgia", "Ghana", "Guinea",
  "The Gambia", "Guinea-Bissau", "Equatorial Guinea", "Greece", "Greenland",
  "Guatemala", "Guyana", "Honduras", "Croatia", "Haiti", "Hungary",
  "Indonesia", "India", "Ireland", "Iran", "Iraq", "Iceland",
  "Israel", "Italy", "Jamaica", "Jordan", "Japan", "Kazakhstan",
  "Kenya", "Kyrgyzstan", "Cambodia", "Republic of Korea", "Kosovo",
  "Kuwait", "Lao PDR", "Lebanon", "Liberia", "Libya", "Sri Lanka",
  "Lesotho", "Lithuania", "Luxembourg", "Latvia", "Morocco", "Moldova",
  "Madagascar", "Mexico", "Macedonia", "Mali", "Myanmar", "Montenegro",
  "Mongolia", "Mozambique", "Mauritania", "Malawi", "Malaysia", "Namibia",
  "Niger", "Nigeria", "Nicaragua", "Netherlands", "Norway", "Nepal",
  "New Zealand", "Oman", "Pakistan", "Panama", "Peru", "Philippines",
  "Papua New Guinea", "Poland", "Dem. Rep. Korea", "Portugal", "Paraguay",
  "Palestine", "Qatar", "Romania", "Russia", "Rwanda", "Western Sahara",
  "Saudi Arabia", "Sudan", "South Sudan", "Senegal", "Sierra Leone",
  "El Salvador", "Serbia", "Suriname", "Slovakia", "Slovenia", "Sweden",
  "Swaziland", "Syria", "Chad", "Togo", "Thailand", "Tajikistan",
  "Turkmenistan", "Timor-Leste", "Tunisia", "Turkey", "Taiwan",
  "Tanzania", "Uganda", "Ukraine", "Uruguay", "United States",
  "Uzbekistan", "Venezuela", "Vietnam", "Vanuatu", "Yemen",
  "South Africa", "Zambia", "Zimbabwe", "Somalia", "France",
  "Spain", "Aruba", "Anguilla", "Andorra", "Antigua and Barbuda",
  "Bahamas", "Bermuda", "Barbados", "Comoros", "Cape Verde",
  "Cayman Islands", "Dominica", "Falkland Islands", "Faeroe Islands",
  "Grenada", "Hong Kong", "Saint Kitts and Nevis", "Saint Lucia",
  "Liechtenstein", "Saint Martin (French)", "Maldives", "Malta",
  "Montserrat", "Mauritius", "New Caledonia", "Nauru", "Pitcairn Islands",
  "Puerto Rico", "French Polynesia", "Singapore", "Solomon Islands",
  "São Tomé and Principe", "Saint Martin (Dutch)", "Seychelles",
  "Turks and Caicos Islands", "Tonga", "Trinidad and Tobago",
  "Saint Vincent and the Grenadines", "British Virgin Islands",
  "United States Virgin Islands", "Cyprus", "Reunion (France)",
  "Mayotte (France)", "Martinique (France)", "Guadeloupe (France)",
  "Curacao (Netherlands)", "Canary Islands (Spain)"
];

interface LocationSelectorProps {
  onSelect: (location: string) => void;
  selectedLocation?: string; // Add this new prop to receive the selected location from parent
}

export default function LocationSelector({ onSelect, selectedLocation = "" }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(selectedLocation || "");
  const [dropdownAbove, setDropdownAbove] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input value when selectedLocation prop changes
  useEffect(() => {
    if (selectedLocation) {
      setInputValue(selectedLocation);
    }
  }, [selectedLocation]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setDropdownAbove(spaceBelow < 200);
    }
  }, [isOpen]);

  const handleLocationChange = (location: string) => {
    setInputValue(location);
    onSelect(location);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleInputClick = () => {
    setIsOpen(true);
    inputRef.current?.select();
  };

  const handleImageClick = () => {
    setIsOpen(true);
  };

  const filteredCountries = inputValue
    ? countries.filter((country) =>
        country.toLowerCase().includes(inputValue.toLowerCase())
      )
    : countries;

  return (
    <div className="relative w-full max-w-[150]" ref={dropdownRef}>
      <div className="flex flex-col items-center" onClick={handleImageClick}>
        <img src="/globe.png" alt="Globe" className="w-110 h-110 cursor-pointer" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue.toUpperCase()}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder="LOCATION"
          className="w-full text-xl text-[#3d2b1f] mb-6 mt-[-10%] font-semibold bg-transparent outline-none placeholder-[#3d2b1f] text-center"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`absolute ${dropdownAbove ? "bottom-full mb-1" : "top-full mt-1"} 
            bg-amber-50 border border-amber-900/30 text-amber-950 z-50 shadow-md rounded-md w-full 
            max-h-60 overflow-y-auto`}
            initial={{ opacity: 0, y: dropdownAbove ? 5 : -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dropdownAbove ? 5 : -5 }}
            transition={{ duration: 0.2 }}
          >
            {filteredCountries.map((country) => (
              <div
                key={country}
                className="px-4 py-2 cursor-pointer hover:bg-amber-100 transition-all"
                onClick={() => handleLocationChange(country)}
              >
                {country}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}