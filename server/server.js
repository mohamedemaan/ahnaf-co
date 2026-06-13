require("dotenv").config();
const express    = require("express");
const mongoose   = require("mongoose");
const cors       = require("cors");

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
const productRoutes = require("./routes/product");   // GET/ POST/ PUT/:id DELETE/:id /bulk
const orderRoutes   = require("./routes/order");     // /create /myorders / /:id
const authRoutes    = require("./routes/auth");      // /send-otp /register /login
const aiRoutes      = require("./routes/ai");        // /chat /description /recommendations /sentiment
const chatbotRoutes = require("./routes/chatbot");   // /message
const adminRoutes   = require("./routes/admin");     // /users  /users/:id
const cartRoutes    = require("./routes/cart");      // (unchanged)
const adminAuthRoutes = require("./routes/adminAuth");

app.use("/api/products", productRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/auth",     authRoutes);
app.use("/api/ai",       aiRoutes);
app.use("/api/chatbot",  chatbotRoutes);
app.use("/api/admin",    adminRoutes);
app.use("/api/cart",     cartRoutes);
app.use("/api/admin-auth", adminAuthRoutes);

// ── DB + Start ────────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB error:", err));