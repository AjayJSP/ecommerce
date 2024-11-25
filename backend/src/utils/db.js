const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://ajaydevkarinfo:Shx2yPB3ztLD52Vx@ajayinfo.lagcv.mongodb.net/ecommerce-dev?retryWrites=true&w=majority&appName=ajayinfo"
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
