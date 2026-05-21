const express = require("express");
const router = express.Router();

const Order = require("../models/Order");

const authMiddleware = require("../middleware/authMiddleware");

// 📦 CREATE ORDER
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const {
      orderItems,
      totalPrice,
      paymentMethod,
    } = req.body;

    const order = await Order.create({
      user: req.user.id,
      orderItems,
      totalPrice,
      paymentMethod,
    });

    res.status(201).json(order);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// 📦 MY ORDERS
router.get("/myorders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    }).populate("orderItems.product");

    res.json(orders);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;