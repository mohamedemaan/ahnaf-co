import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import API from "../api";

// ==========================================
// VECTOR ILLUSTRATION (Matches Image 3 Desk Setup)
// ==========================================
const AdminWorkspaceIllustration = () => (
  <svg
    viewBox="0 0 500 420"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full max-w-[420px] h-auto drop-shadow-sm select-none"
  >
    {/* Soft Ambient Background Cloud */}
    <path
      d="M70 210C70 170 100 140 145 140C155 110 185 90 225 90C270 90 305 118 315 150C345 150 370 172 370 205C370 240 340 265 305 265H135C95 265 70 240 70 210Z"
      fill="#EEF2F6"
      opacity="0.85"
    />

    {/* Ground Baseline */}
    <rect x="25" y="325" width="450" height="7" rx="3.5" fill="#1E293B" />
    <circle cx="18" cy="328.5" r="3.5" fill="#3B82F6" />
    <circle cx="482" cy="328.5" r="3.5" fill="#3B82F6" />

    {/* Desk Lamp */}
    <path d="M335 325V210" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
    <path d="M335 210L315 175" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
    <path d="M305 175H325L330 190H300L305 175Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
    <circle cx="335" cy="323" r="10" fill="#64748B" />
    <path d="M295 195L270 260" stroke="#FEF08A" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />

    {/* Potted Plant */}
    <path d="M380 325H405L400 290H385L380 325Z" fill="#334155" />
    <path d="M392 290C392 270 375 255 365 265C365 280 385 288 392 290Z" fill="#10B981" />
    <path d="M392 290C392 265 410 250 420 260C420 278 400 288 392 290Z" fill="#059669" />
    <path d="M392 290V250C392 245 385 242 380 248C380 265 390 280 392 290Z" fill="#34D399" />

    {/* Floating Chat / Analytics Notification Bubble */}
    <g className="animate-bounce" style={{ animationDuration: "4s" }}>
      <rect x="245" y="115" width="48" height="34" rx="8" fill="#F43F5E" />
      <path d="M255 149L250 157V149H255Z" fill="#F43F5E" />
      <circle cx="258" cy="132" r="3" fill="#FFFFFF" />
      <circle cx="269" cy="132" r="3" fill="#FFFFFF" />
      <circle cx="280" cy="132" r="3" fill="#FFFFFF" />
    </g>

    {/* Executive Chair */}
    <path d="M180 235H225C230 235 235 240 235 245V295H170V245C170 240 175 235 180 235Z" fill="#F43F5E" />
    <path d="M175 200C175 185 188 175 202 175C216 175 230 185 230 200V235H175V200Z" fill="#E11D48" />
    <rect x="198" y="295" width="8" height="25" fill="#334155" />
    <path d="M185 320L202 295L220 320" stroke="#334155" strokeWidth="4" strokeLinecap="round" />

    {/* Administrator Character */}
    {/* Head & Hair */}
    <circle cx="202" cy="158" r="18" fill="#FBCFE8" />
    <path d="M184 152C184 140 192 132 204 132C216 132 222 140 222 148C222 152 220 155 218 156C218 152 214 145 204 145C195 145 190 150 188 156C185 155 184 154 184 152Z" fill="#1E293B" />
    {/* Face detail */}
    <circle cx="198" cy="157" r="2" fill="#0F172A" />
    <circle cx="208" cy="157" r="2" fill="#0F172A" />
    <path d="M200 165C202 167 205 167 207 165" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />

    {/* Body / Navy Suit */}
    <path d="M180 185C180 175 190 172 202 172C214 172 225 175 225 185V245H180V185Z" fill="#1E293B" />
    {/* White Shirt & Red Tie */}
    <path d="M198 172L202 195L207 172Z" fill="#FFFFFF" />
    <path d="M201 176L203 198L205 176Z" fill="#EF4444" />

    {/* Character Legs in Trousers */}
    <rect x="185" y="245" width="14" height="60" rx="3" fill="#0F172A" />
    <rect x="205" y="245" width="14" height="60" rx="3" fill="#0F172A" />
    {/* Shoes */}
    <rect x="180" y="300" width="22" height="10" rx="4" fill="#F43F5E" />
    <rect x="208" y="300" width="22" height="10" rx="4" fill="#F43F5E" />

    {/* Office Desk */}
    <rect x="65" y="235" width="230" height="10" rx="3" fill="#92400E" />
    {/* Desk Legs */}
    <path d="M75 245V325" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
    <path d="M285 245V325" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />

    {/* Laptop on Desk */}
    <path d="M130 235H180L175 228H135L130 235Z" fill="#94A3B8" />
    <path d="M135 228L150 185H185L175 228H135Z" fill="#0F172A" />
    <rect x="142" y="190" width="36" height="32" rx="1" fill="#3B82F6" opacity="0.85" />
    <path d="M150 205L158 200L168 212" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

    {/* Book Stack on Desk */}
    <rect x="80" y="222" width="30" height="5" rx="1" fill="#3B82F6" />
    <rect x="82" y="217" width="26" height="5" rx="1" fill="#10B981" />
    <rect x="81" y="227" width="32" height="8" rx="1.5" fill="#F43F5E" />

    {/* Coffee Cup */}
    <rect x="215" y="225" width="10" height="10" rx="2" fill="#E2E8F0" />
    <path d="M225 227C227 227 228 228 228 230C228 232 227 233 225 233" stroke="#CBD5E1" strokeWidth="1.5" />
  </svg>
);

