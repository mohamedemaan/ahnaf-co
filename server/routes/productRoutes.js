const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  createProduct,
  getProducts,
  deleteProduct,
} = require("../controllers/productController");

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

router.post(
  "/add",
  upload.array("images", 10),
  createProduct
);

router.delete(
  "/:id",
  deleteProduct
);

module.exports = router;