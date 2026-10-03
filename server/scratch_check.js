const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const p = await Product.findOne().sort({ createdAt: -1 });
  console.log(JSON.stringify(p, null, 2));
  process.exit(0);
}
check();
