const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

const createCartRouter = (io) => {
  router.post("/checkout", async (req, res) => {
    const cart = req.body; // [{ _id, quantity }]
    try {
      const updatedProducts = [];

      for (const item of cart) {
        const product = await Product.findById(item._id);
        if (!product) {
          return res.status(404).json({ message: `Product not found` });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
        }

        product.stock -= item.quantity;
        await product.save();
        updatedProducts.push(product);
      }

      updatedProducts.forEach((updatedProduct) => {
        io.emit("stockUpdated", updatedProduct);
      });

      res.status(200).json({ message: "Checkout successful" });
    } catch (error) {
      res.status(500).json({ message: "Error during checkout" });
    }
  });

  return router;
};

module.exports = createCartRouter;
