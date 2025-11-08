// Chatbot.js
import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { Send } from "lucide-react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  // 🧠 Load chat history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const res = await fetch("http://localhost:5000/api/chat/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.history) setMessages(data.history);
      } catch (err) {
        console.error("Error loading chat history:", err);
      }
    };
    fetchHistory();
  }, [user]);

  // ✉ Send message to backend
  const handleSend = async () => {
    if (!input.trim() || !user) return;
    setLoading(true);

    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const token = await user.getIdToken();
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      if (data.reply) {
        const aiMessage = { sender: "ai", text: data.reply };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "Sorry, I couldn’t process that." },
        ]);
      }
    } catch (err) {
      console.error("Error fetching AI:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Failed to fetch AI response." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 relative overflow-hidden">
      {/* Glowing animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-200 via-white to-indigo-200 opacity-60 animate-pulse"></div>

      {/* Chat container */}
      <div className="z-10 w-full max-w-2xl p-6 bg-white/40 backdrop-blur-lg shadow-2xl rounded-2xl border border-white/30">
        <h1 className="text-2xl font-semibold text-center text-purple-700 mb-4 flex items-center justify-center gap-2">
          🤖 AI Chatbot
        </h1>

        {/* Chat messages */}
        <div className="h-[400px] overflow-y-auto space-y-4 p-4 rounded-xl bg-white/30 backdrop-blur-md shadow-inner border border-white/40">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 italic">
              Start the conversation 👇
            </p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl shadow ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                      : "bg-white/70 text-gray-800 border border-white/40"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}

          {loading && (
            <p className="text-gray-500 text-sm text-center animate-pulse">
              🤔 Thinking...
            </p>
          )}
        </div>

        {/* Input area */}
        <div className="mt-4 flex items-center gap-2">
          <input
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:scale-105 transition-transform shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Send size={18} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;