// ==========================================
// MINIMAL CLEAN ICONS (Inside input fields)
// ==========================================
const UserIcon = () => (
  <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const EyeIcon = ({ off = false }) => (
  <svg className="w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {off ? (
      <>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
      </>
    ) : (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

// ==========================================
// MAIN AUTH COMPONENT (Exact Model of Image 3)
// ==========================================
export default function AuthPage({ initialMode = "login", setToken }) {
  const [mode, setMode] = useState(initialMode); // "login" | "register"
  const navigate = useNavigate();
  const location = useLocation();

  const [loginData, setLoginData] = useState({ identifier: "", password: "", rememberMe: true });
  const [regData, setRegData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync mode with route changes
  React.useEffect(() => {
    if (location.pathname.includes("register")) setMode("register");
    else if (location.pathname.includes("login")) setMode("login");
  }, [location.pathname]);

  const USERNAME_REGEX = /^[a-z][a-z0-9_]{2,19}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{12,16}$/;

  const passwordStrength = useMemo(() => {
    const p = regData.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score += 1;
    if (p.length >= 12 && p.length <= 16) score += 1;
    if (/[A-Z]/.test(p)) score += 1;
    if (/[0-9]/.test(p)) score += 1;
    if (/[@$!%*?&]/.test(p)) score += 1;
    return score;
  }, [regData.password]);

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!loginData.identifier.trim() || !loginData.password) {
      return setError("Please provide your username or email and password.");
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API}/api/admin-auth/login`, {
        identifier: loginData.identifier.trim(),
        password: loginData.password,
      });

      if (res.data?.token) {
        if (loginData.rememberMe) {
          localStorage.setItem("adminToken", res.data.token);
        } else {
          sessionStorage.setItem("adminToken", res.data.token);
        }
        if (setToken) setToken(res.data.token);
        setSuccessMsg("Login successful! Redirecting to dashboard...");
        setTimeout(() => navigate("/"), 600);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!USERNAME_REGEX.test(regData.username)) {
      return setError("Username must start with a letter and contain only lowercase letters, numbers, or underscores (3–20 chars).");
    }

    if (!EMAIL_REGEX.test(regData.email)) {
      return setError("Please enter a valid work email address.");
    }

    if (!PASSWORD_REGEX.test(regData.password)) {
      return setError("Password must be 12–16 characters with uppercase, lowercase, number, and special character.");
    }

    if (regData.password !== regData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API}/api/admin-auth/register`, {
        username: regData.username.trim(),
        email: regData.email.trim(),
        password: regData.password,
      });

      setSuccessMsg(res.data?.message || "Admin account created successfully! Switching to login...");
      setTimeout(() => {
        setMode("login");
        setLoginData({ ...loginData, identifier: regData.username });
        setSuccessMsg("");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Username or email may already be registered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans">
      
      {/* ======================================================== */}
      {/* WIDE CARD CONTAINER (Model from 3rd Image)               */}
      {/* ======================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: Modern Workspace Vector Illustration        */}
        {/* ======================================================== */}
        <div className="hidden md:flex flex-col items-center justify-center bg-slate-50/60 p-8 lg:p-12 border-r border-slate-100 relative">
          
          {/* Subtle Decorative Brand Watermark */}
          <div className="absolute top-8 left-8 flex items-center gap-2 select-none">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-500/30">
              A
            </div>
            <span className="text-sm font-black tracking-wider text-slate-800">AHNAF &amp; CO.</span>
          </div>

          <div className="my-auto py-6">
            <AdminWorkspaceIllustration />
          </div>

          <p className="text-xs text-slate-400 font-medium tracking-wide text-center">
            Enterprise Admin Management Portal
          </p>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Clean Minimalist Auth Form                 */}
        {/* ======================================================== */}
        <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
          
          <AnimatePresence mode="wait">
            {mode === "login" ? (

              // ==============================
              // LOGIN FORM (Matches Image 3)
              // ==============================
              <motion.div
                key="login-view"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                {/* Header */}
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2 text-center">
                  Login
                </h2>
                <p className="text-xs text-slate-400 text-center mb-8">
                  Welcome back! Please enter your details.
                </p>

                {/* Notifications */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center"
                  >
                    ⚠️ {error}
                  </motion.div>
                )}

                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold text-center"
                  >
                    ✓ {successMsg}
                  </motion.div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  
                  {/* Username / Email Field */}
                  <div>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        required
                        value={loginData.identifier}
                        onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                        placeholder="school / admin username"
                        className="w-full bg-[#f1f5f9] hover:bg-[#eef2f6] focus:bg-white text-slate-800 text-sm font-medium rounded-xl pl-4 pr-11 py-3.5 border border-transparent focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all outline-none placeholder:text-slate-400"
                      />
                      <div className="absolute right-3.5 pointer-events-none">
                        <UserIcon />
                      </div>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="relative flex items-center">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="••••••••••••"
                        className="w-full bg-[#f1f5f9] hover:bg-[#eef2f6] focus:bg-white text-slate-800 text-sm font-medium rounded-xl pl-4 pr-11 py-3.5 border border-transparent focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all outline-none placeholder:text-slate-400 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 cursor-pointer"
                      >
                        <EyeIcon off={showPassword} />
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password Link (Right-aligned like Image 3) */}
                  <div className="flex justify-end pt-0.5">
                    <button
                      type="button"
                      onClick={() => alert("Please contact your DevOps Root Administrator to reset your master credentials.")}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Primary Rounded Pill Action Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-6 rounded-full font-bold text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md shadow-blue-500/25 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Logging in...
                        </span>
                      ) : (
                        "Login"
                      )}
                    </button>
                  </div>

                  {/* Switch to Register */}
                  <div className="pt-3 text-center">
                    <p className="text-xs text-slate-500 font-medium">
                      Don't have account?{" "}
                      <button
                        type="button"
                        onClick={() => { setMode("register"); setError(""); setSuccessMsg(""); }}
                        className="text-blue-600 font-bold hover:underline cursor-pointer"
                      >
                        Let's Get Started For Free
                      </button>
                    </p>
                  </div>

                </form>
              </motion.div>

            ) : (

              // ==============================
              // REGISTER FORM (Matches Model)
              // ==============================
              <motion.div
                key="register-view"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                {/* Header */}
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2 text-center">
                  Create Account
                </h2>
                <p className="text-xs text-slate-400 text-center mb-6">
                  Set up your authorized admin credentials.
                </p>

                {/* Notifications */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center"
                  >
                    ⚠️ {error}
                  </motion.div>
                )}

                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold text-center"
                  >
                    ✓ {successMsg}
                  </motion.div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  
                  {/* Username Field */}
                  <div>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        required
                        value={regData.username}
                        onChange={(e) => setRegData({ ...regData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                        placeholder="Username (e.g. mohamed_emaan)"
                        className="w-full bg-[#f1f5f9] hover:bg-[#eef2f6] focus:bg-white text-slate-800 text-xs font-medium rounded-xl pl-4 pr-11 py-3 border border-transparent focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all outline-none placeholder:text-slate-400"
                      />
                      <div className="absolute right-3.5 pointer-events-none">
                        <UserIcon />
                      </div>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <input
                      type="email"
                      required
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      placeholder="Email Address (admin@ahnaf.com)"
                      className="w-full bg-[#f1f5f9] hover:bg-[#eef2f6] focus:bg-white text-slate-800 text-xs font-medium rounded-xl px-4 py-3 border border-transparent focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all outline-none placeholder:text-slate-400"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="relative flex items-center">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={regData.password}
                        onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                        placeholder="Secure Password (12–16 chars)"
                        className="w-full bg-[#f1f5f9] hover:bg-[#eef2f6] focus:bg-white text-slate-800 text-xs font-medium rounded-xl pl-4 pr-11 py-3 border border-transparent focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all outline-none placeholder:text-slate-400 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 cursor-pointer"
                      >
                        <EyeIcon off={showPassword} />
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {regData.password && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <div
                              key={lvl}
                              className={`h-1 flex-1 rounded-full transition-all ${
                                lvl <= passwordStrength ? "bg-emerald-500" : "bg-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Must include uppercase, lowercase, number, and symbol (@$!%*?&).
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <div className="relative flex items-center">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={regData.confirmPassword}
                        onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                        placeholder="Confirm Password"
                        className="w-full bg-[#f1f5f9] hover:bg-[#eef2f6] focus:bg-white text-slate-800 text-xs font-medium rounded-xl pl-4 pr-11 py-3 border border-transparent focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all outline-none placeholder:text-slate-400 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 cursor-pointer"
                      >
                        <EyeIcon off={showConfirmPassword} />
                      </button>
                    </div>
                  </div>

                  {/* Primary Rounded Pill Action Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-6 rounded-full font-bold text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md shadow-blue-500/25 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
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

                  {/* Switch to Login */}
                  <div className="pt-2 text-center">
                    <p className="text-xs text-slate-500 font-medium">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}
                        className="text-blue-600 font-bold hover:underline cursor-pointer"
                      >
                        Login here
                      </button>
                    </p>
                  </div>

                </form>
              </motion.div>

            )}
          </AnimatePresence>

        </div>

      </motion.div>

    </div>
  );
}
