import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Pixel-perfect SVG reproduction of Ahnaf & Co's 3D dual shopping bags
function AhnafShoppingBags({ className = "w-28 h-28 sm:w-36 sm:h-36" }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 200 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_12px_24px_rgba(37,99,235,0.22)]"
      >
        <defs>
          {/* Orange Bag Gradients */}
          <linearGradient id="amberBagGrad" x1="120" y1="45" x2="175" y2="155" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <linearGradient id="amberHandleGrad" x1="130" y1="20" x2="160" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Blue Bag Striped Gradients */}
          <linearGradient id="blueHandleGrad" x1="55" y1="5" x2="95" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="blueTier1" x1="25" y1="42" x2="125" y2="65" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="blueTier2" x1="25" y1="65" x2="125" y2="88" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="blueTier3" x1="25" y1="88" x2="125" y2="111" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="blueTier4" x1="25" y1="111" x2="125" y2="138" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>

          {/* Ambient bag soft shadows */}
          <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* ================= BACK BAG (Orange / Amber) ================= */}
        <g id="OrangeBag">
          {/* Amber Handle */}
          <path
            d="M 132 50 C 132 28, 164 28, 164 50"
            stroke="url(#amberHandleGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          {/* Amber Bag Body */}
          <rect
            x="114"
            y="48"
            width="64"
            height="76"
            rx="12"
            fill="url(#amberBagGrad)"
            filter="url(#softShadow)"
          />
          {/* Subtle 3D Fold highlight */}
          <path
            d="M 118 52 L 174 52"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* ================= FRONT BAG (Tiered Cyan / Royal Blue) ================= */}
        <g id="BlueBag">
          {/* Blue Handle */}
          <path
            d="M 52 46 C 52 12, 98 12, 98 46"
            stroke="url(#blueHandleGrad)"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />

          {/* Tier 1 - Top Rib */}
          <rect x="25" y="44" width="100" height="23" rx="8" fill="url(#blueTier1)" />
          {/* Tier 1 inner shine */}
          <path d="M 32 47 L 118 47" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" />

          {/* Tier 2 - Upper Middle Rib */}
          <rect x="25" y="68" width="100" height="23" rx="8" fill="url(#blueTier2)" />
          <path d="M 32 71 L 118 71" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />

          {/* Tier 3 - Lower Middle Rib */}
          <rect x="25" y="92" width="100" height="23" rx="8" fill="url(#blueTier3)" />
          <path d="M 32 95 L 118 95" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />

          {/* Tier 4 - Bottom Base */}
          <rect x="25" y="116" width="100" height="25" rx="10" fill="url(#blueTier4)" />
          <path d="M 32 119 L 118 119" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

