const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  userId: { 
    type: String, 
    default: 'guest'
  },
  userName: { type: String, required: true },
  rating:   { type: Number, required: true, min: 1, max: 5 },
  comment:  { type: String, required: true },
  sentiment: { 
    type: String, 
    enum: ['Positive', 'Negative', 'Neutral'], 
    default: 'Neutral' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);