import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HeroBanner = () => {
  const navigate    = useNavigate();
  const ref         = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();

  // Parallax transforms
  const y1 = useTransform(scrollY, [0, 300], [0, -80]);
  const y2 = useTransform(scrollY, [0, 300], [0, -40]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Mouse parallax
  useEffect(() => {
    const handleMouse = (e) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  // Floating particles
  const particles = Array(20).fill(0).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 2,
  }));

  // Floating product badges
  const badges = [
    { icon: '🤖', label: 'AI Powered',    top: '20%', left: '8%',  delay: 0    },
    { icon: '🚀', label: 'Fast Delivery',  top: '60%', left: '5%',  delay: 0.5  },
    { icon: '🔒', label: 'Secure Pay',     top: '20%', right: '8%', delay: 1    },
    { icon: '⭐', label: '5 Star Rated',   top: '65%', right: '5%', delay: 1.5  },
  ];

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        height: '85vh',
        minHeight: '600px',
        overflow: 'hidden',
        background: '#0D1117',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ── Animated Grid Background ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(88,166,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(88,166,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        animation: 'gridMove 20s linear infinite',
      }} />

      {/* ── Glow Orbs ── */}
      <motion.div
        animate={{
          x: mousePos.x * 0.5,
          y: mousePos.y * 0.5,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        style={{
          position: 'absolute',
          top: '10%', left: '15%',
          width: '500px', height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(88,166,255,0.12), transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{
          x: mousePos.x * -0.3,
          y: mousePos.y * -0.3,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        style={{
          position: 'absolute',
          bottom: '10%', right: '15%',
          width: '400px', height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,179,0.1), transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Floating Particles ── */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: Math.random() > 0.5 ? '#58A6FF' : '#00FFB3',
            boxShadow: `0 0 ${p.size * 2}px currentColor`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* ── Floating Badges ── */}
      {badges.map((badge, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1, scale: 1,
            y: [0, -12, 0],
            x: mousePos.x * (i % 2 === 0 ? 0.05 : -0.05),
          }}
          transition={{
            opacity: { delay: badge.delay + 0.5, duration: 0.5 },
            scale:   { delay: badge.delay + 0.5, duration: 0.5 },
            y: { duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 },
            x: { type: 'spring', stiffness: 50 },
          }}
          style={{
            position: 'absolute',
            top: badge.top,
            left: badge.left,
            right: badge.right,
            padding: '10px 16px',
            borderRadius: '16px',
            background: 'rgba(22,27,34,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(88,166,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', gap: '8px',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <span style={{ fontSize: '20px' }}>{badge.icon}</span>
          <span style={{
            color: '#fff', fontSize: '12px',
            fontWeight: '700', whiteSpace: 'nowrap'
          }}>
            {badge.label}
          </span>
        </motion.div>
      ))}

      {/* ── 3D Rotating Ring ── */}
      <motion.div
        animate={{ rotateZ: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: '600px', height: '600px',
          borderRadius: '50%',
          border: '1px solid rgba(88,166,255,0.08)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ rotateZ: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: '450px', height: '450px',
          borderRadius: '50%',
          border: '1px dashed rgba(0,255,179,0.08)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Main Content ── */}
      <motion.div
        style={{ y: y1, opacity, position: 'relative', zIndex: 3, textAlign: 'center' }}
      >
        {/* Tag line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '20px', marginBottom: '24px',
            background: 'rgba(88,166,255,0.1)',
            border: '1px solid rgba(88,166,255,0.3)',
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ fontSize: '10px', color: '#00FFB3' }}
          >●</motion.span>
          <span style={{ color: '#58A6FF', fontSize: '12px', fontWeight: '700', letterSpacing: '2px' }}>
            AI-POWERED SHOPPING
          </span>
        </motion.div>

        {/* Heading */}
        <motion.div style={{ y: y2 }}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: '900',
              lineHeight: 1.1,
              marginBottom: '8px',
              fontFamily: 'JetBrains Mono',
            }}
          >
            <span style={{ color: '#fff' }}>Shop Smarter</span>
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            style={{
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: '900',
              lineHeight: 1.1,
              marginBottom: '24px',
              fontFamily: 'JetBrains Mono',
              background: 'linear-gradient(135deg, #58A6FF, #00FFB3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            With AI. 🤖
          </motion.h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            color: '#8B949E', fontSize: '18px',
            marginBottom: '40px', maxWidth: '500px',
            margin: '0 auto 40px',
            lineHeight: 1.6,
          }}
        >
          Discover products with AI recommendations,
          smart search & instant delivery. 🚀
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            display: 'flex', gap: '16px',
            justifyContent: 'center', flexWrap: 'wrap'
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(88,166,255,0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              padding: '16px 36px',
              borderRadius: '50px', border: 'none',
              background: 'linear-gradient(135deg, #58A6FF, #00FFB3)',
              color: '#000', fontSize: '15px',
              fontWeight: '800', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(88,166,255,0.3)',
            }}
          >
            Shop Now →
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/register')}
            style={{
              padding: '16px 36px',
              borderRadius: '50px',
              background: 'transparent',
              border: '1px solid rgba(88,166,255,0.4)',
              color: '#58A6FF', fontSize: '15px',
              fontWeight: '700', cursor: 'pointer',
            }}
          >
            Join Free 🚀
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            display: 'flex', gap: '40px',
            justifyContent: 'center',
            marginTop: '48px', flexWrap: 'wrap'
          }}
        >
          {[
            { value: '500+',  label: 'Products'  },
            { value: '1K+',   label: 'Customers' },
            { value: '4.9★',  label: 'Rating'    },
            { value: '100%',  label: 'Secure'    },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{
                fontSize: '28px', fontWeight: '900',
                fontFamily: 'JetBrains Mono',
                background: 'linear-gradient(135deg, #58A6FF, #00FFB3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {stat.value}
              </div>
              <div style={{ color: '#8B949E', fontSize: '12px', marginTop: '4px' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: 'absolute', bottom: '32px',
          left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '6px',
          color: '#8B949E', fontSize: '11px',
          letterSpacing: '2px',
        }}
      >
        <span>SCROLL</span>
        <span>↓</span>
      </motion.div>

      {/* Grid animation CSS */}
      <style>{`
        @keyframes gridMove {
          0%   { backgroundPosition: 0 0; }
          100% { backgroundPosition: 60px 60px; }
        }
      `}</style>
    </div>
  );
};

export default HeroBanner;