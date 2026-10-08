const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { auth, JWT_SECRET } = require('../middleware/auth');
const { mockStore } = require('../store/mockStore');
const { getDbStatus } = require('../config/db');

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, currency, savings_target } = req.body;

    if (!name || !email || !password) {
      console.log('\x1b[31m[AUTH FAILURE]\x1b[0m Registration failed: Missing name, email, or password.');
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      let existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        console.log(`\x1b[31m[AUTH FAILURE]\x1b[0m Registration failed: User already exists with email: ${normalizedEmail}`);
        return res.status(400).json({ success: false, message: 'User already exists with this email.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone || '',
        currency: currency || '₹',
        savings_target: Number(savings_target) || 25000,
        role: 'admin',
      });

      await user.save();

      // Initialize starter ₹30,000 monthly salary record
      try {
        const Salary = require('../models/Salary');
        const now = new Date();
        await Salary.create({
          user_id: user._id,
          month: 10,
          year: 2026,
          base_salary: 30000,
          bonus: 0,
          commission: 0,
          other_income: 0,
          tax: 0,
          deductions: 0,
          net_salary: 30000,
          payment_date: new Date('2026-10-01'),
          notes: 'Standard monthly salary'
        });
      } catch (salaryErr) {
        console.log('Starter salary note:', salaryErr.message);
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

      console.log(`\x1b[32m[AUTH SUCCESS]\x1b[0m Registered new user in MongoDB: ${user.name} (${user.email}) | ID: ${user._id}`);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          currency: user.currency,
          savings_target: user.savings_target,
          role: user.role
        }
      });
    } else {
      // Fallback in-memory
      const existing = mockStore.users.find(u => u.email === normalizedEmail);
      if (existing) {
        console.log(`\x1b[31m[AUTH FAILURE]\x1b[0m Registration failed (mockStore): User already exists with email: ${normalizedEmail}`);
        return res.status(400).json({ success: false, message: 'User already exists with this email.' });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = {
        _id: `user-${Date.now()}`,
        id: `user-${Date.now()}`,
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone || '',
        currency: currency || '₹',
        savings_target: Number(savings_target) || 25000,
        role: 'admin',
        created_at: new Date()
      };

      mockStore.users.push(newUser);
      const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '30d' });

      console.log(`\x1b[32m[AUTH SUCCESS]\x1b[0m Registered new user in MockStore: ${newUser.name} (${newUser.email}) | ID: ${newUser._id}`);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          currency: newUser.currency,
          savings_target: newUser.savings_target,
          role: newUser.role
        }
      });
    }
  } catch (error) {
    console.error(`\x1b[31m[AUTH FAILURE]\x1b[0m Server error during registration: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('\x1b[31m[AUTH FAILURE]\x1b[0m Login failed: Email and password are required.');
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        console.log(`\x1b[31m[AUTH FAILURE]\x1b[0m Login failed: No user found with email: ${normalizedEmail}`);
        return res.status(400).json({ success: false, message: 'Invalid credentials.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log(`\x1b[31m[AUTH FAILURE]\x1b[0m Login failed: Invalid password for email: ${normalizedEmail}`);
        return res.status(400).json({ success: false, message: 'Invalid credentials.' });
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

      console.log(`\x1b[32m[AUTH SUCCESS]\x1b[0m Login successful: ${user.name} (${user.email}) | ID: ${user._id}`);

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          currency: user.currency,
          savings_target: user.savings_target,
          role: user.role
        }
      });
    } else {
      const user = mockStore.users.find(u => u.email === normalizedEmail);
      if (!user) {
        console.log(`\x1b[31m[AUTH FAILURE]\x1b[0m Login failed (mockStore): No user found with email: ${normalizedEmail}`);
        return res.status(400).json({ success: false, message: 'Invalid credentials.' });
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        console.log(`\x1b[31m[AUTH FAILURE]\x1b[0m Login failed (mockStore): Invalid password for email: ${normalizedEmail}`);
        return res.status(400).json({ success: false, message: 'Invalid credentials.' });
      }

      const token = jwt.sign({ id: user._id || user.id }, JWT_SECRET, { expiresIn: '30d' });

      console.log(`\x1b[32m[AUTH SUCCESS]\x1b[0m Login successful (mockStore): ${user.name} (${user.email}) | ID: ${user._id || user.id}`);

      return res.json({
        success: true,
        token,
        user: {
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          currency: user.currency,
          savings_target: user.savings_target,
          role: user.role
        }
      });
    }
  } catch (error) {
    console.error(`\x1b[31m[AUTH FAILURE]\x1b[0m Server error during login: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
});

// @route   GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    console.log(`\x1b[32m[AUTH SUCCESS]\x1b[0m Verified session (/api/auth/me) for user: ${req.user.name} (${req.user.email}) | ID: ${req.user._id || req.user.id}`);
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error(`\x1b[31m[AUTH FAILURE]\x1b[0m /api/auth/me failed: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/auth/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, currency, savings_target, profile_image } = req.body;
    const userId = req.user._id || req.user.id;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(userId);
      if (!user) {
        console.log(`\x1b[31m[AUTH FAILURE]\x1b[0m Profile update failed: User not found with ID: ${userId}`);
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (name) user.name = name;
      if (phone !== undefined) user.phone = phone;
      if (currency) user.currency = currency;
      if (savings_target !== undefined) user.savings_target = Number(savings_target);
      if (profile_image !== undefined) user.profile_image = profile_image;

      await user.save();
      console.log(`\x1b[32m[AUTH SUCCESS]\x1b[0m Profile updated for user: ${user.name} (${user.email}) | ID: ${user._id}`);

      return res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          currency: user.currency,
          savings_target: user.savings_target,
          role: user.role
        }
      });
    } else {
      const user = mockStore.users.find(u => (u._id === userId || u.id === userId));
      if (!user) {
        console.log(`\x1b[31m[AUTH FAILURE]\x1b[0m Profile update failed (mockStore): User not found with ID: ${userId}`);
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (name) user.name = name;
      if (phone !== undefined) user.phone = phone;
      if (currency) user.currency = currency;
      if (savings_target !== undefined) user.savings_target = Number(savings_target);
      if (profile_image !== undefined) user.profile_image = profile_image;

      const { password, ...userSafe } = user;
      console.log(`\x1b[32m[AUTH SUCCESS]\x1b[0m Profile updated (mockStore) for user: ${user.name} (${user.email}) | ID: ${user._id || user.id}`);
      return res.json({ success: true, user: userSafe });
    }
  } catch (error) {
    console.error(`\x1b[31m[AUTH FAILURE]\x1b[0m Profile update error: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/auth/status
router.get('/status', (req, res) => {
  res.json({
    success: true,
    db: getDbStatus(),
    environment: process.env.NODE_ENV || 'development',
    time: new Date().toISOString()
  });
});

module.exports = router;
