import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function Register() {
  const navigate = useNavigate();
  const showToast = (message) => alert(message);
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", password: "", otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (!formData.email) { alert("Email enter pannu!"); return; }
    try {
      setLoading(true);
      await axios.post(`${API}/api/auth/send-otp`, {
        email: formData.email,
      });
      setOtpSent(true);
      alert("OTP sent! 📧");
    } catch {
      alert("OTP failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API}/api/auth/register`, formData);
      showToast('Account created! 🎉', 'success');
      navigate("/login");
    } catch (err) {
      showToast(err.response?.data?.message || 'Register failed!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "FULL NAME", placeholder: "Mohamed Ahnaf", type: "text" },
    { name: "phone", label: "PHONE NUMBER", placeholder: "+91 9876543210", type: "tel" },
  ];

  return (
    <div className="min-h-screen particle-bg flex items-center justify-center px-4 py-10 relative overflow-hidden">

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

      {/* ── Floating Orbs ── */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute top-20 right-20 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(188,140,255,0.1), transparent)",
          filter: "blur(40px)",
        }}
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
        transition={{ duration: 9, repeat: Infinity }}
        className="absolute bottom-20 left-20 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,255,179,0.1), transparent)",
          filter: "blur(40px)",
        }}
      />

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="glass w-full max-w-md p-8 relative z-10"
      >

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="text-5xl mb-3 inline-block"
          >
            🛍️
          </motion.div>
          <h1
            className="text-2xl font-black tracking-widest gradient-text"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            AHNAF ENTERPRISES
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8B949E" }}>
            Create Your Account 🚀
          </p>
        </motion.div>

        <form onSubmit={registerUser}>

          {/* Name + Phone */}
          {fields.map((field, i) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="mb-4"
            >
              <label
                className="text-xs font-semibold mb-2 block"
                style={{ color: "#8B949E", fontFamily: "JetBrains Mono" }}
              >
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                onChange={handleChange}
                onFocus={() => setFocused(field.name)}
                onBlur={() => setFocused("")}
                className="dark-input"
                style={{
                  borderColor: focused === field.name ? "#58A6FF" : "#30363D",
                }}
                required
              />
            </motion.div>
          ))}

          {/* Email + OTP Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-4"
          >
            <label
              className="text-xs font-semibold mb-2 block"
              style={{ color: "#8B949E", fontFamily: "JetBrains Mono" }}
            >
              EMAIL ADDRESS
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                onChange={handleChange}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                className="dark-input flex-1"
                style={{
                  borderColor: focused === "email" ? "#58A6FF" : "#30363D",
                }}
                required
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendOtp}
                disabled={loading || otpSent}
                className="px-4 py-3 rounded-xl text-xs font-bold whitespace-nowrap"
                style={{
                  background: otpSent
                    ? "rgba(0,255,179,0.1)"
                    : "rgba(88,166,255,0.1)",
                  border: `1px solid ${otpSent ? "#00FFB3" : "#58A6FF"}`,
                  color: otpSent ? "#00FFB3" : "#58A6FF",
                }}
              >
                {otpSent ? "✓ Sent" : "Send OTP"}
              </motion.button>
            </div>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-4"
          >
            <label
              className="text-xs font-semibold mb-2 block"
              style={{ color: "#8B949E", fontFamily: "JetBrains Mono" }}
            >
              PASSWORD
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused("")}
              className="dark-input"
              style={{
                borderColor: focused === "password" ? "#58A6FF" : "#30363D",
              }}
              required
            />
          </motion.div>

          {/* OTP Input */}
          {otpSent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4"
            >
              <label
                className="text-xs font-semibold mb-2 block"
                style={{ color: "#00FFB3", fontFamily: "JetBrains Mono" }}
              >
                ✦ ENTER OTP
              </label>
              <input
                type="text"
                name="otp"
                placeholder="_ _ _ _ _ _"
                onChange={handleChange}
                maxLength={6}
                className="dark-input text-center text-2xl tracking-[0.5em] font-bold"
                style={{
                  borderColor: "#00FFB3",
                  boxShadow: "0 0 15px rgba(0,255,179,0.2)",
                  color: "#00FFB3",
                }}
                required
              />
            </motion.div>
          )}

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading || !otpSent}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="cyber-btn w-full py-4 text-base font-bold rounded-xl mt-2"
            style={{ opacity: !otpSent ? 0.5 : 1 }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  ⟳
                </motion.span>
                Creating Account...
              </span>
            ) : (
              "Create Account →"
            )}
          </motion.button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ background: "#30363D" }} />
          <span className="text-xs" style={{ color: "#8B949E" }}>or</span>
          <div className="flex-1 h-px" style={{ background: "#30363D" }} />
        </div>

        {/* Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <p className="text-sm" style={{ color: "#8B949E" }}>
            Already have account?{" "}
            <Link
              to="/login"
              className="font-bold"
              style={{ color: "#58A6FF" }}
            >
              Login →
            </Link>
          </p>
        </motion.div>

        {/* Back */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-4"
        >
          <Link
            to="/"
            className="text-xs"
            style={{ color: "#8B949E" }}
          >
            ← Back to Home
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}

export default Register;