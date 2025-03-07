"use client";

import React from "react";
import { useRouter } from "next/navigation"; // ✅ Import router correctly at the top
import { Dialog } from "@/components/ui";
import { X } from "lucide-react";

export default function EventsDialog({
  open,
  onOpenChange,
  events = [],
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events?: any[];
}) {
  const router = useRouter(); // ✅ Initialize router here

  const eventList = Array.isArray(events) ? events : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="relative w-[85%] h-[85%] rounded-2xl overflow-hidden shadow-2xl flex flex-col bg-cover bg-center"
          style={{ backgroundImage: "url('/background.svg')" }}
        >
          {/* Header */}
          <div className="bg-[#3d2b1f] text-[#e6d2b5] p-4 flex justify-between items-center">
            <h2 className="text-3xl font-bold">Historical Events</h2>
            <button onClick={() => onOpenChange(false)} className="group transition-all duration-300">
              <X className="text-[#e6d2b5] group-hover:text-white transition-colors" size={24} />
            </button>
          </div>

          {/* Events List */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {eventList.length > 0 ? (
              <ul className="divide-y divide-[#5d4c2e]">
                {eventList.map((event, index) => (
                  <li key={index} className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        {/* ✅ Clicking the title now navigates to EventPage.tsx */}
                        <button
                          onClick={() => router.push(`/event?title=${encodeURIComponent(event.title)}`)}
                          className="text-2xl font-bold text-[#3d2b1f] hover:text-[#6a4f34] transition-colors"
                        >
                          {event.title || "Unknown Event"}
                        </button>
                        <p className="italic text-[#5d4c2e] mt-1">{event.description || "No description available."}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#5d4c2e]">{event.era || "Unknown Era"}</p>
                        <p className="font-semibold text-[#5d4c2e]">{event.year || "N/A"}</p>
                      </div>
                    </div>
                    <div className="mt-2 mb-2 text-[#5d4c2e]">
                      <span className="bg-[#3d2b1f] text-[#e6d2b5] px-2 py-1 rounded mr-2">{event.category || "General"}</span>
                      <span className="font-semibold">{event.place || "Unknown Location"}</span>
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
