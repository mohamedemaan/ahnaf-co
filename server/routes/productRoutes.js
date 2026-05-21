import express from "express";
import { createProduct } from "../controllers/productController.js";

const router = express.Router();
app.use(express.json());

router.post("/create", createProduct);

export default router;