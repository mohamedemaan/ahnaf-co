import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminAuth() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const adminEmails = [
    "mohamedemaan.a@gmail.com",
    "emmann.2006@gmail.com",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (!formData.email) {
      alert("Email enter pannu!");
      return;
    }
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/send-otp", {
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

  const loginAdmin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      const user = res.data.user;

      if (!adminEmails.includes(user.email)) {
        alert("Admin access denied! ❌");
        return;
      }

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUser", JSON.stringify(user));
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Admin Login Success! ✅");
      navigate("/admin");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen particle-bg flex items-center justify-center px-4">

      {/* Grid */}
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

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="glass w-full max-w-md p-8 relative z-10"
      >

        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="text-5xl mb-3 inline-block"
          >
            ⚙️
          </motion.div>
          <h1
            className="text-2xl font-black tracking-widest gradient-text"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            ADMIN PANEL
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8B949E" }}>
            Ahnaf Enterprises
          </p>
        </div>

        {/* Form */}
        <form onSubmit={loginAdmin}>

          {/* Email + OTP */}
          <div className="mb-4">
            <label
              className="text-xs font-bold mb-2 block tracking-widest"
              style={{ color: "#8B949E", fontFamily: "JetBrains Mono" }}
            >
              ADMIN EMAIL
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                name="email"
                placeholder="admin@email.com"
                onChange={handleChange}
                className="dark-input flex-1"
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
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              className="text-xs font-bold mb-2 block tracking-widest"
              style={{ color: "#8B949E", fontFamily: "JetBrains Mono" }}
            >
              PASSWORD
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              className="dark-input"
              required
            />
          </div>

          {/* OTP */}
          {otpSent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4"
            >
              <label
                className="text-xs font-bold mb-2 block tracking-widest"
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
                Authenticating...
              </span>
            ) : (
              "Admin Login →"
            )}
          </motion.button>

        </form>

        {/* Back */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-xs"
            style={{ color: "#8B949E" }}
          >
            ← Back to Store
          </button>
        </div>

      </motion.div>
    </div>
  );
}

export default AdminAuth;