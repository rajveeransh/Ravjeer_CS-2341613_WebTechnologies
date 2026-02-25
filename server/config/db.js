/**
 * config/db.js – MongoDB Connection via Mongoose
 *
 * Establishes a persistent connection to the MongoDB database.
 * Uses environment variable MONGO_URI for the connection string,
 * which keeps credentials out of source code.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options suppress deprecation warnings in Mongoose 7+
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    // Exit the process so the server doesn't run without a database
    process.exit(1);
  }
};

module.exports = connectDB;
