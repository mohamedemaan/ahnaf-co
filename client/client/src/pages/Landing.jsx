import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white relative overflow-hidden font-sans">

      {/* ── Grid Background ── */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Hero Section ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">

        <div className="relative flex justify-center items-center mb-8 gap-4 md:gap-6 mt-[-10vh]">
          <motion.span 
             initial={{ opacity: 0, scale: 0 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
             className="text-6xl md:text-8xl drop-shadow-md"
          >
             🛍️
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 relative z-10 drop-shadow-sm"
          >
            Ahnaf & Co
          </motion.h2>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xl mb-4 max-w-2xl text-slate-500 font-medium relative z-10"
        >
          Next-Generation AI Shopping Experience.<br/>Smart. Fast. Secure.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm mb-12 tracking-widest text-blue-600 font-bold relative z-10"
        >
          ► SHOP SMARTER WITH AI
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="relative z-10 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(37, 99, 235, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-12 py-5 text-lg font-bold rounded-full shadow-xl shadow-blue-600/30 transition-all"
          >
            Start Shopping 🚀
          </motion.button>
        </motion.div>

      </div>

    </div>
  );
}

export default Landing;