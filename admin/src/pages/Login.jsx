import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import API from "../api";
import AdminWorkspaceIllustration from "../components/AdminWorkspaceIllustration";

export default function Login({ setToken }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      return setError("Please provide your username or email and password.");
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API}/api/admin-auth/login`, {
        identifier: identifier.trim(),
        password,
      });

      if (res.data?.token) {
        if (rememberMe) {
          localStorage.setItem("adminToken", res.data.token);
        } else {
          sessionStorage.setItem("adminToken", res.data.token);
        }
        if (setToken) setToken(res.data.token);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f1f5f9] flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans">
      
      {/* Spacious Main Split Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl lg:max-w-5xl bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        
        {/* Left Column: Admin Workspace Illustration */}
        <div className="hidden md:flex flex-col items-center justify-between bg-slate-50/80 p-10 lg:p-14 border-r border-slate-100 relative">
          <Link to="/landing" className="w-full flex items-center gap-2.5 select-none hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/30">
              A
            </div>
            <span className="text-lg font-black tracking-wider text-slate-800">Ahnaf &amp; Co</span>
          </Link>

          <div className="my-auto py-10 w-full flex justify-center">
            <AdminWorkspaceIllustration />
          </div>

          <p className="text-xs text-slate-400 font-medium tracking-wide text-center">
            Enterprise Administrative Management Suite
          </p>
        </div>

        {/* Right Column: Ultra-Neat Form with Generous Spacing */}
        <div className="px-8 py-12 sm:px-12 sm:py-16 lg:px-16 flex flex-col justify-center">
          
          <div className="w-full max-w-md mx-auto">
            
            {/* Header: Elevated Higher with Clean Spacing */}
            <div className="mb-10 text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                Login
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Welcome back! Please enter your username &amp; password
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1, x: [-6, 6, -4, 4, 0] }}
                className="mb-8 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center"
              >
                ⚠️ {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-7">
              
              {/* Field 1: Username or Email with Generous Breathing Room */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
                  Username or Email
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your username or email"
                    className="w-full bg-[#f8fafc] hover:bg-[#f1f5f9] focus:bg-white text-slate-800 text-sm sm:text-base font-medium rounded-2xl pl-5 pr-12 py-4 border border-slate-200/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                  />
                  <div className="absolute right-4 pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Field 2: Password with Generous Breathing Room */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#f8fafc] hover:bg-[#f1f5f9] focus:bg-white text-slate-800 text-sm sm:text-base font-medium rounded-2xl pl-5 pr-12 py-4 border border-slate-200/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none placeholder:text-slate-400 font-mono shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" x2="22" y1="2" y2="22" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Sub-row: Remember Me + Forgot Password */}
              <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert("Please contact your Systems Administrator to reset your master credentials.")}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Primary Rounded Action Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-8 rounded-full font-bold text-base text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>

              {/* Footer Switch Link */}
              <div className="pt-6 text-center">
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Don't have account?{" "}
                  <Link
                    to="/register"
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Let's Get Started For Free
                  </Link>
                </p>
              </div>

            </form>
          </div>

        </div>

      </motion.div>

    </div>
  );
}
