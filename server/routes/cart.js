const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");

const authMiddleware = require("../middleware/authMiddleware");

// 🛒 ADD TO CART
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cartItem = await Cart.create({
      user: req.user.id,
      product: productId,
      quantity,
    });

    res.status(201).json(cartItem);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// 📦 GET USER CART
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cartItems = await Cart.find({
      user: req.user.id,
    }).populate("product");

    res.json(cartItems);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ❌ REMOVE FROM CART
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);

    res.json({
      message: "Item removed from cart",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;