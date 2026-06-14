import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export default function AdminAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '', username: '', email: '', password: '',
  });

  const update = (key, value) => setForm(p => ({ ...p, [key]: value }));

  const handleRegister = async () => {
    if (!form.fullName || !form.username || !form.email || !form.password) {
      alert('All fields required!'); return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/api/admin-auth/register`, form);
      alert('Admin registered! Please login. 🎉');
      setMode('login');
      setForm({ fullName: '', username: '', email: '', password: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      alert('Username & Password required!'); return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/admin-auth/login`, {
        username: form.username,
        password: form.password,
      });
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));
      localStorage.setItem('adminLoginTime', data.loginTime);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.admin));
      alert(`Welcome back, ${data.admin.fullName}! 👋`);
      navigate('/admin');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
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

  const btnPrimary = {
    width: '100%', padding: '14px', borderRadius: '12px',
    border: 'none', cursor: 'pointer',
    background: 'linear-gradient(135deg, #58A6FF, #00FFB3)',
    color: '#000', fontWeight: '800', fontSize: '14px', marginTop: '6px',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#0D1117', padding: '20px',
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
            <button key={m} onClick={() => setMode(m)}
              style={{
                flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                cursor: 'pointer', fontWeight: '700', fontSize: '13px',
                background: mode === m
                  ? 'linear-gradient(135deg, #58A6FF, #00FFB3)'
                  : 'transparent',
                color: mode === m ? '#000' : '#8B949E',
              }}>
              {m === 'login' ? '🔑 Login' : '📝 Register'}
            </button>
          ))}
        </div>

        {/* Register Form */}
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
              placeholder="admin@emmanstore.com" />

            <label style={labelStyle}>PASSWORD</label>
            <input style={inputStyle} type="password" value={form.password}
              onChange={e => update('password', e.target.value)}
              placeholder="••••••••" />

            <motion.button whileHover={{ scale: 1.02 }}
              disabled={loading} onClick={handleRegister} style={btnPrimary}>
              {loading ? '⏳ Registering...' : '✅ Register'}
            </motion.button>
          </>
        )}

        {/* Login Form */}
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

            <motion.button whileHover={{ scale: 1.02 }}
              disabled={loading} onClick={handleLogin} style={btnPrimary}>
              {loading ? '⏳ Logging in...' : '🔑 Login'}
            </motion.button>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none',
              color: '#8B949E', fontSize: '12px', cursor: 'pointer' }}>
            ← Back to Store
          </button>
        </div>
      </motion.div>
    </div>
  );
}