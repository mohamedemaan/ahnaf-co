import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // STRICT REGEX RULES FOR REAL-TIME VALIDATION
  const USERNAME_REGEX = /^[a-z][a-z0-9_]{2,19}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{12,16}$/;

  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (pass.length > 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[@$!%*?&]/.test(pass)) score += 1;
    return score;
  };

  const strength = calculatePasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend Validations
    if (!USERNAME_REGEX.test(formData.username)) {
      return setError("Username must start with a letter and contain only lowercase letters, numbers, or underscores (3–20 characters).");
    }
    if (!EMAIL_REGEX.test(formData.email)) {
      return setError("Enter a valid email address (example: user@gmail.com).");
    }
    if (!PASSWORD_REGEX.test(formData.password)) {
      return setError("Password must be 12–16 characters long and include uppercase, lowercase, number, and special character.");
    }
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    const lowerPass = formData.password.toLowerCase();
    if (lowerPass.includes("password") || lowerPass.includes("admin") || lowerPass.includes("123456")) {
      return setError("Password is too common or weak.");
    }
    if (lowerPass.includes(formData.username.toLowerCase()) || lowerPass.includes(formData.email.split('@')[0].toLowerCase())) {
      return setError("Password cannot contain your username or email.");
    }

    try {
      setLoading(true);
      const { data } = await axios.post(`${API}/api/admin-auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      
      alert("Registration Successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 z-10">
        <h1 className="text-3xl font-black text-slate-800 mb-2">Create Account</h1>
        <p className="text-slate-500 mb-8 font-medium">Bank-level strict security enforcement.</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 border border-red-100">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-bold text-slate-700 block mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              placeholder="e.g. hexamind_user"
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 block mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              placeholder="admin@domain.com"
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 block mb-2">Secure Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              placeholder="12-16 chars, Uppercase, Num, Symbol"
              required
            />
            {/* Strength Indicator */}
            {formData.password.length > 0 && (
              <div className="mt-3 flex gap-1 h-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className={`flex-1 rounded-full ${s <= strength ? (strength <= 2 ? 'bg-red-500' : strength <= 4 ? 'bg-yellow-500' : 'bg-emerald-500') : 'bg-slate-200'}`} />
                ))}
              </div>
            )}
            <p className="text-xs text-slate-400 mt-2 font-medium">Must be 12-16 characters long and include uppercase, lowercase, number, and special character (@$!%*?&).</p>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 block mb-2">Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              placeholder="Re-enter secure password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full py-4 rounded-xl text-white font-black text-lg transition-all shadow-xl shadow-indigo-500/30 ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1"}`}
          >
            {loading ? "Registering..." : "Create Secure Account"}
          </button>

          <p className="text-center text-slate-500 mt-4 font-medium text-sm">
            Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
