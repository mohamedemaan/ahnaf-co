import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const [cartCount,  setCartCount]  = useState(0);
  const [user,       setUser]       = useState(null);
  const [search,     setSearch]     = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [showMenu,   setShowMenu]   = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    fetchCartCount();

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const { data } = await axios.get(`${API}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartCount(data.length || 0);
    } catch {
      setCartCount(0);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/home?search=${search.trim()}`);
      setShowSearch(false);
      setSearch('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowMenu(false);
    navigate('/');
  };

  // Hide navbar on splash/landing/login/register
  const hideOn = ['/', '/splash', '/login', '/register'];
  if (hideOn.includes(location.pathname)) return null;

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        position: 'sticky', top: 0, zIndex: 1000,
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: scrolled
          ? 'rgba(13,17,23,0.98)'
          : 'rgba(13,17,23,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(48,54,61,0.8)',
        boxShadow: scrolled
          ? '0 4px 30px rgba(0,0,0,0.3)'
          : 'none',
        transition: 'all 0.3s'
      }}
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/home')}
        style={{
          display: 'flex', alignItems: 'center',
          gap: '10px', cursor: 'pointer', flexShrink: 0
        }}
      >
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ fontSize: '24px' }}
        >
          🛍️
        </motion.span>
        <span style={{
          fontFamily: 'JetBrains Mono',
          fontWeight: '900',
          fontSize: '14px',
          letterSpacing: '2px',
          background: 'linear-gradient(135deg, #58A6FF, #00FFB3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          EMMANSTORE
        </span>
      </motion.div>

      {/* Search Bar */}
      <div style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
        <AnimatePresence>
          {showSearch ? (
            <motion.input
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              onBlur={() => { setShowSearch(false); setSearch(''); }}
              placeholder="Search products..."
              style={{
                width: '100%', padding: '10px 16px',
                borderRadius: '25px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(88,166,255,0.4)',
                color: '#fff', fontSize: '14px',
                outline: 'none',
                boxShadow: '0 0 15px rgba(88,166,255,0.1)'
              }}
            />
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowSearch(true)}
              style={{
                display: 'flex', alignItems: 'center',
                gap: '8px', padding: '8px 16px',
                borderRadius: '25px', cursor: 'pointer',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(48,54,61,0.8)',
                color: '#8B949E', fontSize: '13px'
              }}
            >
              🔍 Search products...
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        {/* Cart */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/cart')}
          style={{
            position: 'relative', padding: '8px 16px',
            borderRadius: '12px', cursor: 'pointer',
            background: 'rgba(88,166,255,0.05)',
            border: '1px solid rgba(88,166,255,0.2)',
            color: '#58A6FF', fontSize: '14px',
            fontWeight: '600', display: 'flex',
            alignItems: 'center', gap: '6px'
          }}
        >
          🛒 Cart
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                position: 'absolute', top: '-6px', right: '-6px',
                width: '20px', height: '20px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F85149, #ff6b6b)',
                color: '#fff', fontSize: '11px',
                fontWeight: '800', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(248,81,73,0.5)'
              }}
            >
              {cartCount}
            </motion.span>
          )}
        </motion.button>

        {/* My Orders */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/myorders')}
          style={{
            padding: '8px 16px', borderRadius: '12px',
            cursor: 'pointer',
            background: 'transparent',
            border: '1px solid rgba(48,54,61,0.8)',
            color: '#8B949E', fontSize: '14px',
            fontWeight: '600'
          }}
        >
          📦 Orders
        </motion.button>

        {/* User Menu */}
        <div style={{ position: 'relative' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMenu(!showMenu)}
            style={{
              width: '38px', height: '38px',
              borderRadius: '50%', cursor: 'pointer',
              background: 'linear-gradient(135deg, rgba(88,166,255,0.2), rgba(0,255,179,0.2))',
              border: '1px solid rgba(88,166,255,0.3)',
              color: '#fff', fontSize: '16px',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: '700'
            }}
          >
            {user?.name?.[0]?.toUpperCase() || '👤'}
          </motion.button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                style={{
                  position: 'absolute', top: '48px', right: 0,
                  width: '200px', borderRadius: '16px',
                  background: 'rgba(22,27,34,0.98)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(48,54,61,0.8)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  overflow: 'hidden', zIndex: 999
                }}
              >
                {/* User Info */}
                <div style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid rgba(48,54,61,0.5)'
                }}>
                  <p style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>
                    {user?.name || 'User'}
                  </p>
                  <p style={{ color: '#8B949E', fontSize: '11px', marginTop: '2px' }}>
                    {user?.email}
                  </p>
                </div>

                {/* Menu Items */}
                {[
                  { icon: '📦', label: 'My Orders', path: '/myorders' },
                  { icon: '🛒', label: 'My Cart',   path: '/cart' },
                  { icon: '🛡️', label: 'Admin',     path: '/admin' },
                ].map(item => (
                  <motion.button
                    key={item.label}
                    whileHover={{ background: 'rgba(88,166,255,0.05)' }}
                    onClick={() => { navigate(item.path); setShowMenu(false); }}
                    style={{
                      width: '100%', padding: '12px 16px',
                      display: 'flex', alignItems: 'center',
                      gap: '10px', cursor: 'pointer',
                      background: 'transparent', border: 'none',
                      color: '#ccc', fontSize: '13px',
                      fontWeight: '500', textAlign: 'left'
                    }}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </motion.button>
                ))}

                {/* Logout */}
                <motion.button
                  whileHover={{ background: 'rgba(248,81,73,0.05)' }}
                  onClick={handleLogout}
                  style={{
                    width: '100%', padding: '12px 16px',
                    display: 'flex', alignItems: 'center',
                    gap: '10px', cursor: 'pointer',
                    background: 'transparent',
                    borderTop: '1px solid rgba(48,54,61,0.5)',
                    border: 'none', color: '#F85149',
                    fontSize: '13px', fontWeight: '600',
                    textAlign: 'left'
                  }}
                >
                  <span>🚪</span> Logout
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;