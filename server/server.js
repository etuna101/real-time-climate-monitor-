require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const compression = require('compression');

// Import routes
const climateRoutes = require('./routes/climateRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Lightweight cache headers for GET endpoints
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
  }
  next();
});

// Database connection (REQUIRED for live demo)
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/climate-dashboard';
mongoose
  .connect(mongoUri)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection failed. The app requires MongoDB to run.');
    console.error('   Set MONGODB_URI and ensure the database is reachable.');
    console.error('   Error:', err.message);
    process.exit(1);
  });

// API Routes
app.use('/api/climate', climateRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Database health endpoint
app.get('/db-health', (req, res) => {
  const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  res.status(200).json({
    ok: state === 1,
    state,
    uri: process.env.NODE_ENV === 'development' ? mongoUri : undefined,
    timestamp: new Date(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
