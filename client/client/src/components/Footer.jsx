import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const links = {
    Shop: [
      { label: 'All Products', path: '/home' },
      { label: 'My Cart',      path: '/cart' },
      { label: 'My Orders',    path: '/myorders' },
    ],
    Account: [
      { label: 'Login',    path: '/login' },
      { label: 'Register', path: '/register' },
      { label: 'Admin',    path: '/admin' },
    ],
    Support: [
      { label: '📧 support@emmanstore.com', path: null },
      { label: '📞 +91 98765 43210',        path: null },
      { label: '🕐 Mon-Sat 9AM - 6PM',      path: null },
    ],
  };

  const features = [
    { icon: '🚚', title: 'Free Delivery',   desc: 'On all orders'      },
    { icon: '↩️', title: 'Easy Returns',    desc: '7-day return policy' },
    { icon: '🔒', title: 'Secure Payment',  desc: '100% safe checkout' },
    { icon: '🤖', title: 'AI Powered',      desc: 'Smart shopping'     },
  ];

  return (
    <footer style={{
      background: '#0D1117',
      borderTop: '1px solid rgba(48,54,61,0.8)',
      marginTop: '60px',
    }}>

      {/* ── Feature Strip ── */}
      <div style={{
        borderBottom: '1px solid rgba(48,54,61,0.5)',
        padding: '32px 48px',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
        }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '16px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(48,54,61,0.5)',
              }}
            >
              <span style={{ fontSize: '28px' }}>{f.icon}</span>
              <div>
                <p style={{
                  color: '#fff', fontWeight: '700',
                  fontSize: '14px', marginBottom: '2px'
                }}>
                  {f.title}
                </p>
                <p style={{ color: '#8B949E', fontSize: '12px' }}>
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Main Footer ── */}
      <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '40px',
        }}>

          {/* Brand Column */}
          <div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              style={{
                display: 'flex', alignItems: 'center',
                gap: '10px', marginBottom: '16px',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/home')}
            >
              <span style={{ fontSize: '28px' }}>🛍️</span>
              <span style={{
                fontFamily: 'JetBrains Mono',
                fontWeight: '900', fontSize: '16px',
                letterSpacing: '2px',
                background: 'linear-gradient(135deg, #58A6FF, #00FFB3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                EMMANSTORE
              </span>
            </motion.div>

            <p style={{
              color: '#8B949E', fontSize: '13px',
              lineHeight: '1.7', marginBottom: '24px',
              maxWidth: '260px',
            }}>
              AI-powered e-commerce platform. Shop smarter with
              personalized recommendations and instant delivery. 🚀
            </p>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { icon: '𝕏',  label: 'Twitter'   },
                { icon: '📘', label: 'Facebook'  },
                { icon: '📸', label: 'Instagram' },
                { icon: '💼', label: 'LinkedIn'  },
              ].map((s, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  title={s.label}
                  style={{
                    width: '36px', height: '36px',
                    borderRadius: '10px', cursor: 'pointer',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(48,54,61,0.8)',
                    color: '#8B949E', fontSize: '14px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {s.icon}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 style={{
                color: '#fff', fontWeight: '800',
                fontSize: '13px', letterSpacing: '2px',
                marginBottom: '20px',
                fontFamily: 'JetBrains Mono',
              }}>
                {title.toUpperCase()}
              </h4>
              <div style={{
                display: 'flex', flexDirection: 'column', gap: '12px'
              }}>
                {items.map((item, i) => (
                  <motion.span
                    key={i}
                    whileHover={{ x: 4, color: '#58A6FF' }}
                    onClick={() => item.path && navigate(item.path)}
                    style={{
                      color: '#8B949E', fontSize: '13px',
                      cursor: item.path ? 'pointer' : 'default',
                      transition: 'color 0.2s',
                      display: 'block',
                    }}
                  >
                    {item.label}
                  </motion.span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Newsletter ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            marginTop: '48px', padding: '32px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(88,166,255,0.05), rgba(0,255,179,0.05))',
            border: '1px solid rgba(88,166,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '20px',
          }}
        >
          <div>
            <h3 style={{
              color: '#fff', fontWeight: '800',
              fontSize: '18px', marginBottom: '6px'
            }}>
              🎁 Get Exclusive Deals!
            </h3>
            <p style={{ color: '#8B949E', fontSize: '13px' }}>
              Subscribe for AI-curated offers just for you.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flex: '1', maxWidth: '400px' }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                flex: 1, padding: '12px 16px',
                borderRadius: '25px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(88,166,255,0.2)',
                color: '#fff', fontSize: '13px',
                outline: 'none',
              }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px 24px', borderRadius: '25px',
                border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #58A6FF, #00FFB3)',
                color: '#000', fontWeight: '800',
                fontSize: '13px', whiteSpace: 'nowrap',
              }}
            >
              Subscribe →
            </motion.button>
          </div>
        </motion.div>

        {/* ── Bottom Bar ── */}
        <div style={{
          marginTop: '40px', paddingTop: '24px',
          borderTop: '1px solid rgba(48,54,61,0.5)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <p style={{ color: '#555', fontSize: '12px' }}>
            © {year} EmmanStore. Built with ❤️ + 🤖 AI
          </p>

          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy Policy', 'Terms of Use', 'Cookie Policy'].map((item, i) => (
              <motion.span
                key={i}
                whileHover={{ color: '#58A6FF' }}
                style={{
                  color: '#555', fontSize: '12px',
                  cursor: 'pointer', transition: 'color 0.2s'
                }}
              >
                {item}
              </motion.span>
            ))}
          </div>

          {/* Payment Icons */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {['💳', '🏦', '📱', '💰'].map((icon, i) => (
              <span
                key={i}
                style={{
                  width: '32px', height: '22px',
                  borderRadius: '4px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(48,54,61,0.5)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '12px',
                }}
              >
                {icon}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;