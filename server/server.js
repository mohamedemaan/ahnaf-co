import express from "express";
import productRoutes from "./routes/productRoutes.js";

const app = express();

app.use(express.json());

// ⚠️ THIS LINE MUST BE EXACT
app.use("/product", productRoutes);

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

const app = express();

const cartRoutes = require("./routes/cart");
app.use("/api/cart", cartRoutes);

const orderRoutes = require("./routes/order");
app.use("/api/orders", orderRoutes);

// middleware
app.use(express.json());
app.use(cors());

// routes connect
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("DB Error:", err);
  });

// server start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});