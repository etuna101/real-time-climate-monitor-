require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Import routes
const climateRoutes = require('./routes/climateRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database connection (optional - app will work without MongoDB for demo purposes)
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/climate-dashboard')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => {
    console.warn('⚠️  MongoDB connection failed. Running in demo mode without database.');
    console.warn('   To enable database features, ensure MongoDB is running or use MongoDB Atlas.');
    console.warn('   Error:', err.message);
  });

// API Routes
app.use('/api/climate', climateRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
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
