import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useToast } from '../components/Toast'; // 👈 top la import

const ProductCard = ({ product }) => {
 const showToast = (message) => alert(message); // 👈 inside component

  const addToCart = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('Please login first!', 'error'); // 👈 here
        navigate('/login');
        return;
      }
      await axios.post(`${API}/api/cart/add`, ...);
      showToast('Added to cart! 🛒', 'success'); // 👈 here
    } catch (err) {
      showToast('Failed to add!', 'error'); // 👈 here
    }
  };
  
const API = import.meta.env.VITE_API_URL;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [wishlist, setWishlist]     = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [rotateX, setRotateX]       = useState(0);
  const [rotateY, setRotateY]       = useState(0);
  const [isHovered, setIsHovered]   = useState(false);

  // 3D tilt effect
  const handleMouseMove = (e) => {
    const card  = e.currentTarget.getBoundingClientRect();
    const x     = e.clientX - card.left;
    const y     = e.clientY - card.top;
    const cx    = card.width  / 2;
    const cy    = card.height / 2;
    setRotateX(((y - cy) / cy) * -10);
    setRotateY(((x - cx) / cx) *  10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const addToCart = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      await axios.post(
        `${API}/api/cart/add`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      console.error('Cart error:', err);
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ perspective: '1000px', cursor: 'pointer' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <motion.div
        animate={{ rotateX, rotateY, scale: isHovered ? 1.03 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #1a1f2e, #161b27)',
          border: isHovered
            ? '1px solid rgba(88,166,255,0.5)'
            : '1px solid rgba(48,54,61,0.8)',
          boxShadow: isHovered
            ? '0 20px 60px rgba(88,166,255,0.2), 0 0 30px rgba(88,166,255,0.1)'
            : '0 4px 20px rgba(0,0,0,0.3)',
          transformStyle: 'preserve-3d',
          transition: 'border 0.3s, box-shadow 0.3s',
          position: 'relative',
        }}
      >
        {/* Image Container */}
        <div style={{ position: 'relative', overflow: 'hidden', height: '220px' }}>
          <motion.img
            src={product.images?.[0] || 'https://via.placeholder.com/300'}
            alt={product.title}
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.4 }}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', display: 'block'
            }}
          />

          {/* Gradient Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(22,27,34,0.8) 0%, transparent 60%)',
          }} />

          {/* Discount Badge */}
          {discount && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                position: 'absolute', top: '12px', left: '12px',
                padding: '4px 10px', borderRadius: '20px',
                background: 'linear-gradient(135deg, #F85149, #ff6b6b)',
                color: '#fff', fontSize: '12px', fontWeight: '800',
                boxShadow: '0 4px 15px rgba(248,81,73,0.4)'
              }}
            >
              -{discount}%
            </motion.div>
          )}

          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); setWishlist(!wishlist); }}
            style={{
              position: 'absolute', top: '12px', right: '12px',
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(13,17,23,0.8)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${wishlist ? '#F85149' : 'rgba(255,255,255,0.1)'}`,
              fontSize: '16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {wishlist ? '❤️' : '🤍'}
          </motion.button>

          {/* Quick View Overlay */}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0 }}
            style={{
              position: 'absolute', bottom: '12px',
              left: '50%', transform: 'translateX(-50%)',
              padding: '6px 16px', borderRadius: '20px',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', fontSize: '12px',
              fontWeight: '600', whiteSpace: 'nowrap'
            }}
          >
            👁 Quick View
          </motion.div>
        </div>

        {/* Card Body */}
        <div style={{ padding: '16px' }}>

          {/* Category */}
          <p style={{
            fontSize: '10px', fontWeight: '700',
            color: '#58A6FF', letterSpacing: '2px',
            textTransform: 'uppercase', marginBottom: '6px'
          }}>
            {product.category}
          </p>

          {/* Title */}
          <h3 style={{
            color: '#fff', fontSize: '15px',
            fontWeight: '700', marginBottom: '10px',
            overflow: 'hidden', textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {product.title}
          </h3>

          {/* Price Row */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '20px', fontWeight: '900',
                background: 'linear-gradient(135deg, #58A6FF, #00FFB3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span style={{
                  fontSize: '12px', color: '#555',
                  textDecoration: 'line-through'
                }}>
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Stock Dot */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: product.stock > 0 ? '#00FFB3' : '#F85149',
                boxShadow: product.stock > 0
                  ? '0 0 6px #00FFB3'
                  : '0 0 6px #F85149'
              }} />
              <span style={{
                fontSize: '10px',
                color: product.stock > 0 ? '#00FFB3' : '#F85149'
              }}>
                {product.stock > 0 ? 'In Stock' : 'Sold Out'}
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={addToCart}
            disabled={product.stock === 0}
            style={{
              width: '100%', padding: '11px',
              borderRadius: '12px', border: 'none',
              fontWeight: '700', fontSize: '13px',
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              background: addedToCart
                ? 'linear-gradient(135deg, #00FFB3, #00cc8f)'
                : product.stock === 0
                  ? 'rgba(255,255,255,0.05)'
                  : 'linear-gradient(135deg, #58A6FF, #00FFB3)',
              color: addedToCart
                ? '#000'
                : product.stock === 0 ? '#555' : '#000',
              boxShadow: addedToCart
                ? '0 4px 20px rgba(0,255,179,0.3)'
                : product.stock > 0
                  ? '0 4px 20px rgba(88,166,255,0.2)'
                  : 'none',
              transition: 'all 0.3s'
            }}
          >
            {addedToCart
              ? '✓ Added!'
              : product.stock === 0
                ? 'Out of Stock'
                : '🛒 Add to Cart'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;