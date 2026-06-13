import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: '👋 Hi! I\'m EmmanStore\'s AI assistant. How can I help you today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      // Send only last 10 messages to avoid token overflow
      const history = updatedMessages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }));

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chatbot/message`,
        { message: input, history: history.slice(0, -1) }
      );

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.reply }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '⚠️ Sorry, something went wrong. Try again!' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            style={{
              width: '340px',
              height: '480px',
              marginBottom: '16px',
              borderRadius: '16px',
              background: 'rgba(15, 15, 25, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0, 255, 255, 0.2)',
              boxShadow: '0 0 30px rgba(0, 255, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px',
              background: 'linear-gradient(135deg, rgba(0,255,255,0.1), rgba(139,0,255,0.1))',
              borderBottom: '1px solid rgba(0,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00ffff, #8b00ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px'
                }}>🤖</div>
                <div>
                  <div style={{ color: '#00ffff', fontWeight: '700', fontSize: '14px' }}>
                    EmmanBot
                  </div>
                  <div style={{ color: '#00ff88', fontSize: '11px' }}>
                    ● Online
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none', border: 'none', color: '#888',
                  fontSize: '20px', cursor: 'pointer', lineHeight: 1
                }}
              >×</button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '16px',
              display: 'flex', flexDirection: 'column', gap: '12px'
            }}>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  <div style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' 
                      ? '16px 16px 4px 16px' 
                      : '16px 16px 16px 4px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #00ffff22, #8b00ff33)'
                      : 'rgba(255,255,255,0.05)',
                    border: msg.role === 'user'
                      ? '1px solid rgba(0,255,255,0.3)'
                      : '1px solid rgba(255,255,255,0.1)',
                    color: '#e0e0e0',
                    fontSize: '13px',
                    lineHeight: '1.5'
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: 'flex', gap: '6px', padding: '4px 0' }}>
                  {[0,1,2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                      style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: '#00ffff'
                      }}
                    />
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid rgba(0,255,255,0.1)',
              display: 'flex', gap: '8px'
            }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                style={{
                  flex: 1, padding: '10px 14px',
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(0,255,255,0.2)',
                  color: '#fff', fontSize: '13px', outline: 'none'
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00ffff, #8b00ff)',
                  border: 'none', cursor: 'pointer',
                  fontSize: '16px', opacity: loading || !input.trim() ? 0.5 : 1
                }}
              >➤</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #00ffff, #8b00ff)',
          border: 'none', cursor: 'pointer', fontSize: '24px',
          boxShadow: '0 0 20px rgba(0,255,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        {isOpen ? '✕' : '🤖'}
      </motion.button>
    </div>
  );
};

export default AIChatbot;