export default function AdminLanding() {
  const navigate = useNavigate();
  const [introFinished, setIntroFinished] = useState(false);

  // Marquee item list for continuous admin ticker
  const marqueeItems = [
    { icon: "🚀", text: "Live Operations Dashboard" },
    { icon: "📦", text: "Real-Time Order Tracking" },
    { icon: "👥", text: "Customer Insights & CRM" },
    { icon: "📈", text: "AI-Powered Revenue Analytics" },
    { icon: "⚙️", text: "Global System Controls" },
    { icon: "🛡️", text: "Enterprise Role Security" },
    { icon: "⚡", text: "Instant Catalog Sync" },
  ];

  // 1.8s sleek introductory animation timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroFinished(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-white flex flex-col justify-between overflow-x-hidden font-sans select-none">
      
      {/* ================= SUBTLE GRID BACKGROUND ================= */}
      {/* Matches the exact Ahnaf & Co screenshot grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(226, 232, 240, 0.75) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(226, 232, 240, 0.75) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
        }}
      />

      {/* Gentle center spotlight glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-100/35 rounded-full blur-3xl pointer-events-none" />

      {/* ================= INTRO SPLASH OVERLAY (1.5s - 2s) ================= */}
      <AnimatePresence>
        {!introFinished && (
          <motion.div
            key="intro-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(226, 232, 240, 0.8) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(226, 232, 240, 0.8) 1px, transparent 1px)
              `,
              backgroundSize: "44px 44px",
            }}
          >
            {/* Animated Logo Scaling */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-5"
            >
              <div className="relative">
                {/* Pulse ring effect */}
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-blue-200/50 rounded-full blur-xl"
                />
                <AhnafShoppingBags className="w-24 h-24 sm:w-32 sm:h-32 relative z-10" />
              </div>

              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">
                  Ahnaf & Co
                </h2>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mt-1">
                  Admin Workspace Suite
                </p>
              </div>

              {/* Progress Loading Bar */}
              <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2 relative">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 1.6, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                />
              </div>
            </motion.div>

            {/* Quick Skip button */}
            <button
              onClick={() => setIntroFinished(true)}
              className="absolute bottom-8 text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-wider"
            >
              Skip Intro →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= TOP BRAND NAVIGATION BAR ================= */}
      <header className="relative z-10 w-full px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/25">
            A
          </div>
          <span className="font-extrabold text-slate-800 text-lg tracking-tight">
            Ahnaf <span className="text-blue-600">& Co</span>
          </span>
          <span className="hidden sm:inline-block px-2.5 py-0.5 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 rounded-full">
            Admin Console v2.0
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-bold text-slate-600 hover:text-blue-600 px-3.5 py-2 transition-colors rounded-xl hover:bg-slate-50"
          >
            Admin Sign In
          </button>
          <button
            onClick={() => navigate("/register")}
            className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-sm transition-all hover:shadow-md hover:shadow-blue-500/20 active:scale-95"
          >
            Register
          </button>
        </div>
      </header>

      {/* ================= MAIN HERO SECTION ================= */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-3xl flex flex-col items-center text-center"
        >
          {/* Dual Shopping Bag Graphic + Ahnaf & Co Title */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-4">
            <motion.div
              whileHover={{ scale: 1.06, rotate: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="cursor-pointer"
            >
              <AhnafShoppingBags className="w-24 h-24 sm:w-32 sm:h-32" />
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-[#2563EB] tracking-tight drop-shadow-sm">
              Ahnaf & Co
            </h1>
          </div>

          {/* Subtitle description */}
          <p className="text-slate-600 text-base sm:text-xl font-medium mt-1 leading-snug">
            Next-Generation AI Admin Operations Suite.
          </p>
          <p className="text-slate-600 text-base sm:text-xl font-medium leading-snug">
            Smart. Fast. Secure.
          </p>

          {/* Blue Arrow Action Tag (Exact Reference match) */}
          <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm font-black text-blue-600 tracking-wider uppercase">
            <span>►</span>
            <span>CONTROL SMARTER WITH ENTERPRISE AI</span>
          </div>

          {/* ================= CONTINUOUS MOTION MARQUEE ================= */}
          <div className="w-full max-w-xl mx-auto my-7 sm:my-9 overflow-hidden relative rounded-2xl py-2.5 bg-slate-50/80 border border-slate-200/70 shadow-inner">
            {/* Edge Fades for Clean Infinite Look */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

            <motion.div
              className="flex whitespace-nowrap gap-6"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 18,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {[...marqueeItems, ...marqueeItems].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 shrink-0"
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.text}</span>
                  <span className="text-slate-300 ml-4 font-normal">•</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ================= PRIMARY CTA BUTTON ================= */}
          {/* Matches the blue pill button from the Ahnaf & Co reference image */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="relative mt-2"
          >
            {/* Glowing ambient drop-shadow beneath button */}
            <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-40 -z-10 group-hover:opacity-70 transition-opacity" />

            <button
              onClick={() => navigate("/login")}
              className="px-10 sm:px-12 py-3.5 sm:py-4 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-base sm:text-lg font-bold rounded-full shadow-[0_15px_30px_-5px_rgba(37,99,235,0.45)] transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Let's Start Work</span>
              <span className="text-xl">🚀</span>
            </button>
          </motion.div>

          {/* Quick Sub-navigation */}
          <p className="mt-5 text-xs text-slate-400 font-medium">
            Ready to manage orders & inventory?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 font-bold hover:underline ml-1"
            >
              Sign In
            </button>{" "}
            or{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 font-bold hover:underline"
            >
              Create Admin Account
            </button>
          </p>
        </motion.div>
      </main>

      {/* ================= CLEAN FOOTER ================= */}
      <footer className="relative z-10 w-full py-4 px-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 max-w-7xl mx-auto gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Ahnaf & Co Admin Services: Operational (99.98% Uptime)</span>
        </div>
        <div>
          © {new Date().getFullYear()} Ahnaf & Co. Enterprise Cloud Management.
        </div>
      </footer>
    </div>
  );
}
