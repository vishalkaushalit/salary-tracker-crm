const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('username:password') || uri.includes('<username>')) {
    console.log('\n======================================================');
    console.log('⚠️ [MongoDB Status]: No custom MONGODB_URI configured in backend/.env');
    console.log('👉 Add your MongoDB connection string in backend/.env to persist data directly to MongoDB.');
    console.log('⚡ The Salary Tracker CRM is active using resilient fallback storage.');
    console.log('======================================================\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      dbName: 'salary-tracker'
    });
    isConnected = true;
    console.log(`\n✅ [MongoDB Connected]: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return true;
  } catch (error) {
    console.error(`\n❌ [MongoDB Connection Error]: ${error.message}`);
    console.log('⚡ Running in fallback mode. Update backend/.env when ready.');
    isConnected = false;
    return false;
  }
};

const getDbStatus = () => {
  const uri = process.env.MONGODB_URI;
  const isCustomUri = Boolean(uri && !uri.includes('username:password') && !uri.includes('<username>'));
  return {
    connected: isConnected || mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    dbName: mongoose.connection.name || 'salary-tracker',
    hasCustomUri: isCustomUri,
    uriMasked: uri ? uri.replace(/:([^:@]+)@/, ':****@') : null
  };
};

module.exports = { connectDB, getDbStatus };
