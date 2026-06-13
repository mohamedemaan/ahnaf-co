import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

// ⭐ Star Rating Component
const StarRating = ({ rating, setRating, readOnly = false }) => {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => !readOnly && setRating(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          style={{
            fontSize: '24px',
            cursor: readOnly ? 'default' : 'pointer',
            color: star <= (hover || rating) ? '#FFD700' : '#333',
            transition: 'color 0.2s'
          }}
        >★</span>
      ))}
    </div>
  );
};

// 🏷️ Sentiment Badge
const SentimentBadge = ({ sentiment }) => {
  const config = {
    Positive: { emoji: '😊', color: '#00ff88', bg: 'rgba(0,255,136,0.1)', border: 'rgba(0,255,136,0.3)' },
    Negative: { emoji: '😞', color: '#ff4444', bg: 'rgba(255,68,68,0.1)',  border: 'rgba(255,68,68,0.3)' },
    Neutral:  { emoji: '😐', color: '#ffaa00', bg: 'rgba(255,170,0,0.1)', border: 'rgba(255,170,0,0.3)' }
  };
  const c = config[sentiment] || config.Neutral;
  return (
    <span style={{
      padding: '3px 10px',
      borderRadius: '20px',
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.color,
      fontSize: '12px',
      fontWeight: '600'
    }}>
      {c.emoji} {sentiment}
    </span>
  );
};

// 📝 Main ReviewSection
const ReviewSection = ({ productId, userId, userName }) => {
  const [reviews, setReviews]     = useState([]);
  const [rating, setRating]       = useState(0);
  const [comment, setComment]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage]     = useState('');

  // Fetch reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/reviews/${productId}`);
      if (data.success) setReviews(data.reviews);
    } catch (err) {
      console.error('Fetch reviews error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  // Submit review
  const submitReview = async () => {
    if (!rating)        return setMessage('⚠️ Please select a star rating!');
    if (!comment.trim()) return setMessage('⚠️ Please write a comment!');

    setSubmitting(true);
    setMessage('🤖 AI analyzing sentiment...');

    try {
      const { data } = await axios.post(`${API}/api/reviews`, {
        productId,
        userId:   userId  || 'guest',
        userName: userName || 'Anonymous',
        rating,
        comment
      });

      if (data.success) {
        setMessage(`✅ Review submitted! Sentiment: ${data.review.sentiment}`);
        setRating(0);
        setComment('');
        fetchReviews();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('❌ Failed to submit. Try again!');
    } finally {
      setSubmitting(false);
    }
  };

  // Stats
  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const positiveCount = reviews.filter(r => r.sentiment === 'Positive').length;
  const negativeCount = reviews.filter(r => r.sentiment === 'Negative').length;

  return (
    <div style={{ marginTop: '40px' }}>

      {/* Header */}
      <h2 style={{
        color: '#00ffff',
        fontSize: '22px',
        fontWeight: '700',
        marginBottom: '24px',
        borderBottom: '1px solid rgba(0,255,255,0.2)',
        paddingBottom: '12px'
      }}>
        ⭐ Reviews & Ratings
      </h2>

      {/* Stats Bar */}
      {reviews.length > 0 && (
        <div style={{
          display: 'flex', gap: '16px', marginBottom: '28px',
          flexWrap: 'wrap'
        }}>
          {[
            { label: 'Avg Rating', value: `${avgRating}/5`, color: '#FFD700' },
            { label: 'Total',      value: reviews.length,   color: '#00ffff' },
            { label: '😊 Positive', value: positiveCount,   color: '#00ff88' },
            { label: '😞 Negative', value: negativeCount,   color: '#ff4444' },
          ].map((stat, i) => (
            <div key={i} style={{
              padding: '12px 20px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center'
            }}>
              <div style={{ color: stat.color, fontSize: '20px', fontWeight: '700' }}>
                {stat.value}
              </div>
              <div style={{ color: '#888', fontSize: '12px', marginTop: '2px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Form */}
      <div style={{
        padding: '24px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(0,255,255,0.15)',
        marginBottom: '28px'
      }}>
        <h3 style={{ color: '#ccc', fontSize: '16px', marginBottom: '16px' }}>
          Write a Review
        </h3>

        <StarRating rating={rating} setRating={setRating} />

        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={3}
          style={{
            width: '100%', marginTop: '16px',
            padding: '12px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(0,255,255,0.2)',
            color: '#fff', fontSize: '14px',
            resize: 'vertical', outline: 'none',
            boxSizing: 'border-box'
          }}
        />

        {message && (
          <div style={{
            marginTop: '10px', padding: '10px',
            borderRadius: '8px',
            background: 'rgba(0,255,255,0.05)',
            color: '#00ffff', fontSize: '13px'
          }}>
            {message}
          </div>
        )}

        <button
          onClick={submitReview}
          disabled={submitting}
          style={{
            marginTop: '14px', padding: '12px 28px',
            borderRadius: '25px',
            background: submitting
              ? 'rgba(0,255,255,0.2)'
              : 'linear-gradient(135deg, #00ffff, #8b00ff)',
            border: 'none', color: '#fff',
            fontWeight: '700', fontSize: '14px',
            cursor: submitting ? 'not-allowed' : 'pointer'
          }}
        >
          {submitting ? '🤖 Analyzing...' : '✍️ Submit Review'}
        </button>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div style={{
          color: '#555', textAlign: 'center', padding: '30px',
          borderRadius: '12px',
          border: '1px dashed rgba(255,255,255,0.1)'
        }}>
          No reviews yet. Be the first to review! ⭐
        </div>
      ) : (
        <AnimatePresence>
          {reviews.map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                padding: '18px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                marginBottom: '12px'
              }}
            >
              {/* Review Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap', gap: '8px',
                marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00ffff33, #8b00ff33)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#00ffff',
                    fontWeight: '700', fontSize: '14px'
                  }}>
                    {review.userName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>
                      {review.userName}
                    </div>
                    <div style={{ color: '#555', fontSize: '11px' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <StarRating rating={review.rating} readOnly />
                  <SentimentBadge sentiment={review.sentiment} />
                </div>
              </div>

              {/* Comment */}
              <p style={{ color: '#bbb', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                {review.comment}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default ReviewSection;