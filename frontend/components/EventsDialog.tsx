import React from "react";
import { Dialog } from "@/components/ui";
import { X } from "lucide-react";

const eventData = [
  {
    id: 1,
    title: "Fall of the Roman Empire",
    era: "Ancient",
    year: 476,
    description:
      "The deposition of Romulus Augustulus marks the end of the Western Roman Empire.",
    category: "War",
    region: "Europe",
  },
  {
    id: 2,
    title: "Renaissance Begins",
    era: "Medieval",
    year: 1300,
    description:
      "A period of cultural rebirth and artistic innovation in Europe.",
    category: "Art",
    region: "Europe",
  },
  {
    id: 3,
    title: "Industrial Revolution",
    era: "1800s",
    year: 1760,
    description:
      "A period of major industrialization and technological innovation.",
    category: "Science",
    region: "Europe",
  },
];

export default function EventsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="relative w-[85%] h-[85%] rounded-2xl overflow-hidden shadow-2xl flex flex-col bg-cover bg-center"
          style={{ backgroundImage: "url('/background.svg')" }}
        >
          {/* Header */}
          <div className="bg-[#3d2b1f] text-[#e6d2b5] p-4 pl-8 pr-6 flex justify-between items-center">
            <h2 className="text-3xl font-bold">Historical Events</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="group transition-all duration-300 ease-in-out"
            >
              <div className="bg-[#5d4c2e] bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 transition-all duration-300 ease-in-out">
                <X
                  className="text-[#e6d2b5] group-hover:text-white transition-colors duration-300"
                  size={24}
                  strokeWidth={2}
                />
              </div>
            </button>
          </div>

          {/* Events List */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <ul className="divide-y divide-[#5d4c2e]">
              {eventData.map((event) => (
                <li key={event.id} className="py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-[#3d2b1f]">
                        {event.title}
                      </h3>
                      <p className="italic font-medium text-[#5d4c2e] text-lg mt-1">{event.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#5d4c2e]">{event.era} Era</p>
                      <p className="font-semibold text-[#5d4c2e]">{event.year}</p>
                    </div>
                  </div>
                  <div className="mt-2 mb-2 text-[#5d4c2e]">
                    <span className="bg-[#3d2b1f] bg-opacity-90 text-[#e6d2b5] px-2 py-1 rounded mr-2">
                      {event.category}
                    </span>
                    <span className="font-semibold">{event.region}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
