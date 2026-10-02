import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

// ⭐ Star Rating Component
const StarRating = ({ rating, setRating, readOnly = false }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => !readOnly && setRating(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          className={`text-2xl transition-colors ${readOnly ? "cursor-default" : "cursor-pointer"} ${star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"}`}
        >★</span>
      ))}
    </div>
  );
};

// 🏷️ Sentiment Badge
const SentimentBadge = ({ sentiment }) => {
  const config = {
    Positive: { emoji: '😊', color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-200' },
    Negative: { emoji: '😞', color: 'text-rose-700', bg: 'bg-rose-100', border: 'border-rose-200' },
    Neutral:  { emoji: '😐', color: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-200' }
  };
  const c = config[sentiment] || config.Neutral;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${c.bg} ${c.color} ${c.border}`}>
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
    <div>

      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center gap-2">
        ⭐ Reviews & Ratings
      </h2>

      {/* Stats Bar */}
      {reviews.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-8">
          {[
            { label: 'Avg Rating', value: `${avgRating}/5`, color: 'text-yellow-500' },
            { label: 'Total',      value: reviews.length,   color: 'text-teal-600' },
            { label: 'Positive', emoji: '😊', value: positiveCount,   color: 'text-green-600' },
            { label: 'Negative', emoji: '😞', value: negativeCount,   color: 'text-rose-500' },
          ].map((stat, i) => (
            <div key={i} className="flex-1 min-w-[120px] p-4 bg-slate-50 border border-gray-200 rounded-xl text-center">
              <div className={`text-2xl font-black ${stat.color}`}>
                {stat.emoji} {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1 font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Form */}
      <div className="p-6 bg-slate-50 border border-gray-200 rounded-xl mb-8">
        <h3 className="text-gray-700 font-bold mb-4">
          Write a Review
        </h3>

        <StarRating rating={rating} setRating={setRating} />

        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={3}
          className="w-full mt-4 p-4 rounded-lg bg-white border border-gray-300 text-gray-800 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
        />

        {message && (
          <div className="mt-4 p-3 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 text-sm font-semibold">
            {message}
          </div>
        )}

        <button
          onClick={submitReview}
          disabled={submitting}
          className={`mt-4 px-6 py-3 rounded-lg font-bold text-white transition ${submitting ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"}`}
        >
          {submitting ? '🤖 Analyzing...' : '✍️ Submit Review'}
        </button>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8 text-gray-500 font-medium">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl text-gray-500 font-medium">
          No reviews yet. Be the first to review! ⭐
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {reviews.map((review, i) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
              >
                {/* Review Header */}
                <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-black flex items-center justify-center">
                      {review.userName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">
                        {review.userName}
                      </div>
                      <div className="text-gray-400 text-xs mt-0.5">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StarRating rating={review.rating} readOnly />
                    <SentimentBadge sentiment={review.sentiment} />
                  </div>
                </div>

                {/* Comment */}
                <p className="text-gray-700 text-sm leading-relaxed">
                  {review.comment}
                </p>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ReviewSection;