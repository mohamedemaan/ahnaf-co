import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const features = [
    { icon: "🤖", title: "AI Powered", desc: "Smart recommendations" },
    { icon: "🔒", title: "OTP Secure", desc: "Email verification" },
    { icon: "🚀", title: "Fast Delivery", desc: "Cash on delivery" },
    { icon: "💎", title: "Premium UI", desc: "3D experience" },
  ];

  return (
    <div
      className="min-h-screen particle-bg relative overflow-hidden"
      style={{ cursor: "none" }}
    >

      {/* ── Custom Cursor ── */}
      <motion.div
        className="fixed w-6 h-6 rounded-full pointer-events-none z-50"
        style={{
          background: "rgba(88,166,255,0.5)",
          border: "2px solid #58A6FF",
          left: mousePos.x - 12,
          top: mousePos.y - 12,
          boxShadow: "0 0 20px rgba(88,166,255,0.8)",
        }}
        animate={{ x: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />

      {/* ── Grid Background ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(88,166,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(88,166,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex items-center justify-between px-8 py-6"
        style={{ borderBottom: "1px solid #30363D" }}
      >
        <div className="flex items-center gap-3">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="text-3xl"
          >
            🛍️
          </motion.span>
          <div>
            <h1
              className="text-xl font-black tracking-widest gradient-text"
              style={{ fontFamily: "JetBrains Mono" }}
            >
              AHNAF
            </h1>
            <p
              className="text-xs tracking-widest"
              style={{ color: "#8B949E", fontFamily: "JetBrains Mono" }}
            >
              ENTERPRISES
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="px-6 py-2 rounded-xl font-semibold text-sm transition"
            style={{
              border: "1px solid #58A6FF",
              color: "#58A6FF",
              background: "transparent",
            }}
          >
            Login
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/register")}
            className="cyber-btn px-6 py-2 text-sm"
          >
            Get Started →
          </motion.button>
        </div>
      </motion.nav>

      {/* ── Hero Section ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center -mt-20">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 px-4 py-2 rounded-full text-xs font-semibold"
          style={{
            border: "1px solid #00FFB3",
            color: "#00FFB3",
            background: "rgba(0,255,179,0.05)",
            fontFamily: "JetBrains Mono",
          }}
        >
          ✦ AI-POWERED COMMERCE PLATFORM
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-6xl md:text-8xl font-black mb-6 leading-tight"
        >
          <span className="gradient-text">AHNAF</span>
          <br />
          <span style={{ color: "#FFFFFF" }}>ENTERPRISES</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xl mb-4 max-w-2xl"
          style={{ color: "#8B949E" }}
        >
          Next-Generation AI Shopping Experience.
          Smart. Fast. Secure.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm mb-10 tracking-widest"
          style={{ color: "#00FFB3", fontFamily: "JetBrains Mono" }}
        >
          ► SHOP SMARTER WITH AI
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex gap-4 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/register")}
            className="cyber-btn px-10 py-4 text-lg font-bold rounded-2xl"
          >
            Start Shopping 🚀
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/splash")}
            className="px-10 py-4 text-lg font-semibold rounded-2xl transition"
            style={{
              border: "1px solid #30363D",
              color: "#8B949E",
              background: "transparent",
            }}
          >
            Watch Intro ▶
          </motion.button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              className="dark-card p-5 text-center"
            >
              <div className="text-3xl mb-2">{f.icon}</div>
              <h3 className="font-bold text-sm mb-1">{f.title}</h3>
              <p className="text-xs" style={{ color: "#8B949E" }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* ── Stats Bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="relative z-10 border-t border-b py-6 px-8"
        style={{ borderColor: "#30363D" }}
      >
        <div className="flex justify-center gap-16 flex-wrap">
          {[
            { value: "10K+", label: "Products" },
            { value: "5K+", label: "Happy Customers" },
            { value: "99%", label: "Satisfaction" },
            { value: "24/7", label: "AI Support" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-black gradient-text">{stat.value}</p>
              <p className="text-xs" style={{ color: "#8B949E" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Footer ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="relative z-10 text-center py-6"
        style={{ color: "#8B949E", fontSize: "12px" }}
      >
        © 2026 Ahnaf Enterprises. All rights reserved.
      </motion.div>

    </div>
  );
}

export default Landing;