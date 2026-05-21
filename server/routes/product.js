const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

const upload = require("../middleware/upload");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ➕ ADD PRODUCT
router.post(
  "/add",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 5),
  async (req, res) => {
    try {
      const { title, description, price, category, stock } = req.body;

      const imageUrls = req.files.map((file) => file.path);

      const product = await Product.create({
        title,
        description,
        price,
        category,
        stock,
        images: imageUrls,
        createdBy: req.user.id,
      });

      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// 📦 GET ALL PRODUCTS
// 📦 GET ALL PRODUCTS + SEARCH + FILTER
router.get("/", async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const category = req.query.category
      ? {
          category: req.query.category,
        }
      : {};

    const products = await Product.find({
      ...keyword,
      ...category,
    }).sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
// 🔍 GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ✏️ UPDATE PRODUCT
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { title, description, price, category, stock } = req.body;

      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      product.title = title || product.title;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.stock = stock || product.stock;

      const updatedProduct = await product.save();

      res.json(updatedProduct);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// ❌ DELETE PRODUCT
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);

      res.json({
        message: "Product deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

module.exports = router;