const express = require('express');
const router = express.Router();
const axios = require('axios');
const Review = require('../models/Review');

// 🤖 Ollama Sentiment Analysis
const analyzeSentiment = async (text) => {
  try {
    const response = await axios.post('http://localhost:11434/api/chat', {
      model: 'llama3',
      messages: [
        {
          role: 'system',
          content: `You are a sentiment analyzer. 
          Analyze the given review text.
          Reply with ONLY one word: Positive, Negative, or Neutral.
          No explanation. No punctuation. Just one word.`
        },
        {
          role: 'user',
          content: `Analyze this review: "${text}"`
        }
      ],
      stream: false
    });

    const result = response.data.message.content.trim();

    if (result.includes('Positive')) return 'Positive';
    if (result.includes('Negative')) return 'Negative';
    return 'Neutral';

  } catch (error) {
    console.error('Sentiment error:', error.message);
    return 'Neutral';
  }
};

// POST /api/reviews — Submit Review
router.post('/', async (req, res) => {
  try {
    const { productId, userId, userName, rating, comment } = req.body;

    // Get sentiment from Ollama
    const sentiment = await analyzeSentiment(comment);

    const review = new Review({
      productId,
      userId,
      userName,
      rating,
      comment,
      sentiment
    });

    await review.save();

    res.json({ review, success: true });

  } catch (error) {
    console.error('Review submit error:', error);
    res.status(500).json({ 
      error: 'Failed to submit review', 
      success: false 
    });
  }
});

// GET /api/reviews/:productId — Get All Reviews
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ 
      productId: req.params.productId 
    }).sort({ createdAt: -1 });

    res.json({ reviews, success: true });

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get reviews', 
      success: false 
    });
  }
});

module.exports = router;