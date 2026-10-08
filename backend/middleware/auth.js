const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { mockStore } = require('../store/mockStore');

const JWT_SECRET = process.env.JWT_SECRET || 'salary_tracker_crm_jwt_secret_token_2026_secure';

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log(`\x1b[31m[AUTH FAILURE]\x1b[0m Access denied: No Bearer token provided on ${req.method} ${req.originalUrl}`);
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);

    let user = null;

    // 1. Try finding in MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      if (mongoose.isValidObjectId(decoded.id)) {
        user = await User.findById(decoded.id).select('-password');
      }
      if (!user && decoded.email) {
        user = await User.findOne({ email: decoded.email.toLowerCase().trim() }).select('-password');
      }
    }

    // 2. If MongoDB is connecting (readyState === 2), wait briefly and retry
    if (!user && mongoose.connection.readyState === 2) {
      await new Promise(resolve => setTimeout(resolve, 300));
      if (mongoose.connection.readyState === 1) {
        if (mongoose.isValidObjectId(decoded.id)) {
          user = await User.findById(decoded.id).select('-password');
        }
        if (!user && decoded.email) {
          user = await User.findOne({ email: decoded.email.toLowerCase().trim() }).select('-password');
        }
      }
    }

    // 3. Fallback to mockStore
    if (!user) {
      const mockUser = mockStore.users.find(u => 
        (u._id === decoded.id || u.id === decoded.id || (decoded.email && u.email === decoded.email.toLowerCase().trim()))
      );
      if (mockUser) {
        const { password, ...userWithoutPassword } = mockUser;
        user = userWithoutPassword;
      }
    }

    if (!user) {
      console.log(`\x1b[31m[AUTH FAILURE]\x1b[0m Access denied: User not found for token on ${req.method} ${req.originalUrl}`);
      return res.status(401).json({ success: false, message: 'User session invalid.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(`\x1b[31m[AUTH FAILURE]\x1b[0m Access denied: Invalid or expired token on ${req.method} ${req.originalUrl} - ${error.message}`);
    return res.status(401).json({ success: false, message: 'Token is invalid or expired.', error: error.message });
  }
};

module.exports = { auth, JWT_SECRET };
