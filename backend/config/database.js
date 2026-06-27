// ./config/database.js
const mongoose = require("mongoose");
require("dotenv").config();

exports.connectDB = async () => {
  try {
    const mongoURL = process.env.MONGODB_URL;

    if (!mongoURL) {
      console.error("❌ MONGODB_URL is missing in .env");
      process.exit(1);
    }

    // Print the URL for debugging
    console.log("MongoDB URL:");
    console.log(mongoURL);

    await mongoose.connect(mongoURL);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB");
    console.error(error);
    process.exit(1);
  }
};