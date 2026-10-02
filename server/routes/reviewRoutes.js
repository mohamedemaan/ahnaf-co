const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// GET reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST a new review
router.post('/', async (req, res) => {
  try {
    const { productId, userId, userName, rating, comment } = req.body;
    
    // Simple sentiment analysis based on keywords
    let sentiment = 'Neutral';
    const positiveWords = ['good', 'great', 'awesome', 'excellent', 'love', 'best', 'perfect', 'amazing', 'nice', 'beautiful'];
    const negativeWords = ['bad', 'terrible', 'worst', 'awful', 'hate', 'poor', 'disappointing', 'waste', 'broken'];
    
    const lowerComment = comment.toLowerCase();
    
    const hasPositive = positiveWords.some(word => lowerComment.includes(word));
    const hasNegative = negativeWords.some(word => lowerComment.includes(word));
    
    if (rating >= 4 || (hasPositive && !hasNegative)) {
      sentiment = 'Positive';
    } else if (rating <= 2 || (hasNegative && !hasPositive)) {
      sentiment = 'Negative';
    }

    const review = await Review.create({
      productId,
      userId,
      userName,
      rating,
      comment,
      sentiment
    });

    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
