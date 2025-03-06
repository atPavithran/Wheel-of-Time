"use client";

import React, { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from "react";

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
  const [loading, setLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null); // ✅ Ref for auto-scrolling
  const inputRef = useRef<HTMLInputElement | null>(null); // ✅ Ref for keeping the cursor in input

  // ✅ Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to send a message
  const sendMessage = async (): Promise<void> => {
    if (input.trim() === "") return;

    // Add user message to chat
    setMessages((prevMessages) => [...prevMessages, { text: input, sender: "user" }]);
    setInput(""); // Clear input field
    setLoading(true);

    try {
      // Fetch response from FastAPI backend
      const response = await fetch(`http://localhost:8000/chatbot?question=${encodeURIComponent(input)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Add bot response using functional update
      setMessages((prevMessages) => [...prevMessages, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [...prevMessages, { text: "Error fetching response. Try again.", sender: "bot" }]);
    }

    setLoading(false);

    // ✅ Keep the cursor in the input field
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <div 
      className="flex justify-center items-center min-h-screen bg-fixed bg-center bg-cover px-16"
      style={{ backgroundImage: "url('/chatbot-bg.jpg')" }}
    >
      <div className="relative flex max-w-6xl w-full items-center">
        
        {/* Historian Character on the Left (Flipped) */}
        <img 
          src="/new-historian.png" 
          alt="Historian" 
          className="w-[450px] h-[500px] mr-10 transform scale-x-[-1] pointer-events-none"
        />

        {/* Chat Window with Wooden Frame */}
        <div
          className="relative p-6 w-[600px] min-w-[700px] h-[480px] flex flex-col"
          style={{
            backgroundColor: "transparent",
            borderImageSource: "url('/wooden-frame.png')",
            borderImageSlice: "30",
            borderImageRepeat: "stretch",
            borderWidth: "20px",
            borderStyle: "solid",
            boxShadow: "0 12px 35px rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(2px)",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: "10px",
          }}
        >

          {/* Messages Section */}
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
            <div ref={messagesEndRef} /> {/* ✅ Auto-scroll to this element */}
          </div>

          {/* Input Field Positioned Higher */}
          <div className="flex items-center w-full px-4 pb-4">
            <input
              ref={inputRef} // ✅ Keeps the cursor in the input box
              type="text"
              value={input}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && sendMessage()}
              className="flex-grow p-3 border border-black rounded-l-lg focus:outline-none text-black placeholder-black bg-white"
              placeholder="Ask Anything..."
              disabled={loading}
            />
            <button 
              onClick={sendMessage} 
              className="bg-[#5C3A1D] text-white px-5 py-3 rounded-r-lg shadow-md hover:bg-[#4a2c17] transition duration-200"
              disabled={loading}
            >
              ➤
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Chatbot;
