const mongoose = require('mongoose');

function isDbReady() {
  return mongoose.connection.readyState === 1;
}

async function connectMongo(uri) {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (err) {
    console.warn('⚠️  MongoDB unavailable. Running with in-memory storage.');
    console.warn('   Set MONGODB_URI to persist users and historical series.');
    console.warn('   Reason:', err.message);
    return false;
  }
}

module.exports = { isDbReady, connectMongo };
