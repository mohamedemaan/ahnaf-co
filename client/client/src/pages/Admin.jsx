import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const API = import.meta.env.VITE_API_URL;

const COLORS = ['#58A6FF', '#00FFB3', '#BC8CFF', '#FFA657', '#F85149'];

const statusColors = {
  pending:    '#FFA657',
  processing: '#58A6FF',
  shipped:    '#BC8CFF',
  delivered:  '#00FFB3',
  cancelled:  '#F85149',
};

// ── Stat Card ──
const StatCard = ({ icon, label, value, growth, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -4 }}
    style={{
      padding: '20px 24px', borderRadius: '16px',
      background: '#161B22',
      border: `1px solid ${color}22`,
      boxShadow: `0 4px 20px ${color}11`,
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
      <span style={{ color: '#8B949E', fontSize: '12px', fontWeight: '600' }}>{label}</span>
      <span style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: `${color}15`, display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontSize: '18px'
      }}>{icon}</span>
    </div>
    <p style={{ color: '#fff', fontSize: '28px', fontWeight: '900',
      fontFamily: 'JetBrains Mono', marginBottom: '6px' }}>{value}</p>
    {growth && (
      <span style={{
        fontSize: '12px', fontWeight: '700',
        color: growth > 0 ? '#00FFB3' : '#F85149'
      }}>
        {growth > 0 ? '↑' : '↓'} {Math.abs(growth)}% this week
      </span>
    )}
    <div style={{
      marginTop: '12px', height: '3px', borderRadius: '10px',
      background: `linear-gradient(90deg, ${color}, transparent)`
    }} />
  </motion.div>
);

