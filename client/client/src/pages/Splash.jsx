import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Splash() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  const steps = [
    "Initializing AI Systems...",
    "Loading Product Engine...",
    "Connecting Database...",
    "Starting Recommendation AI...",
    "Welcome to Ahnaf Enterprises!",
  ];

  useEffect(() => {
    // Progress bar
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    // Steps
    const stepTimers = steps.map((_, i) =>
      setTimeout(() => setCurrentStep(i), i * 600)
    );

    // Navigate
    const navTimer = setTimeout(() => {
      setDone(true);
      setTimeout(() => navigate("/"), 800);
    }, 3500);

    return () => {
      clearInterval(progressTimer);
      stepTimers.forEach(clearTimeout);
      clearTimeout(navTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen particle-bg flex flex-col items-center justify-center relative overflow-hidden"
        >

          {/* ── Scan Line Effect ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(transparent 50%, rgba(88,166,255,0.02) 50%)",
              backgroundSize: "100% 4px",
            }}
          />

          {/* ── Corner Decorations ── */}
          {["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"].map((pos, i) => (
            <motion.div
              key={i}
              className={`absolute ${pos} w-8 h-8`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div
                className="w-full h-full"
                style={{
                  border: "2px solid #58A6FF",
                  borderRadius: i === 0 ? "8px 0 0 0" : i === 1 ? "0 8px 0 0" : i === 2 ? "0 0 0 8px" : "0 0 8px 0",
                  borderRight: i === 0 || i === 2 ? "none" : undefined,
                  borderLeft: i === 1 || i === 3 ? "none" : undefined,
                  borderBottom: i === 0 || i === 1 ? "none" : undefined,
                  borderTop: i === 2 || i === 3 ? "none" : undefined,
                }}
              />
            </motion.div>
          ))}

          {/* ── Floating Particles ── */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                background: i % 2 === 0 ? "#58A6FF" : "#00FFB3",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.3,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* ── Logo ── */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="mb-8 relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 rounded-full absolute inset-0"
              style={{
                background: "conic-gradient(from 0deg, #58A6FF, #00FFB3, #BC8CFF, #58A6FF)",
                padding: "2px",
              }}
            />
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center relative z-10"
              style={{ background: "#0D1117", border: "3px solid transparent" }}
            >
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl"
              >
                🛍️
              </motion.span>
            </div>
          </motion.div>

          {/* ── Company Name ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center mb-2"
          >
            <h1
              className="text-5xl font-black tracking-widest gradient-text"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              AHNAF
            </h1>
            <h2
              className="text-2xl font-light tracking-[0.5em] mt-1"
              style={{ color: "#8B949E" }}
            >
              ENTERPRISES
            </h2>
          </motion.div>

          {/* ── Tagline ── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-sm mb-12 tracking-widest"
            style={{ color: "#00FFB3", fontFamily: "JetBrains Mono" }}
          >
            AI-POWERED COMMERCE
          </motion.p>

          {/* ── Steps ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mb-8 text-center h-6"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-sm"
                style={{
                  color: currentStep === 4 ? "#00FFB3" : "#58A6FF",
                  fontFamily: "JetBrains Mono",
                }}
              >
                {currentStep === 4 ? "✓" : "▶"} {steps[currentStep]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* ── Progress Bar ── */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "300px" }}
            transition={{ delay: 0.8 }}
            className="relative"
          >
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ background: "#161B22", width: "300px" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #58A6FF, #00FFB3)",
                  width: `${progress}%`,
                  boxShadow: "0 0 10px rgba(88,166,255,0.8)",
                }}
              />
            </div>
            <p
              className="text-center mt-2 text-xs"
              style={{ color: "#8B949E", fontFamily: "JetBrains Mono" }}
            >
              {progress}%
            </p>
          </motion.div>

          {/* ── Completed Steps ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 flex gap-6"
          >
            {["AI", "3D", "OTP", "COD"].map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 + i * 0.2 }}
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  border: "1px solid #30363D",
                  color: "#58A6FF",
                  fontFamily: "JetBrains Mono",
                }}
              >
                ✓ {tag}
              </motion.span>
            ))}
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Splash;