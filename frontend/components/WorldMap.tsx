"use client";

import React, { useState, useEffect, useRef } from "react";

interface Country {
  code: string;
  name: string;
}

export default function WorldMap() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [svgData, setSvgData] = useState<string>("");
  const [countryNames, setCountryNames] = useState<Record<string, string>>({});
  const mapRef = useRef<HTMLDivElement>(null);

  const mapInitialized = useRef(false);

  useEffect(() => {
    setCountryNames({
      AF: "Afghanistan",
      AO: "Angola",
      AL: "Albania",
      AE: "United Arab Emirates",
      AR: "Argentina",
      AM: "Armenia",
      AU: "Australia",
      AT: "Austria",
      AZ: "Azerbaijan",
      BI: "Burundi",
      BE: "Belgium",
      BJ: "Benin",
      BF: "Burkina Faso",
      BD: "Bangladesh",
      BG: "Bulgaria",
      BH: "Bahrain",
      BA: "Bosnia and Herzegovina",
      BY: "Belarus",
      BZ: "Belize",
      BO: "Bolivia",
      BR: "Brazil",
      BN: "Brunei Darussalam",
      BT: "Bhutan",
      BW: "Botswana",
      CF: "Central African Republic",
      CA: "Canada",
      CH: "Switzerland",
      CL: "Chile",
      CN: "China",
      CI: "Côte d'Ivoire",
      CM: "Cameroon",
      CD: "Democratic Republic of the Congo",
      CG: "Republic of Congo",
      CO: "Colombia",
      CR: "Costa Rica",
      CU: "Cuba",
      CZ: "Czech Republic",
      DE: "Germany",
      DJ: "Djibouti",
      DK: "Denmark",
      DO: "Dominican Republic",
      DZ: "Algeria",
      EC: "Ecuador",
      EG: "Egypt",
      ER: "Eritrea",
      EE: "Estonia",
      ET: "Ethiopia",
      FI: "Finland",
      FJ: "Fiji",
      GA: "Gabon",
      GB: "United Kingdom",
      GE: "Georgia",
      GH: "Ghana",
      GN: "Guinea",
      GM: "The Gambia",
      GW: "Guinea-Bissau",
      GQ: "Equatorial Guinea",
      GR: "Greece",
      GL: "Greenland",
      GT: "Guatemala",
      GY: "Guyana",
      HN: "Honduras",
      HR: "Croatia",
      HT: "Haiti",
      HU: "Hungary",
      ID: "Indonesia",
      IN: "India",
      IE: "Ireland",
      IR: "Iran",
      IQ: "Iraq",
      IS: "Iceland",
      IL: "Israel",
      IT: "Italy",
      JM: "Jamaica",
      JO: "Jordan",
      JP: "Japan",
      KZ: "Kazakhstan",
      KE: "Kenya",
      KG: "Kyrgyzstan",
      KH: "Cambodia",
      KR: "Republic of Korea",
      XK: "Kosovo",
      KW: "Kuwait",
      LA: "Lao PDR",
      LB: "Lebanon",
      LR: "Liberia",
      LY: "Libya",
      LK: "Sri Lanka",
      LS: "Lesotho",
      LT: "Lithuania",
      LU: "Luxembourg",
      LV: "Latvia",
      MA: "Morocco",
      MD: "Moldova",
      MG: "Madagascar",
      MX: "Mexico",
      MK: "Macedonia",
      ML: "Mali",
      MM: "Myanmar",
      ME: "Montenegro",
      MN: "Mongolia",
      MZ: "Mozambique",
      MR: "Mauritania",
      MW: "Malawi",
      MY: "Malaysia",
      NA: "Namibia",
      NE: "Niger",
      NG: "Nigeria",
      NI: "Nicaragua",
      NL: "Netherlands",
      NO: "Norway",
      NP: "Nepal",
      NZ: "New Zealand",
      OM: "Oman",
      PK: "Pakistan",
      PA: "Panama",
      PE: "Peru",
      PH: "Philippines",
      PG: "Papua New Guinea",
      PL: "Poland",
      KP: "Dem. Rep. Korea",
      PT: "Portugal",
      PY: "Paraguay",
      PS: "Palestine",
      QA: "Qatar",
      RO: "Romania",
      RU: "Russia",
      RW: "Rwanda",
      EH: "Western Sahara",
      SA: "Saudi Arabia",
      SD: "Sudan",
      SS: "South Sudan",
      SN: "Senegal",
      SL: "Sierra Leone",
      SV: "El Salvador",
      RS: "Serbia",
      SR: "Suriname",
      SK: "Slovakia",
      SI: "Slovenia",
      SE: "Sweden",
      SZ: "Swaziland",
      SY: "Syria",
      TD: "Chad",
      TG: "Togo",
      TH: "Thailand",
      TJ: "Tajikistan",
      TM: "Turkmenistan",
      TL: "Timor-Leste",
      TN: "Tunisia",
      TR: "Turkey",
      TW: "Taiwan",
      TZ: "Tanzania",
      UG: "Uganda",
      UA: "Ukraine",
      UY: "Uruguay",
      US: "United States",
      UZ: "Uzbekistan",
      VE: "Venezuela",
      VN: "Vietnam",
      VU: "Vanuatu",
      YE: "Yemen",
      ZA: "South Africa",
      ZM: "Zambia",
      ZW: "Zimbabwe",
      SO: "Somalia",
      GF: "France",
      FR: "France",
      ES: "Spain",
      AW: "Aruba",
      AI: "Anguilla",
      AD: "Andorra",
      AG: "Antigua and Barbuda",
      BS: "Bahamas",
      BM: "Bermuda",
      BB: "Barbados",
      KM: "Comoros",
      CV: "Cape Verde",
      KY: "Cayman Islands",
      DM: "Dominica",
      FK: "Falkland Islands",
      FO: "Faeroe Islands",
      GD: "Grenada",
      HK: "Hong Kong",
      KN: "Saint Kitts and Nevis",
      LC: "Saint Lucia",
      LI: "Liechtenstein",
      MF: "Saint Martin (French)",
      MV: "Maldives",
      MT: "Malta",
      MS: "Montserrat",
      MU: "Mauritius",
      NC: "New Caledonia",
      NR: "Nauru",
      PN: "Pitcairn Islands",
      PR: "Puerto Rico",
      PF: "French Polynesia",
      SG: "Singapore",
      SB: "Solomon Islands",
      ST: "São Tomé and Principe",
      SX: "Saint Martin (Dutch)",
      SC: "Seychelles",
      TC: "Turks and Caicos Islands",
      TO: "Tonga",
      TT: "Trinidad and Tobago",
      VC: "Saint Vincent and the Grenadines",
      VG: "British Virgin Islands",
      VI: "United States Virgin Islands",
      CY: "Cyprus",
      RE: "Reunion (France)",
      YT: "Mayotte (France)",
      MQ: "Martinique (France)",
      GP: "Guadeloupe (France)",
      CW: "Curacao (Netherlands)",
      IC: "Canary Islands (Spain)",
    });
  }, []);

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await fetch("/world.svg");
        if (!response.ok) throw new Error("Failed to load SVG");

        const svgText = await response.text();
        setSvgData(svgText);
      } catch (error) {
        console.error("Error loading SVG:", error);
      }
    };

    fetchSvg();
  }, []);

  useEffect(() => {
    if (
      !svgData ||
      !mapRef.current ||
      Object.keys(countryNames).length === 0 ||
      mapInitialized.current
    )
      return;

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgData, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    if (!svgElement) {
      console.error("Error parsing SVG.");
      return;
    }

    svgElement.setAttribute("width", "100%");
    svgElement.setAttribute("height", "100%");
    svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

    if (!svgElement.hasAttribute("viewBox")) {
      svgElement.setAttribute("viewBox", "0 0 1000 500");
    }

    const countries = svgElement.querySelectorAll(".sm_state");
    let currentSelectedElement: SVGElement | null = null;

    mapRef.current.innerHTML = "";
    mapRef.current.appendChild(svgElement);

    countries.forEach((country) => {
      const countryElement = country as SVGElement;
      const classNames = countryElement.getAttribute("class") || "";
      const countryMatch = classNames.match(/sm_state_([A-Z]{2})/);
      const countryCode = countryMatch ? countryMatch[1] : "";

      if (!countryCode) return;

      countryElement.setAttribute(
        "data-original-fill",
        countryElement.getAttribute("fill") || "#ffe9c9"
      );

      countryElement.setAttribute(
        "style",
        "pointer-events: all; cursor: pointer;"
      );

      countryElement.setAttribute("stroke-width", "5");
      countryElement.setAttribute("stroke", "transparent");

      countryElement.addEventListener("mouseenter", () => {
        if (selectedCountry?.code !== countryCode) {
          countryElement.setAttribute("fill", "#d8b57f");
        }
        setHoveredCountry({
          code: countryCode,
          name: countryNames[countryCode] || countryCode,
        });
      });

      countryElement.addEventListener("mouseleave", () => {
        if (selectedCountry?.code !== countryCode) {
          countryElement.setAttribute(
            "fill",
            countryElement.getAttribute("data-original-fill")!
          );
        }
        setHoveredCountry(null);
      });

      countryElement.addEventListener("click", () => {
        if (
          currentSelectedElement &&
          currentSelectedElement !== countryElement
        ) {
          currentSelectedElement.setAttribute(
            "fill",
            currentSelectedElement.getAttribute("data-original-fill")!
          );
        }

        currentSelectedElement = countryElement;

        countryElement.setAttribute("fill", "#b38c4d");
        setSelectedCountry({
          code: countryCode,
          name: countryNames[countryCode] || countryCode,
        });
      });
    });

    // Mark the map as initialized
    mapInitialized.current = true;

    return () => {
      // Clean up code
      if (mapRef.current) {
        mapRef.current.innerHTML = "";
      }
    };
  }, [svgData, countryNames]);

  return (
    <div className="relative w-full h-full">
      {/* <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-70 text-white p-3 rounded-md">
        {selectedCountry ? (
          <div className="font-medium">Selected: {selectedCountry.name}</div>
        ) : hoveredCountry ? (
          <div>Hovering: {hoveredCountry.name}</div>
        ) : (
          <div>Click on a country</div>
        )}
      </div> */}

      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
