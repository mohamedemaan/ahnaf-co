const express        = require("express");
const router         = express.Router();
const Order = require("../models/order");
const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");

// ── USER: Create order  POST /api/orders/create ──────────────────────────────
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, address } = req.body;

    // Support legacy key names from older front-end versions too
    let orderItems = items || req.body.orderItems || [];
    
    // Map product to productId if frontend sends it as product
    orderItems = orderItems.map(item => ({
      productId: item.productId || item.product,
      quantity: item.quantity
    }));

    const orderAmount = totalAmount || req.body.totalPrice  || 0;

    const order = await Order.create({
      userId:        req.user.id,   // Admin.jsx reads o.userId.name — must be "userId"
      items:         orderItems,
      totalAmount:   orderAmount,
      paymentMethod: paymentMethod || "COD",
      address:       address       || {},
      status:        "pending",
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── USER: My orders  GET /api/orders/myorders ────────────────────────────────
router.get("/myorders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("items.productId")   // adjust field name to match your Order model
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ADMIN: All orders  GET /api/orders ───────────────────────────────────────
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")  // Admin.jsx: o.userId.name / o.userId.email
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ADMIN: Update status  PUT /api/orders/:id ────────────────────────────────
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;