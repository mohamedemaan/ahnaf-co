const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title:         { type: String, required: true },
  category:      { type: String, required: true },
  subcategory:   { type: String, default: ''    },
  productType:   { type: String, default: ''    },
  sku:           { type: String, default: ''    },
  attributes:    { type: Object, default: {}    },
  price:         { type: Number, required: true },
  originalPrice: { type: Number, default: 0     },
  stock:         { type: Number, default: 0     },
  description:   { type: String, default: ''    },
  images:        { type: [String], default: []  },
  colors:        { type: [String], default: []  },
  sizes:         { type: [String], default: []  },
  offers:        { type: [String], default: []  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);