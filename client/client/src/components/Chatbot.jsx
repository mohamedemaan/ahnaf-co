import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Chatbot() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! 👋 I'm Ahnaf & Co AI Assistant. How can I help you shop today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message
    const newMessages = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/chat",
        {
          message: userMessage,
          history: messages.slice(-6),
        }
      );

      setMessages([
        ...newMessages,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, AI is offline right now! 😔",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickReplies = [
    "Best products?",
    "Track my order",
    "Return policy?",
    "Offers today?",
  ];

  if (
    location.pathname === "/" ||
    location.pathname === "/landing" ||
    location.pathname.startsWith("/admin") ||
    location.pathname === "/myorders"
  ) {
    return null;
  }

  return (
    <>
      {/* ── Chat Button ── */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #58A6FF, #00FFB3)",
          boxShadow: "0 0 30px rgba(88,166,255,0.5)",
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="text-2xl font-black text-black"
            >
              ✕
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="text-2xl"
            >
              🤖
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="fixed bottom-28 right-6 z-50 w-96 rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: "#161B22",
              border: "1px solid #30363D",
              boxShadow: "0 0 40px rgba(88,166,255,0.2)",
            }}
          >

            {/* Header */}
            <div
              className="px-5 py-4 flex items-center gap-3"
              style={{
                background: "linear-gradient(135deg, rgba(88,166,255,0.15), rgba(0,255,179,0.15))",
                borderBottom: "1px solid #30363D",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{
                  background: "linear-gradient(135deg, #58A6FF, #00FFB3)",
                }}
              >
                🤖
              </motion.div>
              <div className="flex-1">
                <h3
                  className="font-black text-sm tracking-widest"
                  style={{ fontFamily: "JetBrains Mono", color: "#FFFFFF" }}
                >
                  Ahnaf & Co AI
                </h3>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full"
                    style={{ background: "#00FFB3" }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "#00FFB3" }}
                  >
                    Online
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMessages([{
                  role: "assistant",
                  content: "Hi! 👋 How can I help you shop today?",
                }])}
                className="text-xs px-3 py-1 rounded-lg"
                style={{ color: "#8B949E", border: "1px solid #30363D" }}
              >
                Clear
              </button>
            </div>

            {/* Messages */}
            <div
              className="p-4 overflow-y-auto flex flex-col gap-3"
              style={{ height: "350px" }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className="max-w-xs px-4 py-3 rounded-2xl text-sm"
                    style={{
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg, #58A6FF, #00FFB3)"
                          : "#1C2128",
                      color:
                        msg.role === "user" ? "#000000" : "#FFFFFF",
                      borderRadius:
                        msg.role === "user"
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                      border:
                        msg.role === "assistant"
                          ? "1px solid #30363D"
                          : "none",
                      fontWeight: msg.role === "user" ? "600" : "400",
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Loading */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div
                    className="px-4 py-3 rounded-2xl"
                    style={{
                      background: "#1C2128",
                      border: "1px solid #30363D",
                      borderRadius: "18px 18px 18px 4px",
                    }}
                  >
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -6, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                          className="w-2 h-2 rounded-full"
                          style={{ background: "#58A6FF" }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div
              className="px-4 py-2 flex gap-2 overflow-x-auto"
              style={{ borderTop: "1px solid #30363D" }}
            >
              {quickReplies.map((reply) => (
                <motion.button
                  key={reply}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setInput(reply);
                    setTimeout(() => sendMessage(), 100);
                  }}
                  className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                  style={{
                    border: "1px solid #30363D",
                    color: "#58A6FF",
                    background: "rgba(88,166,255,0.05)",
                  }}
                >
                  {reply}
                </motion.button>
              ))}
            </div>

            {/* Input */}
            <div
              className="p-4 flex gap-3"
              style={{ borderTop: "1px solid #30363D" }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask me anything..."
                className="dark-input flex-1 text-sm"
                style={{ borderColor: "#30363D" }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold"
                style={{
                  background: "linear-gradient(135deg, #58A6FF, #00FFB3)",
                  opacity: !input.trim() ? 0.5 : 1,
                }}
              >
                <span className="text-black font-black">→</span>
              </motion.button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Chatbot;