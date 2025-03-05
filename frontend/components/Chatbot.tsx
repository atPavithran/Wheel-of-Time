"use client";

import React, { useState, ChangeEvent, KeyboardEvent } from "react";

// Define Message Type
interface Message {
  text: string;
  sender: "bot" | "user";
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Ask me anything about history", sender: "bot" },
  ]);
  const [input, setInput] = useState<string>("");

  // Function to send a message
  const sendMessage = (): void => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
  };

  return (
    <div 
      className="flex justify-center items-center min-h-screen bg-fixed bg-center bg-cover px-16"
      style={{ backgroundImage: "url('/chatbot-bg.jpg')" }} // Background should match the chatbot page
    >
      <div className="relative flex items-center space-x-6 max-w-4xl w-full">
        
        {/* Historian Character */}
        <img src="/historian.png" alt="Historian" className="w-[450px] h-auto ml-[-180px]" />

        {/* Chat Window (Transparent & Modernized) */}
        <div className="relative p-6 rounded-lg shadow-lg w-[600px] min-w-[700px] h-[480px] border border-black bg-opacity-30 backdrop-blur-md flex flex-col">
          
          {/* Messages */}
          <div className="flex flex-col space-y-3 min-h-[350px] max-h-[350px] overflow-y-auto p-4 scrollbar-hide">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 max-w-[75%] rounded-lg text-lg ${
                  msg.sender === "bot"
                    ? "bg-[#5C3A1D] text-white self-start shadow-md"
                    : "bg-white text-black self-end shadow-md"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Field */}
          <div className="flex mt-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && sendMessage()} // ✅ Send message on Enter
              className="flex-grow p-3 border border-black rounded-l-lg focus:outline-none text-black placeholder-black mr-2 bg-white"
              placeholder="Ask Anything..."
            />
            <button onClick={sendMessage} className="bg-[#5C3A1D] text-white px-5 py-3 rounded-r-lg shadow-md hover:bg-[#4a2c17] transition duration-200">
              ➤
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Chatbot;
