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

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        console.log(`\x1b[31m[AUTH FAILURE]\x1b[0m Access denied: User not found for token ID on ${req.method} ${req.originalUrl}`);
        return res.status(401).json({ success: false, message: 'User not found.' });
      }
      req.user = user;
    } else {
      const user = mockStore.users.find(u => (u._id === decoded.id || u.id === decoded.id));
      if (!user) {
        console.log(`\x1b[31m[AUTH FAILURE]\x1b[0m Access denied (mockStore): User session invalid on ${req.method} ${req.originalUrl}`);
        return res.status(401).json({ success: false, message: 'User session invalid.' });
      }
      const { password, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;
    }

    next();
  } catch (error) {
    console.log(`\x1b[31m[AUTH FAILURE]\x1b[0m Access denied: Invalid or expired token on ${req.method} ${req.originalUrl} - ${error.message}`);
    return res.status(401).json({ success: false, message: 'Token is invalid or expired.', error: error.message });
  }
};

module.exports = { auth, JWT_SECRET };
