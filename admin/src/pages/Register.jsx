import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import API from "../api";
import AdminWorkspaceIllustration from "../components/AdminWorkspaceIllustration";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password Strength Calculation
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      return setError("All fields are strictly required.");
    }

    if (username.length < 3) {
      return setError("Username must be at least 3 characters long.");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match. Please re-enter.");
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API}/api/admin-auth/register`, {
        username: username.trim(),
        email: email.trim(),
        password,
      });

      setSuccessMsg(res.data?.message || "Admin account registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Username or email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f1f5f9] flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans select-none">
      
      {/* Spacious Main Split Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
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
        <div className="px-8 py-10 sm:px-12 sm:py-14 lg:px-16 flex flex-col justify-center">
          
          <div className="w-full max-w-md mx-auto">
            
            {/* Header: Create Account + Title Divider Line */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Create Account
              </h2>
              
              {/* Subtle Horizontal Divider Line */}
              <hr className="my-4 border-gray-200" />

              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Please enter your administrative details to register
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1, x: [-6, 6, -4, 4, 0] }}
                className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center"
              >
                ⚠️ {error}
              </motion.div>
            )}

            {/* Success Notification */}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold text-center"
              >
                ✓ {successMsg}
              </motion.div>
            )}

            <form onSubmit={handleRegister}>
              
              {/* Field 1: Username with Label & Consistent Gap */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
                  Username
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="e.g. mohamed_emaan"
                    className="w-full bg-[#f8fafc] hover:bg-[#f1f5f9] focus:bg-white text-slate-800 text-sm sm:text-base font-medium rounded-2xl pl-5 pr-12 py-3.5 sm:py-4 border border-slate-200/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                  />
                  <div className="absolute right-4 pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Field 2: Email Address with Label & Consistent Gap */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@ahnaf.com"
                    className="w-full bg-[#f8fafc] hover:bg-[#f1f5f9] focus:bg-white text-slate-800 text-sm sm:text-base font-medium rounded-2xl pl-5 pr-12 py-3.5 sm:py-4 border border-slate-200/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                  />
                  <div className="absolute right-4 pointer-events-none text-slate-400">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Field 3: Password with Strength Meter & Consistent Gap */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="12–16 characters with symbols"
                    className="w-full bg-[#f8fafc] hover:bg-[#f1f5f9] focus:bg-white text-slate-800 text-sm sm:text-base font-medium rounded-2xl pl-5 pr-12 py-3.5 sm:py-4 border border-slate-200/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none placeholder:text-slate-400 font-mono shadow-sm"
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

                {/* Password Strength Meter */}
                {password && (
                  <div className="mt-2.5 space-y-1.5">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <div
                          key={lvl}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            lvl <= passwordStrength ? "bg-emerald-500" : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Must contain uppercase, lowercase, number, and symbol (@$!%*?&).
                    </p>
                  </div>
                )}
              </div>

              {/* Field 4: Confirm Password with Label & Consistent Gap */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-[#f8fafc] hover:bg-[#f1f5f9] focus:bg-white text-slate-800 text-sm sm:text-base font-medium rounded-2xl pl-5 pr-12 py-3.5 sm:py-4 border border-slate-200/80 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none placeholder:text-slate-400 font-mono shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? (
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

              {/* Primary Rounded Action Button (Breathing Room Above) */}
              <div className="pt-2 mb-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-8 rounded-full font-bold text-base text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>

              {/* Footer Switch Link */}
              <div className="pt-2 text-center">
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Login here
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
