const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  bulkCreateProducts,
  bulkDeleteProducts,
} = require("../controllers/productController");

// BULK CREATE
router.post("/bulk-import", authMiddleware, adminMiddleware, bulkCreateProducts);

// BULK DELETE
router.post("/bulk-delete", authMiddleware, adminMiddleware, bulkDeleteProducts);

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
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  createProduct
);

// UPDATE PRODUCT
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), updateProduct);

// DELETE PRODUCT
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;