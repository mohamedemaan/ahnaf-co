import { v4 as uuidv4 } from "uuid";

// Fake database (temporary)
let products = [];

// CREATE PRODUCT
export const createProduct = (req, res) => {

    const productId = uuidv4(); // 🔥 unique ID create

    const product = {
        id: productId,
        name: req.body.name,
        price: req.body.price
    };

    products.push(product);

    console.log("Product ID:", productId);

    res.json({
        message: "Product created successfully",
        product
    });
};