export default function Admin() {
  const navigate       = useNavigate();
  const showToast = (msg) => {
  alert(msg);
};
  const fileInputRef   = useRef(null);
  const [tab, setTab]  = useState('dashboard');
  const [products, setProducts]     = useState([]);
  const [orders,   setOrders]       = useState([]);
  const [customers, setCustomers]   = useState([]);
  const [feedbacks, setFeedbacks]   = useState([]);
  const [messages,  setMessages]    = useState([]);
  const [, setLoading] = useState(false); 
  const [showForm,  setShowForm]    = useState(false);
  const [editItem,  setEditItem]    = useState(null);
  const [aiLoading, setAiLoading]   = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [replyMsg, setReplyMsg]     = useState('');

  const [stats, setStats] = useState({
    products: 0, orders: 0, revenue: '₹0', customers: 0
  });

  const [chartData, setChartData] = useState([]);
  const [stateData] = useState([
  { name: 'Tamil Nadu',  value: 35 },
  { name: 'Maharashtra', value: 25 },
  { name: 'Karnataka',   value: 20 },
  { name: 'Delhi',       value: 12 },
  { name: 'Others',      value: 8  },
 ]);

  const [form, setForm] = useState({
    title: '', category: '', price: '',
    originalPrice: '', stock: '', description: '',
    images: '', colors: '', sizes: '',
  });

const fetchAll = async () => {
  setLoading(true);

  try {
    // YOUR ORIGINAL API CALLS HERE
  } catch (err) {
    console.error('Fetch error:', err);
    alert('Failed to load data!');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchAll();
}, []);


  // ── AI Description ──
  const generateDescription = async () => {
    if (!form.title || !form.category) {
      showToast('Enter title & category first!', 'warning'); return;
    }
    setAiLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/ai/description`, {
        title: form.title, category: form.category,
      });
      setForm(prev => ({ ...prev, description: data.description }));
      showToast('AI description generated! 🤖', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'AI failed! Is Ollama running?', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  // ── Product CRUD ──
  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.category) {
      showToast('Title, Category & Price required!', 'warning'); return;
    }
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const payload = {
        ...form,
        price:         Number(form.price)         || 0,
        originalPrice: Number(form.originalPrice) || 0,
        stock:         Number(form.stock)         || 0,
        images: form.images.split(',').map(s => s.trim()).filter(Boolean),
        colors: form.colors.split(',').map(s => s.trim()).filter(Boolean),
        sizes:  form.sizes.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (editItem) {
        await axios.put(`${API}/api/products/${editItem._id}`, payload, { headers });
        showToast('Product updated! ✅', 'success');
      } else {
        await axios.post(`${API}/api/products`, payload, { headers });
        showToast('Product added! 🎉', 'success');
      }
      setShowForm(false); setEditItem(null); resetForm(); fetchAll();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save!', 'error');
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Deleted!', 'info'); fetchAll();
    } catch { showToast('Failed!', 'error'); }
  };

  // ── CSV Import ──
  const handleCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvLoading(true);
    try {
      const text    = await file.text();
      const lines   = text.split('\n').filter(Boolean);
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const products = lines.slice(1).map(line => {
        const vals = line.match(/(".*?"|[^,]+)/g) || [];
        const obj  = {};
        headers.forEach((h, i) => {
          obj[h] = (vals[i] || '').replace(/"/g, '').trim();
        });
        return {
          title:         obj.title         || '',
          category:      obj.category      || 'General',
          price:         Number(obj.price) || 0,
          originalPrice: Number(obj.originalPrice) || 0,
          stock:         Number(obj.stock) || 0,
          description:   obj.description   || '',
          images: (obj.images || '').split('|').map(s => s.trim()).filter(Boolean),
          colors: (obj.colors || '').split(',').map(s => s.trim()).filter(Boolean),
          sizes:  (obj.sizes  || '').split(',').map(s => s.trim()).filter(Boolean),
        };
      }).filter(p => p.title);

      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API}/api/products/bulk`,
        { products },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(`${data.count} products imported! 🎉`, 'success');
      fetchAll();
    } catch (err) {
      showToast('CSV import failed!', 'error');
    } finally {
      setCsvLoading(false);
      e.target.value = '';
    }
  };

  // ── Order Actions ──
  const updateOrderStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/api/orders/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast(`Order ${status}!`, 'success'); fetchAll();
    } catch { showToast('Failed!', 'error'); }
  };

  const openEdit = (p) => {
    setEditItem(p);
    setForm({
      title: p.title||'', category: p.category||'', price: p.price||'',
      originalPrice: p.originalPrice||'', stock: p.stock||'',
      description: p.description||'',
      images: (p.images||[]).join(', '),
      colors: (p.colors||[]).join(', '),
      sizes:  (p.sizes||[]).join(', '),
    });
    setShowForm(true);
  };

  const resetForm = () => setForm({
    title:'', category:'', price:'', originalPrice:'',
    stock:'', description:'', images:'', colors:'', sizes:'',
  });

  // ── Customer Care ──
  const sendReply = () => {
    if (!replyMsg.trim() || !selectedCustomer) return;
    const newMsg = {
      id: Date.now(), from: 'admin',
      text: replyMsg, time: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, newMsg]);
    setReplyMsg('');
    showToast('Reply sent! 📧', 'success');
  };

  // ── Filtered Orders ──
  const filteredOrders = orders.filter(o => {
    const matchSearch = !orderSearch ||
      o._id?.includes(orderSearch) ||
      o.userId?.name?.toLowerCase().includes(orderSearch.toLowerCase());
    const matchFilter = orderFilter === 'all' || o.status === orderFilter;
    return matchSearch && matchFilter;
  });

  // ── Trending Products ──
  const trendingProducts = [...products]
    .sort((a, b) => (b.price || 0) - (a.price || 0))
    .slice(0, 5);

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(48,54,61,0.8)',
    color: '#fff', fontSize: '13px', outline: 'none',
    boxSizing: 'border-box',
  };

  const tabs = [
    { id: 'dashboard',  icon: '📊', label: 'Overview'      },
    { id: 'products',   icon: '📦', label: 'Products'      },
    { id: 'orders',     icon: '🛒', label: 'Orders'        },
    { id: 'customers',  icon: '👥', label: 'Customers'     },
    { id: 'care',       icon: '💬', label: 'Customer Care' },
    { id: 'settings',   icon: '⚙️', label: 'Settings'      },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{
          background: '#1C2128', border: '1px solid #30363D',
          borderRadius: '10px', padding: '10px 14px'
        }}>
          <p style={{ color: '#8B949E', fontSize: '12px', marginBottom: '6px' }}>{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color, fontSize: '13px', fontWeight: '700' }}>
              {p.name}: {p.name === 'revenue' ? `₹${p.value}` : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D1117', display: 'flex' }}>

      {/* ── Sidebar ── */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        style={{
          width: '220px', flexShrink: 0,
          background: '#161B22',
          borderRight: '1px solid #30363D',
          padding: '24px 16px',
          display: 'flex', flexDirection: 'column',
          position: 'sticky', top: 0, height: '100vh',
          overflowY: 'auto',
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: '32px', padding: '0 8px' }}>
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>🛍️</div>
          <p style={{ color: '#58A6FF', fontWeight: '900', fontSize: '13px',
            letterSpacing: '2px', fontFamily: 'JetBrains Mono' }}>
            EMMANSTORE
          </p>
          <p style={{ color: '#555', fontSize: '11px', marginTop: '2px' }}>
            Admin Panel
          </p>
        </div>

        {/* Nav Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {tabs.map(t => (
            <motion.button key={t.id} whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}
              onClick={() => setTab(t.id)}
              style={{
                padding: '11px 16px', borderRadius: '12px',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: '10px',
                background: tab === t.id
                  ? 'linear-gradient(135deg,rgba(88,166,255,0.15),rgba(0,255,179,0.08))'
                  : 'transparent',
                color:  tab === t.id ? '#fff' : '#8B949E',
                fontWeight: tab === t.id ? '700' : '500',
                fontSize: '13px',
                borderLeft: `2px solid ${tab === t.id ? '#58A6FF' : 'transparent'}`,
              }}
            >
              <span>{t.icon}</span>{t.label}
            </motion.button>
             
          ))}
        </div>

        {/* Welcome */}
        <div style={{
          padding: '12px', borderRadius: '12px', marginBottom: '12px',
          background: 'rgba(88,166,255,0.05)', border: '1px solid rgba(88,166,255,0.1)'
        }}>
          <p style={{ color: '#8B949E', fontSize: '11px' }}>Welcome back,</p>
          <p style={{ color: '#fff', fontWeight: '700', fontSize: '13px' }}>
            {JSON.parse(localStorage.getItem('user') || '{}')?.name || 'Admin'}
          </p>
        </div>

        <motion.button whileHover={{ x: 4 }} onClick={() => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  localStorage.removeItem('adminLoginTime');
  navigate('/admin-login');
}}
  style={{
    padding: '11px 16px', borderRadius: '12px', marginTop: '8px',
    border: '1px solid rgba(248,81,73,0.3)', cursor: 'pointer',
    background: 'rgba(248,81,73,0.05)', color: '#F85149',
    fontSize: '13px', textAlign: 'left',
    display: 'flex', alignItems: 'center', gap: '8px',
  }}
>
  🚪 Logout
</motion.button>
      </motion.aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, padding: '28px', overflowY: 'auto', maxHeight: '100vh' }}>

        {/* Top Bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '28px'
        }}>
          <div>
            <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '900' }}>
              Welcome, {JSON.parse(localStorage.getItem('user')||'{}')?.name?.split(' ')[0] || 'Admin'} 👋
            </h1>
            <p style={{ color: '#555', fontSize: '13px' }}>
              {new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
            </p>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} onClick={fetchAll}
            style={{
              padding: '10px 20px', borderRadius: '12px',
              background: 'rgba(88,166,255,0.1)',
              border: '1px solid rgba(88,166,255,0.3)',
              color: '#58A6FF', cursor: 'pointer', fontSize: '13px', fontWeight: '700'
            }}
          >
            🔄 Refresh
          </motion.button>
        </div>

        {/* ══ DASHBOARD ══ */}
        {tab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px', marginBottom: '24px'
            }}>
              <StatCard icon="💰" label="Total Revenue"   value={stats.revenue}   growth={18}  color="#00FFB3" delay={0}   />
              <StatCard icon="👥" label="Total Customers" value={stats.customers} growth={12}  color="#58A6FF" delay={0.1} />
              <StatCard icon="🛒" label="Total Orders"    value={stats.orders}    growth={8}   color="#BC8CFF" delay={0.2} />
              <StatCard icon="📦" label="Total Products"  value={stats.products}  growth={5}   color="#FFA657" delay={0.3} />
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>

              {/* Line Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                style={{
                  padding: '24px', borderRadius: '20px',
                  background: '#161B22', border: '1px solid #30363D'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ color: '#fff', fontWeight: '700', fontSize: '16px' }}>
                      📈 Revenue & Orders Growth
                    </h3>
                    <p style={{ color: '#555', fontSize: '12px' }}>Last 6 months</p>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    {[
                      { dot: '#58A6FF', label: 'Revenue' },
                      { dot: '#00FFB3', label: 'Orders'  },
                    ].map(l => (
                      <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.dot }} />
                        <span style={{ color: '#8B949E', fontSize: '12px' }}>{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,54,61,0.5)" />
                    <XAxis dataKey="month" stroke="#555" tick={{ fontSize: 12, fill: '#8B949E' }} />
                    <YAxis stroke="#555" tick={{ fontSize: 12, fill: '#8B949E' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="revenue" stroke="#58A6FF"
                      strokeWidth={2} dot={{ fill: '#58A6FF', r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="orders" stroke="#00FFB3"
                      strokeWidth={2} dot={{ fill: '#00FFB3', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Top States Donut */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                style={{
                  padding: '24px', borderRadius: '20px',
                  background: '#161B22', border: '1px solid #30363D'
                }}
              >
                <h3 style={{ color: '#fff', fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>
                  🗺️ Top States
                </h3>
                <p style={{ color: '#555', fontSize: '12px', marginBottom: '16px' }}>
                  {stats.customers} Total Customers
                </p>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={stateData} cx="50%" cy="50%" innerRadius={45}
                      outerRadius={70} paddingAngle={3} dataKey="value">
                      {stateData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#1C2128', border: '1px solid #30363D',
                        borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {stateData.map((s, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%',
                          background: COLORS[i % COLORS.length] }} />
                        <span style={{ color: '#8B949E', fontSize: '12px' }}>{s.name}</span>
                      </div>
                      <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>
                        {s.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Bottom Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>

              {/* Recent Orders */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                style={{
                  borderRadius: '20px', background: '#161B22',
                  border: '1px solid #30363D', overflow: 'hidden'
                }}
              >
                <div style={{
                  padding: '18px 24px', borderBottom: '1px solid #30363D',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <h3 style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>
                    🕐 Last Orders
                  </h3>
                  <motion.button whileHover={{ scale: 1.05 }}
                    onClick={() => setTab('orders')}
                    style={{
                      padding: '5px 12px', borderRadius: '8px', cursor: 'pointer',
                      background: 'rgba(88,166,255,0.1)', border: '1px solid rgba(88,166,255,0.2)',
                      color: '#58A6FF', fontSize: '12px', fontWeight: '600'
                    }}
                  >
                    See all →
                  </motion.button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(48,54,61,0.5)' }}>
                      {['ID','Name','Date','Status','Amount'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left',
                          color: '#555', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0,5).map((o, i) => (
                      <tr key={o._id} style={{ borderBottom: '1px solid rgba(48,54,61,0.3)' }}>
                        <td style={{ padding: '12px 16px', color: '#58A6FF',
                          fontSize: '12px', fontFamily: 'JetBrains Mono' }}>
                          #{o._id?.slice(-4).toUpperCase()}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '28px', height: '28px', borderRadius: '50%',
                              background: `linear-gradient(135deg, ${COLORS[i%5]}, ${COLORS[(i+1)%5]})`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#000', fontSize: '11px', fontWeight: '700'
                            }}>
                              {(o.userId?.name?.[0] || 'U').toUpperCase()}
                            </div>
                            <span style={{ color: '#fff', fontSize: '13px' }}>
                              {o.userId?.name || 'Customer'}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#555', fontSize: '12px' }}>
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
                            fontWeight: '700',
                            color: statusColors[o.status] || '#8B949E',
                            background: `${statusColors[o.status]}15`,
                          }}>
                            {o.status || 'pending'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#00FFB3',
                          fontWeight: '700', fontSize: '13px' }}>
                          ₹{o.totalAmount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>

              {/* Trending Products */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                style={{
                  padding: '20px', borderRadius: '20px',
                  background: '#161B22', border: '1px solid #30363D'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ color: '#fff', fontWeight: '700', fontSize: '15px' }}>
                      🔥 Trending Products
                    </h3>
                    <p style={{ color: '#555', fontSize: '11px' }}>
                      Total {products.length} Products
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {trendingProducts.map((p, i) => (
                    <div key={p._id} style={{
                      display: 'flex', alignItems: 'center', gap: '10px'
                    }}>
                      <img
                        src={p.images?.[0] || 'https://via.placeholder.com/40'}
                        alt={p.title}
                        style={{ width: '40px', height: '40px', borderRadius: '10px',
                          objectFit: 'cover', border: '1px solid #30363D' }}
                      />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <p style={{ color: '#fff', fontSize: '12px', fontWeight: '600',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.title}
                        </p>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {[1,2,3,4,5].map(s => (
                            <span key={s} style={{ color: '#FFA657', fontSize: '10px' }}>★</span>
                          ))}
                          <span style={{ color: '#555', fontSize: '10px' }}>(4.5)</span>
                        </div>
                      </div>
                      <span style={{ color: '#00FFB3', fontWeight: '700', fontSize: '13px' }}>
                        ₹{p.price}
                      </span>
                    </div>
                  ))}
                  <motion.button whileHover={{ scale: 1.02 }}
                    onClick={() => setTab('products')}
                    style={{
                      marginTop: '8px', padding: '8px',
                      borderRadius: '10px', border: 'none',
                      background: 'transparent',
                      color: '#FFA657', fontSize: '12px',
                      fontWeight: '600', cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    See all →
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ══ PRODUCTS ══ */}
        {tab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => { resetForm(); setEditItem(null); setShowForm(true); }}
                style={{
                  padding: '11px 22px', borderRadius: '12px', border: 'none',
                  background: 'linear-gradient(135deg, #58A6FF, #00FFB3)',
                  color: '#000', fontWeight: '800', fontSize: '13px', cursor: 'pointer',
                }}
              >
                + Add Product
              </motion.button>

              {/* CSV Import */}
              <input ref={fileInputRef} type="file" accept=".csv"
                onChange={handleCSV} style={{ display: 'none' }} />
              <motion.button whileHover={{ scale: 1.05 }}
                onClick={() => fileInputRef.current?.click()}
                disabled={csvLoading}
                style={{
                  padding: '11px 22px', borderRadius: '12px', cursor: 'pointer',
                  background: 'rgba(0,255,179,0.1)',
                  border: '1px solid rgba(0,255,179,0.3)',
                  color: '#00FFB3', fontWeight: '700', fontSize: '13px',
                }}
              >
                {csvLoading ? '⏳ Importing...' : '📁 CSV Import'}
              </motion.button>

              <div style={{
                padding: '11px 16px', borderRadius: '12px',
                background: 'rgba(255,166,87,0.1)',
                border: '1px solid rgba(255,166,87,0.3)',
                color: '#FFA657', fontSize: '12px',
              }}>
                📦 {products.length} Total Products
              </div>
            </div>

            {/* CSV Format hint */}
            <div style={{
              padding: '12px 16px', borderRadius: '10px', marginBottom: '16px',
              background: 'rgba(88,166,255,0.05)',
              border: '1px solid rgba(88,166,255,0.1)',
              color: '#8B949E', fontSize: '12px',
            }}>
              💡 CSV Format: <code style={{ color: '#58A6FF' }}>
                title, category, price, originalPrice, stock, description, images, colors, sizes
              </code> — images use <code style={{ color: '#58A6FF' }}>|</code> separator
            </div>

            <div style={{
              borderRadius: '20px', background: '#161B22',
              border: '1px solid #30363D', overflow: 'hidden'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #30363D' }}>
                      {['Image','Title','Category','Price','Stock','Actions'].map(h => (
                        <th key={h} style={{ padding: '14px 20px', textAlign: 'left',
                          color: '#555', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p, i) => (
                      <motion.tr key={p._id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        style={{ borderBottom: '1px solid rgba(48,54,61,0.4)' }}
                      >
                        <td style={{ padding: '12px 20px' }}>
                          <img src={p.images?.[0] || 'https://via.placeholder.com/48'}
                            alt={p.title}
                            style={{ width: '44px', height: '44px', borderRadius: '10px',
                              objectFit: 'cover', border: '1px solid #30363D' }} />
                        </td>
                        <td style={{ padding: '12px 20px', color: '#fff',
                          fontSize: '13px', fontWeight: '600', maxWidth: '200px' }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.title}
                          </div>
                        </td>
                        <td style={{ padding: '12px 20px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '20px',
                            background: 'rgba(88,166,255,0.1)',
                            color: '#58A6FF', fontSize: '11px', fontWeight: '700' }}>
                            {p.category}
                          </span>
                        </td>
                        <td style={{ padding: '12px 20px', color: '#00FFB3',
                          fontWeight: '700', fontSize: '14px' }}>
                          ₹{p.price}
                        </td>
                        <td style={{ padding: '12px 20px' }}>
                          <span style={{
                            color: p.stock > 10 ? '#00FFB3' : p.stock > 0 ? '#FFA657' : '#F85149',
                            fontWeight: '700', fontSize: '13px'
                          }}>
                            {p.stock > 0 ? p.stock : 'Out'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 20px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <motion.button whileHover={{ scale: 1.05 }}
                              onClick={() => openEdit(p)}
                              style={{ padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
                                background: 'rgba(88,166,255,0.1)',
                                border: '1px solid rgba(88,166,255,0.3)',
                                color: '#58A6FF', fontSize: '12px', fontWeight: '600' }}>
                              ✏️ Edit
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }}
                              onClick={() => deleteProduct(p._id)}
                              style={{ padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
                                background: 'rgba(248,81,73,0.1)',
                                border: '1px solid rgba(248,81,73,0.3)',
                                color: '#F85149', fontSize: '12px' }}>
                              🗑️
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ══ ORDERS ══ */}
        {tab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Search + Filter */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <input
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                placeholder="🔍 Search by ID or customer..."
                style={{ ...inputStyle, maxWidth: '300px', flex: 1 }}
              />
              <select value={orderFilter} onChange={e => setOrderFilter(e.target.value)}
                style={{ ...inputStyle, maxWidth: '160px' }}>
                <option value="all">All Status</option>
                {['pending','processing','shipped','delivered','cancelled'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div style={{ padding: '10px 16px', borderRadius: '10px',
                background: 'rgba(88,166,255,0.1)',
                border: '1px solid rgba(88,166,255,0.2)',
                color: '#58A6FF', fontSize: '13px', fontWeight: '700' }}>
                📋 {filteredOrders.length} orders
              </div>
            </div>

            <div style={{ borderRadius: '20px', background: '#161B22',
              border: '1px solid #30363D', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #30363D' }}>
                      {['ID','Customer','Items','Amount','Status','Tracking','Date'].map(h => (
                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left',
                          color: '#555', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o, i) => (
                      <motion.tr key={o._id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        style={{ borderBottom: '1px solid rgba(48,54,61,0.3)' }}
                      >
                        <td style={{ padding: '12px 16px', color: '#58A6FF',
                          fontSize: '12px', fontFamily: 'JetBrains Mono' }}>
                          #{o._id?.slice(-6).toUpperCase()}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%',
                              background: 'linear-gradient(135deg, #58A6FF, #00FFB3)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#000', fontSize: '12px', fontWeight: '700' }}>
                              {(o.userId?.name?.[0] || 'U').toUpperCase()}
                            </div>
                            <div>
                              <p style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>
                                {o.userId?.name || 'Customer'}
                              </p>
                              <p style={{ color: '#555', fontSize: '11px' }}>
                                {o.userId?.email || ''}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#8B949E', fontSize: '13px' }}>
                          {o.items?.length || 0} items
                        </td>
                        <td style={{ padding: '12px 16px', color: '#00FFB3',
                          fontWeight: '700', fontSize: '14px' }}>
                          ₹{o.totalAmount}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '20px',
                            fontSize: '11px', fontWeight: '700',
                            color: statusColors[o.status] || '#8B949E',
                            background: `${statusColors[o.status]}15` }}>
                            {(o.status || 'pending').toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <select value={o.status || 'pending'}
                            onChange={e => updateOrderStatus(o._id, e.target.value)}
                            style={{ padding: '6px 10px', borderRadius: '8px',
                              background: '#1C2128', border: '1px solid #30363D',
                              color: '#fff', fontSize: '12px', cursor: 'pointer', outline: 'none' }}>
                            {['pending','processing','shipped','delivered','cancelled'].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#555', fontSize: '12px' }}>
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ══ CUSTOMERS ══ */}
        {tab === 'customers' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

              {/* Customer List */}
              <div style={{ borderRadius: '20px', background: '#161B22',
                border: '1px solid #30363D', overflow: 'hidden' }}>
                <div style={{ padding: '18px 20px', borderBottom: '1px solid #30363D' }}>
                  <h3 style={{ color: '#fff', fontWeight: '700' }}>
                    👥 All Customers ({customers.length})
                  </h3>
                </div>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {customers.length > 0 ? customers.map((c, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px', borderRadius: '12px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(48,54,61,0.5)'
                    }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%',
                        background: `linear-gradient(135deg, ${COLORS[i%5]}, ${COLORS[(i+2)%5]})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#000', fontWeight: '700', fontSize: '14px' }}>
                        {(c?.name?.[0] || 'U').toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>
                          {c?.name || 'Customer'}
                        </p>
                        <p style={{ color: '#555', fontSize: '12px' }}>{c?.email || ''}</p>
                      </div>
                    </div>
                  )) : (
                    <p style={{ color: '#555', textAlign: 'center', padding: '20px' }}>
                      No customers yet
                    </p>
                  )}
                </div>
              </div>

              {/* Customer Feedbacks */}
              <div style={{ borderRadius: '20px', background: '#161B22',
                border: '1px solid #30363D', overflow: 'hidden' }}>
                <div style={{ padding: '18px 20px', borderBottom: '1px solid #30363D' }}>
                  <h3 style={{ color: '#fff', fontWeight: '700' }}>
                    ⭐ Customer Feedbacks ({feedbacks.length})
                  </h3>
                </div>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px',
                  maxHeight: '400px', overflowY: 'auto' }}>
                  {feedbacks.length > 0 ? feedbacks.map((f, i) => (
                    <div key={i} style={{
                      padding: '14px', borderRadius: '12px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(48,54,61,0.5)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', marginBottom: '8px' }}>
                        <p style={{ color: '#fff', fontWeight: '600', fontSize: '13px' }}>
                          {f.userName || 'User'}
                        </p>
                        <span style={{
                          padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
                          color: f.sentiment === 'Positive' ? '#00FFB3' :
                                 f.sentiment === 'Negative' ? '#F85149' : '#FFA657',
                          background: f.sentiment === 'Positive' ? 'rgba(0,255,179,0.1)' :
                                      f.sentiment === 'Negative' ? 'rgba(248,81,73,0.1)' :
                                      'rgba(255,166,87,0.1)',
                        }}>
                          {f.sentiment}
                        </span>
                      </div>
                      <div style={{ display: 'flex', marginBottom: '6px' }}>
                        {[1,2,3,4,5].map(s => (
                          <span key={s} style={{ color: s <= f.rating ? '#FFA657' : '#333', fontSize: '12px' }}>★</span>
                        ))}
                      </div>
                      <p style={{ color: '#8B949E', fontSize: '12px', lineHeight: '1.5' }}>
                        {f.comment}
                      </p>
                    </div>
                  )) : (
                    <p style={{ color: '#555', textAlign: 'center', padding: '20px' }}>
                      No feedbacks yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ══ CUSTOMER CARE ══ */}
        {tab === 'care' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px',
              height: 'calc(100vh - 180px)' }}>

              {/* Customer List */}
              <div style={{ borderRadius: '20px', background: '#161B22',
                border: '1px solid #30363D', overflow: 'hidden',
                display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #30363D' }}>
                  <h3 style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>
                    💬 Conversations
                  </h3>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                  {customers.length > 0 ? customers.map((c, i) => (
                    <motion.div key={i} whileHover={{ x: 4 }}
                      onClick={() => setSelectedCustomer(c)}
                      style={{
                        padding: '12px', borderRadius: '12px', cursor: 'pointer',
                        marginBottom: '8px',
                        background: selectedCustomer === c
                          ? 'rgba(88,166,255,0.1)'
                          : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${selectedCustomer === c
                          ? 'rgba(88,166,255,0.3)'
                          : 'rgba(48,54,61,0.5)'}`,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%',
                          background: `linear-gradient(135deg, ${COLORS[i%5]}, ${COLORS[(i+2)%5]})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#000', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>
                          {(c?.name?.[0] || 'U').toUpperCase()}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <p style={{ color: '#fff', fontSize: '13px', fontWeight: '600',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {c?.name || 'Customer'}
                          </p>
                          <p style={{ color: '#555', fontSize: '11px' }}>
                            📧 {c?.email || 'No email'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <p style={{ color: '#555', textAlign: 'center', padding: '20px', fontSize: '13px' }}>
                      No customers yet
                    </p>
                  )}
                </div>
              </div>

              {/* Chat Area */}
              <div style={{ borderRadius: '20px', background: '#161B22',
                border: '1px solid #30363D', display: 'flex', flexDirection: 'column' }}>
                {selectedCustomer ? (
                  <>
                    {/* Chat Header */}
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #30363D',
                      display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #58A6FF, #00FFB3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#000', fontWeight: '700' }}>
                        {(selectedCustomer?.name?.[0] || 'U').toUpperCase()}
                      </div>
                      <div>
                        <p style={{ color: '#fff', fontWeight: '700' }}>
                          {selectedCustomer?.name || 'Customer'}
                        </p>
                        <p style={{ color: '#555', fontSize: '12px' }}>
                          📧 {selectedCustomer?.email}
                        </p>
                      </div>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px',
                      display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {messages.filter(m => m.customerId === selectedCustomer?._id || true)
                        .map(msg => (
                        <div key={msg.id} style={{
                          display: 'flex',
                          justifyContent: msg.from === 'admin' ? 'flex-end' : 'flex-start'
                        }}>
                          <div style={{
                            maxWidth: '70%', padding: '12px 16px',
                            borderRadius: msg.from === 'admin'
                              ? '16px 16px 4px 16px'
                              : '16px 16px 16px 4px',
                            background: msg.from === 'admin'
                              ? 'linear-gradient(135deg, rgba(88,166,255,0.2), rgba(0,255,179,0.1))'
                              : 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                          }}>
                            <p style={{ color: '#fff', fontSize: '13px', lineHeight: '1.5' }}>
                              {msg.text}
                            </p>
                            <p style={{ color: '#555', fontSize: '10px', marginTop: '4px', textAlign: 'right' }}>
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                      {messages.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#555',
                          fontSize: '13px', marginTop: '40px' }}>
                          <p style={{ fontSize: '40px', marginBottom: '12px' }}>📧</p>
                          <p>Send a message to {selectedCustomer?.name}</p>
                          <p style={{ fontSize: '12px', marginTop: '4px' }}>
                            via {selectedCustomer?.email}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Reply Box */}
                    <div style={{ padding: '16px 20px', borderTop: '1px solid #30363D',
                      display: 'flex', gap: '10px' }}>
                      <input
                        value={replyMsg}
                        onChange={e => setReplyMsg(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendReply()}
                        placeholder={`Message to ${selectedCustomer?.name}...`}
                        style={{ ...inputStyle, flex: 1 }}
                      />
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={sendReply}
                        style={{ padding: '10px 20px', borderRadius: '10px',
                          background: 'linear-gradient(135deg, #58A6FF, #00FFB3)',
                          border: 'none', color: '#000', fontWeight: '700',
                          cursor: 'pointer', fontSize: '13px' }}>
                        Send 📧
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
                    <span style={{ fontSize: '48px' }}>💬</span>
                    <p style={{ color: '#555', fontSize: '14px' }}>
                      Select a customer to start conversation
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ══ SETTINGS ══ */}
        {tab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ maxWidth: '600px' }}>
              {[
                { label: 'Store Name',     value: 'EmmanStore',          icon: '🏪' },
                { label: 'Admin Email',    value: 'admin@emmanstore.com', icon: '📧' },
                { label: 'Currency',       value: 'INR (₹)',             icon: '💰' },
                { label: 'Country',        value: 'India',               icon: '🇮🇳' },
                { label: 'AI Model',       value: 'Llama3 (Ollama)',     icon: '🤖' },
                { label: 'Database',       value: 'MongoDB Atlas',        icon: '🍃' },
              ].map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '18px 20px',
                    borderRadius: '14px', marginBottom: '10px',
                    background: '#161B22', border: '1px solid #30363D'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>{s.icon}</span>
                    <span style={{ color: '#8B949E', fontSize: '14px' }}>{s.label}</span>
                  </div>
                  <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>
                    {s.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* ══ Product Form Modal ══ */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: '620px',
                maxHeight: '90vh', overflowY: 'auto',
                borderRadius: '24px', background: '#161B22',
                border: '1px solid rgba(88,166,255,0.2)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.5)', padding: '32px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ color: '#fff', fontWeight: '800', fontSize: '20px' }}>
                  {editItem ? '✏️ Edit Product' : '+ Add Product'}
                </h2>
                <button onClick={() => setShowForm(false)}
                  style={{ background: 'none', border: 'none', color: '#8B949E',
                    fontSize: '24px', cursor: 'pointer' }}>×</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {/* Title */}
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ color: '#8B949E', fontSize: '11px', fontWeight: '700',
                    letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>TITLE *</label>
                  <input value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Product title" style={inputStyle} />
                </div>

                {/* Category Dropdown */}
                <div style={{ gridColumn: '1/-1' }}>
  <label style={{ color: '#8B949E', fontSize: '11px', fontWeight: '700',
    letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
    CATEGORY *
  </label>
  <select
    value={form.category}
    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
    style={{
      width: '100%', padding: '10px 14px', borderRadius: '10px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(48,54,61,0.8)',
      color: form.category ? '#fff' : '#8B949E',
      fontSize: '13px', outline: 'none',
      boxSizing: 'border-box', cursor: 'pointer'
    }}
  >
    <option value="" style={{ background: '#161B22' }}>
      Select Category
    </option>
    {['Mobiles','Laptops','Electronics','Fashion',
      'Shoes','Books','Grocery','Furniture'].map(c => (
      <option key={c} value={c} style={{ background: '#161B22' }}>
        {c}
      </option>
    ))}
  </select>
</div>

                {/* Price */}
                <div>
                  <label style={{ color: '#8B949E', fontSize: '11px', fontWeight: '700',
                    letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>PRICE (₹) *</label>
                  <input type="number" value={form.price}
                    onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                    placeholder="0" style={inputStyle} />
                </div>

                <div>
                  <label style={{ color: '#8B949E', fontSize: '11px', fontWeight: '700',
                    letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>ORIGINAL PRICE</label>
                  <input type="number" value={form.originalPrice}
                    onChange={e => setForm(p => ({ ...p, originalPrice: e.target.value }))}
                    placeholder="0" style={inputStyle} />
                </div>

                <div>
                  <label style={{ color: '#8B949E', fontSize: '11px', fontWeight: '700',
                    letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>STOCK</label>
                  <input type="number" value={form.stock}
                    onChange={e => setForm(p => ({ ...p, stock: e.target.value }))}
                    placeholder="0" style={inputStyle} />
                </div>

                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ color: '#8B949E', fontSize: '11px', fontWeight: '700',
                    letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>IMAGE URLS (comma separated)</label>
                  <input value={form.images}
                    onChange={e => setForm(p => ({ ...p, images: e.target.value }))}
                    placeholder="https://img1.jpg, https://img2.jpg" style={inputStyle} />
                </div>

                <div>
                  <label style={{ color: '#8B949E', fontSize: '11px', fontWeight: '700',
                    letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>COLORS</label>
                  <input value={form.colors}
                    onChange={e => setForm(p => ({ ...p, colors: e.target.value }))}
                    placeholder="Red, Blue, Black" style={inputStyle} />
                </div>

                <div>
                  <label style={{ color: '#8B949E', fontSize: '11px', fontWeight: '700',
                    letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>SIZES</label>
                  <input value={form.sizes}
                    onChange={e => setForm(p => ({ ...p, sizes: e.target.value }))}
                    placeholder="S, M, L, XL" style={inputStyle} />
                </div>

                {/* Description + AI */}
                <div style={{ gridColumn: '1/-1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ color: '#8B949E', fontSize: '11px', fontWeight: '700',
                      letterSpacing: '1px' }}>DESCRIPTION</label>
                    <motion.button whileHover={{ scale: 1.05 }}
                      onClick={generateDescription} disabled={aiLoading}
                      style={{ padding: '5px 14px', borderRadius: '20px',
                        border: '1px solid rgba(88,166,255,0.3)', cursor: 'pointer',
                        background: 'rgba(88,166,255,0.1)',
                        color: '#58A6FF', fontSize: '11px', fontWeight: '700' }}>
                      {aiLoading ? '🤖 Generating...' : '🤖 AI Generate'}
                    </motion.button>
                  </div>
                  <textarea value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    rows={3} placeholder="Click AI Generate or write manually..."
                    style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  style={{ flex: 1, padding: '14px', borderRadius: '14px',
                    border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #58A6FF, #00FFB3)',
                    color: '#000', fontWeight: '800', fontSize: '15px' }}>
                  {editItem ? '✅ Update' : '🚀 Add Product'}
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowForm(false)}
                  style={{ padding: '14px 24px', borderRadius: '14px',
                    border: '1px solid #30363D', background: 'transparent',
                    color: '#8B949E', cursor: 'pointer' }}>
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>