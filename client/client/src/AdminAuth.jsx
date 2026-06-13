import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../components/Toast';

const API = import.meta.env.VITE_API_URL;

export default function AdminAuth() {
  const navigate = useNavigate();
  const showToast = (message) => alert(message);
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [step, setStep] = useState(1);       // 1 = details, 2 = OTP
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    otp: '',
  });

  const update = (key, value) => setForm(p => ({ ...p, [key]: value }));

  // ── Send OTP ──
  const sendOtp = async () => {
    if (!form.email) {
      showToast('Enter email first!', 'warning');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/api/admin-auth/send-otp`, { email: form.email });
      setOtpSent(true);
      setStep(2);
      showToast('OTP sent to your email! 📧', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Register ──
  const handleRegister = async () => {
    if (!form.fullName || !form.username || !form.email || !form.password || !form.otp) {
      showToast('All fields required!', 'warning');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/api/admin-auth/register`, form);
      showToast('Admin registered! Please login. 🎉', 'success');
      setMode('login');
      setStep(1);
      setOtpSent(false);
      setForm({ fullName: '', username: '', email: '', password: '', otp: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Login ──
  const handleLogin = async () => {
    if (!form.username || !form.password || !form.email || !form.otp) {
      showToast('All fields required!', 'warning');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/admin-auth/login`, {
        username: form.username,
        password: form.password,
        email: form.email,
        otp: form.otp,
      });

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));
      localStorage.setItem('adminLoginTime', data.loginTime);

      showToast(`Welcome back, ${data.admin.fullName}! 👋`, 'success');
      navigate('/admin');
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(48,54,61,0.8)',
    color: '#fff', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', marginBottom: '14px',
  };

  const labelStyle = {
    color: '#8B949E', fontSize: '11px', fontWeight: '700',
    letterSpacing: '1px', display: 'block', marginBottom: '6px',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0D1117', padding: '20px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%', maxWidth: '420px', borderRadius: '24px',
          background: '#161B22', border: '1px solid rgba(88,166,255,0.2)',
          padding: '36px', boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🛍️</div>
          <h1 style={{ color: '#58A6FF', fontWeight: '900', fontSize: '18px',
            letterSpacing: '2px', fontFamily: 'JetBrains Mono' }}>
            EMMANSTORE
          </h1>
          <p style={{ color: '#555', fontSize: '13px', marginTop: '4px' }}>
            Admin Panel — {mode === 'login' ? 'Login' : 'Register'}
          </p>
        </div>

        {/* Mode Switch */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px',
          background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '4px' }}>
          {['login', 'register'].map(m => (
            <button key={m}
              onClick={() => { setMode(m); setStep(1); setOtpSent(false); }}
              style={{
                flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                cursor: 'pointer', fontWeight: '700', fontSize: '13px',
                background: mode === m
                  ? 'linear-gradient(135deg, #58A6FF, #00FFB3)'
                  : 'transparent',
                color: mode === m ? '#000' : '#8B949E',
              }}
            >
              {m === 'login' ? '🔑 Login' : '📝 Register'}
            </button>
          ))}
        </div>

        {/* ── REGISTER FORM ── */}
        {mode === 'register' && (
          <>
            <label style={labelStyle}>FULL NAME</label>
            <input style={inputStyle} value={form.fullName}
              onChange={e => update('fullName', e.target.value)}
              placeholder="John Doe" />

            <label style={labelStyle}>USERNAME</label>
            <input style={inputStyle} value={form.username}
              onChange={e => update('username', e.target.value)}
              placeholder="admin123" />

            <label style={labelStyle}>EMAIL</label>
            <input style={inputStyle} type="email" value={form.email}
              onChange={e => update('email', e.target.value)}
              placeholder="admin@emmanstore.com" disabled={otpSent} />

            <label style={labelStyle}>PASSWORD</label>
            <input style={inputStyle} type="password" value={form.password}
              onChange={e => update('password', e.target.value)}
              placeholder="••••••••" />

            {otpSent && (
              <>
                <label style={labelStyle}>EMAIL OTP</label>
                <input style={inputStyle} value={form.otp}
                  onChange={e => update('otp', e.target.value)}
                  placeholder="6-digit OTP" maxLength={6} />
              </>
            )}

            {!otpSent ? (
              <motion.button whileHover={{ scale: 1.02 }} disabled={loading}
                onClick={sendOtp}
                style={btnPrimary}>
                {loading ? '⏳ Sending...' : '📧 Send OTP'}
              </motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} disabled={loading}
                onClick={handleRegister}
                style={btnPrimary}>
                {loading ? '⏳ Registering...' : '✅ Register'}
              </motion.button>
            )}
          </>
        )}

        {/* ── LOGIN FORM ── */}
        {mode === 'login' && (
          <>
            <label style={labelStyle}>USERNAME</label>
            <input style={inputStyle} value={form.username}
              onChange={e => update('username', e.target.value)}
              placeholder="admin123" />

            <label style={labelStyle}>PASSWORD</label>
            <input style={inputStyle} type="password" value={form.password}
              onChange={e => update('password', e.target.value)}
              placeholder="••••••••" />

            <label style={labelStyle}>EMAIL</label>
            <input style={inputStyle} type="email" value={form.email}
              onChange={e => update('email', e.target.value)}
              placeholder="admin@emmanstore.com" disabled={otpSent} />

            {otpSent && (
              <>
                <label style={labelStyle}>EMAIL OTP</label>
                <input style={inputStyle} value={form.otp}
                  onChange={e => update('otp', e.target.value)}
                  placeholder="6-digit OTP" maxLength={6} />
                <p style={{ color: '#555', fontSize: '11px', marginTop: '-8px', marginBottom: '14px' }}>
                  🕐 {new Date().toLocaleString('en-IN', {
                    weekday: 'short', year: 'numeric', month: 'short',
                    day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </>
            )}

            {!otpSent ? (
              <motion.button whileHover={{ scale: 1.02 }} disabled={loading}
                onClick={sendOtp}
                style={btnPrimary}>
                {loading ? '⏳ Sending...' : '📧 Send OTP'}
              </motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} disabled={loading}
                onClick={handleLogin}
                style={btnPrimary}>
                {loading ? '⏳ Logging in...' : '🔑 Login'}
              </motion.button>
            )}
          </>
        )}

        {otpSent && (
          <button onClick={() => { setOtpSent(false); setStep(1); }}
            style={{
              width: '100%', marginTop: '10px', padding: '10px',
              background: 'transparent', border: '1px solid #30363D',
              borderRadius: '10px', color: '#8B949E', fontSize: '12px', cursor: 'pointer',
            }}>
            ← Change details
          </button>
        )}
      </motion.div>
    </div>
  );
}

const btnPrimary = {
  width: '100%', padding: '14px', borderRadius: '12px',
  border: 'none', cursor: 'pointer',
  background: 'linear-gradient(135deg, #58A6FF, #00FFB3)',
  color: '#000', fontWeight: '800', fontSize: '14px', marginTop: '6px',
};
