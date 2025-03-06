"use client";

import React from "react";
import { Dialog } from "@/components/ui";
import { X } from "lucide-react";
import StardustText from "./StardustText";

export default function EventsDialog({
  open,
  onOpenChange,
  events = [],
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events?: any; // ✅ Allow any type temporarily to prevent crashes
}) {
  const eventList = Array.isArray(events) ? events : []; // ✅ Ensure it's always an array

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="relative w-[85%] h-[85%] rounded-2xl overflow-hidden shadow-2xl flex flex-col bg-cover bg-center"
          style={{ backgroundImage: "url('/background.svg')" }}
        >
          {/* Header */}
          <div className="bg-[#3d2b1f] text-[#e6d2b5] p-4 pl-8 pr-6 flex justify-between items-center">
            <h2 className="text-3xl font-bold">
              <StardustText density={3} color="#FFD700">
              Historical Events
              </StardustText>
              </h2>
            <button
              onClick={() => onOpenChange(false)}
              className="group transition-all duration-300 ease-in-out"
            >
              <div className="bg-[#5d4c2e] bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 transition-all duration-300 ease-in-out">
                <X className="text-[#e6d2b5] group-hover:text-white transition-colors duration-300" size={24} strokeWidth={2} />
              </div>
            </button>
          </div>

          {/* Events List */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {eventList.length > 0 ? ( // ✅ Use `eventList` to prevent crashes
              <ul className="divide-y divide-[#5d4c2e]">
                {eventList.map((event, index) => (
                  <li key={index} className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-[#3d2b1f]">{event.title || "Unknown Event"}</h3>
                        <p className="italic font-medium text-[#5d4c2e] text-lg mt-1">{event.description || "No description available."}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#5d4c2e]">{event.era || "Unknown Era"}</p>
                        <p className="font-semibold text-[#5d4c2e]">{event.year || "N/A"}</p>
                      </div>
                    </div>
                    <div className="mt-2 mb-2 text-[#5d4c2e]">
                      <span className="bg-[#3d2b1f] bg-opacity-90 text-[#e6d2b5] px-2 py-1 rounded mr-2">{event.category || "General"}</span>
                      <span className="font-semibold">{event.region || "Unknown Location"}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xl text-center text-[#5d4c2e]">No events found for the selected filters.</p>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
