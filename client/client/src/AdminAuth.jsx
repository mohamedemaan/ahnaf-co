import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminAuth() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const adminEmails = [
    "mohamedemaan.a@gmail.com",
    "emmann.2006@gmail.com",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginAdmin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
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

        <form onSubmit={loginAdmin}>
          <div className="mb-4">
            <label
              className="text-xs font-bold mb-2 block tracking-widest"
              style={{ color: "#8B949E", fontFamily: "JetBrains Mono" }}
            >
              ADMIN EMAIL
            </label>
            <input
              type="email"
              name="email"
              placeholder="admin@email.com"
              onChange={handleChange}
              className="dark-input w-full"
              required
            />
          </div>

          <div className="mb-6">
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
              className="dark-input w-full"
              required
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="cyber-btn w-full py-4 text-base font-bold rounded-xl"
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

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-xs"
            style={{ color: "#8B949E", background: "none", border: "none", cursor: "pointer" }}
          >
            ← Back to Store
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminAuth;