import { motion, AnimatePresence } from 'framer-motion';
import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const config = {
    success: { icon: '✅', color: '#00FFB3', bg: 'rgba(0,255,179,0.1)', border: 'rgba(0,255,179,0.3)' },
    error:   { icon: '❌', color: '#F85149', bg: 'rgba(248,81,73,0.1)', border: 'rgba(248,81,73,0.3)' },
    info:    { icon: 'ℹ️', color: '#58A6FF', bg: 'rgba(88,166,255,0.1)', border: 'rgba(88,166,255,0.3)' },
    warning: { icon: '⚠️', color: '#FFA657', bg: 'rgba(255,166,87,0.1)', border: 'rgba(255,166,87,0.3)' },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div style={{
        position: 'fixed', top: '24px', right: '24px',
        zIndex: 99999, display: 'flex',
        flexDirection: 'column', gap: '10px'
      }}>
        <AnimatePresence>
          {toasts.map(toast => {
            const c = config[toast.type] || config.success;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0,   scale: 1   }}
                exit={{    opacity: 0, x: 100, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{
                  padding: '14px 20px',
                  borderRadius: '14px',
                  background: c.bg,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${c.border}`,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.3)`,
                  display: 'flex', alignItems: 'center', gap: '10px',
                  minWidth: '260px', maxWidth: '360px'
                }}
              >
                <span style={{ fontSize: '18px' }}>{c.icon}</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>
                  {toast.message}
                </span>

                {/* Progress Bar */}
                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 3, ease: 'linear' }}
                  style={{
                    position: 'absolute', bottom: 0, left: 0,
                    height: '3px', width: '100%',
                    background: c.color,
                    transformOrigin: 'left',
                    borderRadius: '0 0 14px 14px'
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};