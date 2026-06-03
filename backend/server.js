const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

const normalizeOrigin = (value) => {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    return new URL(trimmed).origin;
  } catch {
    return trimmed.replace(/\/$/, '');
  }
};

const isTrustedHostedOrigin = (origin) => {
  try {
    const { hostname } = new URL(origin);
    return (
      hostname.endsWith('.vercel.app') ||
      hostname.endsWith('.netlify.app') ||
      hostname.endsWith('.github.io')
    );
  } catch {
    return false;
  }
};

const parseAllowedOrigins = () => {
  const rawOrigins = [
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGIN,
  ]
    .filter(Boolean)
    .flatMap((value) => value.split(','));

  const defaults = ['http://localhost:5173', 'http://localhost:3000'];
  return [...new Set([...rawOrigins, ...defaults].map(normalizeOrigin).filter(Boolean))];
};

const allowedOrigins = parseAllowedOrigins();

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow local development and any explicitly configured production origins.
      if (
        !origin ||
        allowedOrigins.includes(normalizeOrigin(origin)) ||
        isTrustedHostedOrigin(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Base route for testing
app.get('/', (req, res) => {
  res.send('VibeConnect API is running successfully!');
});

// Error handling middleware for Multer or general server issues
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error occurred.'
  });
});

// Database Connection & Server Startup
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not configured. Set it in the environment.');
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB database connection error:', err);
  });
