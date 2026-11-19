const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const { connectMongo } = require('./utils/db');
const memoryStore = require('./utils/memoryStore');

const climateRoutes = require('./routes/climateRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(compression());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
  }
  next();
});

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/climate-dashboard';

app.use('/api/climate', climateRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api/user', userRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.get('/db-health', (req, res) => {
  const mongoose = require('mongoose');
  const state = mongoose.connection.readyState;
  res.status(200).json({
    ok: state === 1,
    state,
    mode: state === 1 ? 'mongo' : 'memory',
    timestamp: new Date(),
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {},
  });
});

async function start() {
  await connectMongo(mongoUri);
  await memoryStore.seedDemoUser();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Demo login: farmer@example.com / password');
  });
}

start();

module.exports = app;
