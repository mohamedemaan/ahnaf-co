const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const upload = require("../middleware/upload");

const {
  createProduct,
  getProducts,
  deleteProduct,
} = require("../controllers/productController");

// GET ALL PRODUCTS
router.get("/", getProducts);

// GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// CREATE PRODUCT
router.post(
  "/add",
  upload.single("image"),
  createProduct
);

// DELETE PRODUCT
router.delete("/:id", deleteProduct);

module.exports = router;