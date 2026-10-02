const Product = require("../models/Product");

// ── CREATE (supports both JSON body URLs and file upload) ──
exports.createProduct = async (req, res) => {
  try {
    let images = [];

    if (req.file) {
      images = [req.file.path];
    } else if (req.body.images) {
      images = Array.isArray(req.body.images)
        ? req.body.images
        : req.body.images
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }

    const product = await Product.create({
      title:         req.body.title,
      description:   req.body.description,
      category:      req.body.category,
      price:         Number(req.body.price)         || 0,
      originalPrice: Number(req.body.originalPrice) || 0,
      stock:         Number(req.body.stock)         || 0,
      images: images,
      colors: Array.isArray(req.body.colors)
        ? req.body.colors
        : (req.body.colors || "").split(",").map((s) => s.trim()).filter(Boolean),
      sizes: Array.isArray(req.body.sizes)
        ? req.body.sizes
        : (req.body.sizes || "").split(",").map((s) => s.trim()).filter(Boolean),
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("createProduct error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ── GET ALL ──
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── UPDATE ──
exports.updateProduct = async (req, res) => {
  try {
    // Normalise arrays if they come in as comma strings
    const update = { ...req.body };

    if (req.file) {
      update.images = [req.file.path]; // Replace with new image if uploaded
    } else if (req.body.images && !Array.isArray(req.body.images)) {
      update.images = req.body.images
        .split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (req.body.colors && !Array.isArray(req.body.colors)) {
      update.colors = req.body.colors
        .split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (req.body.sizes && !Array.isArray(req.body.sizes)) {
      update.sizes = req.body.sizes
        .split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (req.body.price)         update.price         = Number(req.body.price);
    if (req.body.originalPrice) update.originalPrice = Number(req.body.originalPrice);
    if (req.body.stock)         update.stock         = Number(req.body.stock);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("updateProduct error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE ──
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── BULK DELETE ──
exports.bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Provide an array of product IDs to delete" });
    }
    
    await Product.deleteMany({ _id: { $in: ids } });
    res.json({ message: "Products deleted successfully", count: ids.length });
  } catch (err) {
    console.error("bulkDeleteProducts error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ── BULK IMPORT (CSV) ──
exports.bulkCreateProducts = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Provide a non-empty products array" });
    }

    // Sanitise each row coming from the CSV parser
    const sanitised = products.map((p) => ({
      title:         p.title         || "Untitled",
      description:   p.description   || "",
      price:         Number(p.price) || 0,
      originalPrice: Number(p.originalPrice) || 0,
      category:      p.category      || "General",
      stock:         Number(p.stock) || 0,
      images:  Array.isArray(p.images) ? p.images
               : (p.images || "").split("|").map((s) => s.trim()).filter(Boolean),
      colors:  Array.isArray(p.colors) ? p.colors
               : (p.colors || "").split(",").map((s) => s.trim()).filter(Boolean),
      sizes:   Array.isArray(p.sizes)  ? p.sizes
               : (p.sizes  || "").split(",").map((s) => s.trim()).filter(Boolean),
    }));

    // ordered: false → continues even if one document fails validation
    const inserted = await Product.insertMany(sanitised, { ordered: false });
    res.status(201).json({ count: inserted.length });
  } catch (err) {
    console.error("bulkCreateProducts error:", err);
    // insertMany with ordered:false throws but still inserts valid docs
    const inserted = err.insertedDocs || [];
    res.status(207).json({
      error:   "Some products failed validation",
      count:   inserted.length,
      details: err.message,
    });
  }
};