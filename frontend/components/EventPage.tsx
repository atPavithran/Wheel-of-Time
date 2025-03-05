import React from "react";

const EventPage: React.FC = () => {
  return (
    <div
      className="flex justify-center items-center min-h-screen bg-fixed bg-center bg-contain"
      style={{ backgroundImage: "url('/event-bg.jpg')" } as React.CSSProperties} // Typed CSS properties
    >
      {/* Main Content Box */}
      <div className="flex max-w-5xl w-[90%] items-center space-x-10">
        
        {/* Framed Image */}
        <div className="w-[300px] h-[420px]">
          <img 
            src="/event-image.jpg" 
            alt="Historical Event" 
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        {/* Event Text */}
        <div className="max-w-lg text-[#2D1E17] font-[Jacques Francois] leading-relaxed pl-10">
          <h2 className="text-4xl font-bold mb-4">World War II</h2>
          <p className="text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam euismod id sem quis accumsan. 
            Sed tempus placerat velit a placerat. Cras suscipit est at mauris blandit efficitur finibus non augue. 
            Sed tempus placerat velit a placerat.
          </p>
        </div>

      </div>
    </div>
  );
};

export default EventPage;
