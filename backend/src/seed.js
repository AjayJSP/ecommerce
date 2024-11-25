const mongoose = require("mongoose");
const connectDB = require("./utils/db");
const Product = require("./models/Product");

const seedProducts = async () => {
  await connectDB();
  await Product.deleteMany();

  const products = [
    { name: "Product 1", description: "Description 1", price: 10.99, stock: 10 },
    { name: "Product 2", description: "Description 2", price: 15.49, stock: 5 },
    { name: "Product 3", description: "Description 3", price: 20.0, stock: 8 },
  ];

  await Product.insertMany(products);
  console.log("Database seeded successfully");
  process.exit();
};

seedProducts();
