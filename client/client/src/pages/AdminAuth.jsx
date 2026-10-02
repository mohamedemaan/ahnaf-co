import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function AdminAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', email: '' });

  const update = (key, value) => setForm(p => ({ ...p, [key]: value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      alert('Email & Password required!'); return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/admin-auth/login`, {
        email: form.email,
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 font-sans pb-24 md:pb-4">
      
      {/* Brand Header */}
      <div className="flex justify-center items-center mb-8 gap-3">
        <span className="text-5xl drop-shadow-md">🛍️</span>
        <h1 className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 drop-shadow-sm">Ahnaf & Co</h1>
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-blue-400 opacity-20 rounded-full blur-lg"></div>
          
          <h1 className="text-3xl font-black tracking-tight mb-2 relative z-10">Admin Portal</h1>
          <p className="text-blue-100 text-sm font-medium relative z-10">Sign in to manage your enterprise</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form className="space-y-5" onSubmit={handleLogin}>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Admin Email</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400">✉️</span>
                <input 
                  type="email" 
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-slate-700 font-medium"
                  placeholder="admin@ahnaf.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400">🔒</span>
                <input 
                  type="password" 
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-slate-700 font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/50 hover:-translate-y-0.5 transition-all active:translate-y-0 mt-6 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Sign In'}
            </button>
            
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <Link to="/" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
              ← Back to Store
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}