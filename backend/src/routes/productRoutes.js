const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

// Fetch all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

module.exports = router;
