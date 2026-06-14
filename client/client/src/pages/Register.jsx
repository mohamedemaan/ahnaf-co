import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", password: "",
  });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API}/api/auth/register`, formData);
      alert("Account created! 🎉");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed!");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name",     label: "FULL NAME",     placeholder: "Mohamed Ahnaf", type: "text" },
    { name: "phone",    label: "PHONE NUMBER",  placeholder: "+91 9876543210", type: "tel" },
    { name: "email",    label: "EMAIL ADDRESS", placeholder: "your@email.com", type: "email" },
    { name: "password", label: "PASSWORD",      placeholder: "••••••••",       type: "password" },
  ];

  return (
    <div className="min-h-screen particle-bg flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="glass w-full max-w-md p-8 relative z-10"
      >
        <motion.div className="text-center mb-8">
          <div className="text-5xl mb-3">🛍️</div>
          <h1 className="text-2xl font-black tracking-widest gradient-text"
              style={{ fontFamily: "JetBrains Mono" }}>
            AHNAF ENTERPRISES
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8B949E" }}>
            Create Your Account 🚀
          </p>
        </motion.div>

        <form onSubmit={registerUser}>
          {fields.map((field, i) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="mb-4"
            >
              <label className="text-xs font-semibold mb-2 block"
                     style={{ color: "#8B949E", fontFamily: "JetBrains Mono" }}>
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
                style={{ borderColor: focused === field.name ? "#58A6FF" : "#30363D" }}
                required
              />
            </motion.div>
          ))}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="cyber-btn w-full py-4 text-base font-bold rounded-xl mt-2"
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </motion.button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ background: "#30363D" }} />
          <span className="text-xs" style={{ color: "#8B949E" }}>or</span>
          <div className="flex-1 h-px" style={{ background: "#30363D" }} />
        </div>

        <div className="text-center">
          <p className="text-sm" style={{ color: "#8B949E" }}>
            Already have account?{" "}
            <Link to="/login" className="font-bold" style={{ color: "#58A6FF" }}>
              Login →
            </Link>
          </p>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-xs" style={{ color: "#8B949E" }}>
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;