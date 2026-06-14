require("dotenv").config();
process.env.JWT_SECRET = process.env.JWT_SECRET || "emaan123secretkey";

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const userRoutes = require("./routes/userRoutes");
const aiRoutes = require("./routes/ai");

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow localhost and any vercel.app URL
      if (
        !origin ||
        origin.includes("localhost") ||
        origin.includes("vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.json({ message: "API Running 🚀" }));
app.use("/api/auth", authRoutes);

// ── DB ──
connectDB();

// ── Routes ──
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);

// ── Test Route ──
app.get("/", (req, res) => {
  res.json({ message: "Ahnaf Enterprises API Running! 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});