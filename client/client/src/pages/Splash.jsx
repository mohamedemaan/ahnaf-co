import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Splash() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(1); // 1: Icons, 2: Text, 3: Exit

  useEffect(() => {
    // Sequence the animations
    const phase2Timer = setTimeout(() => setPhase(2), 1200);
    const phase3Timer = setTimeout(() => setPhase(3), 2600);
    const navTimer = setTimeout(() => navigate("/landing"), 3000);

    return () => {
      clearTimeout(phase2Timer);
      clearTimeout(phase3Timer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden font-sans"
        >
          {/* Subtle background glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute w-[600px] h-[600px] bg-slate-400 rounded-full blur-[120px]"
          />

          <div className="relative z-10 flex flex-col items-center">
            
            {/* Phase 1: Floating Icons */}
            <AnimatePresence mode="wait">
              {phase === 1 && (
                <motion.div 
                  className="flex gap-6 text-4xl text-slate-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.5, staggerChildren: 0.1 }}
                >
                  <motion.span 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                  >🛒</motion.span>
                  <motion.span 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                  >📦</motion.span>
                  <motion.span 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
                  >💳</motion.span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phase 2: Brand Name */}
            <AnimatePresence>
              {phase === 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.1, filter: "blur(5px)" }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.16, 1, 0.3, 1] // Custom snappy spring easing
                  }}
                  className="text-center"
                >
                  <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-white to-slate-300 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    Ahnaf & Co
                  </h1>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="h-[2px] w-16 bg-white/40 mx-auto mt-4 rounded-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Splash;