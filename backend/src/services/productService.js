const Product = require("../models/Product");

const fetchProducts = async () => {
  return await Product.find();
};

const validateAndUpdateStock = async (cart) => {
  const errors = [];
  console.log("cart", cart);
  for (const item of cart) {
    console.log("item", item);

    const product = await Product.findOne({ _id: item._id });
    console.log("product", product);

    if (!product || product.stock < item.quantity) {
      errors.push(item.id);
      continue;
    }
    product.stock -= item.quantity;
    await product.save();
  }

  if (errors.length > 0) {
    throw { error: true, items: errors };
  }
  // Emit stock update event to all clients
  const updatedProducts = await Product.find();
  io.emit("stock-updated", updatedProducts);
};

module.exports = { fetchProducts, validateAndUpdateStock };
