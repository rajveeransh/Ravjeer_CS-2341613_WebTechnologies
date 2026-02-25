/**
 * server.js – Rupkala Express Application Entry Point
 *
 * This file bootstraps the entire Express server:
 * - Loads environment variables
 * - Connects to MongoDB
 * - Registers global middleware
 * - Mounts all route modules
 * - Starts the HTTP listener
 */

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');

// Route modules
const authRoutes    = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes   = require('./routes/orderRoutes');
const designRoutes  = require('./routes/designRoutes');
const adminRoutes   = require('./routes/adminRoutes');

// ── Load .env ──────────────────────────────────────────
dotenv.config();

// ── Connect to MongoDB ─────────────────────────────────
connectDB();

// ── Initialise Express App ─────────────────────────────
const app = express();

// ── Global Middleware ──────────────────────────────────

// Allow cross-origin requests from the React dev server
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Parse incoming JSON bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// HTTP request logger (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded files (design images, custom uploads) as static assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ─────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/designs',  designRoutes);
app.use('/api/admin',    adminRoutes);

// ── Root Health Check ──────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎨 Rupkala API is running. Wear your story.',
    version: '1.0.0',
  });
});

// ── 404 Handler ────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  });
});

// ── Global Error Handler ───────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

// ── Start Listening ────────────────────────────────────
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`\n🚀 Rupkala server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`   Local: http://localhost:${PORT}\n`);
});
