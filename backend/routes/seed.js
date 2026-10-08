const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Salary = require('../models/Salary');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const Budget = require('../models/Budget');
const { mockStore, defaultCategories } = require('../store/mockStore');

// @route   POST /api/seed
// Seeds demo data into MongoDB or resets fallback store
router.post('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      // Create or update admin user
      let admin = await User.findOne({ email: 'admin@salarytracker.com' });
      if (!admin) {
        const hash = await bcrypt.hash('admin123', 10);
        admin = new User({
          name: 'Admin User',
          email: 'admin@salarytracker.com',
          password: hash,
          phone: '+91 98765 43210',
          currency: '₹',
          savings_target: 25000,
          role: 'admin'
        });
        await admin.save();
      }

      // Categories
      await Category.deleteMany({});
      await Category.insertMany(defaultCategories.map(c => ({
        name: c.name,
        icon: c.icon,
        type: c.type,
        color: c.color,
        is_default: true,
        subcategories: c.subcategories || []
      })));

      // Clear & Seed Salaries
      await Salary.deleteMany({ user_id: admin._id });
      await Salary.insertMany(mockStore.salaries.map(s => ({
        user_id: admin._id,
        month: s.month,
        year: s.year,
        base_salary: s.base_salary,
        bonus: s.bonus,
        commission: s.commission,
        other_income: s.other_income,
        tax: s.tax,
        deductions: s.deductions,
        net_salary: s.net_salary,
        payment_date: new Date(s.payment_date),
        notes: s.notes
      })));

      // Clear & Seed Budgets
      await Budget.deleteMany({ user_id: admin._id });
      await Budget.insertMany(mockStore.budgets.map(b => ({
        user_id: admin._id,
        category: b.category,
        month: b.month,
        year: b.year,
        amount: b.amount
      })));

      // Clear & Seed Transactions
      await Transaction.deleteMany({ user_id: admin._id });
      await Transaction.insertMany(mockStore.transactions.map(t => ({
        user_id: admin._id,
        title: t.title,
        description: t.description || '',
        amount: t.amount,
        type: t.type,
        category: t.category,
        payment_method: t.payment_method,
        transaction_date: new Date(t.transaction_date),
        notes: t.notes || '',
        account: t.account || 'Primary Account',
        location: t.location || ''
      })));

      return res.json({
        success: true,
        message: 'Successfully seeded PRD October 2026 data into MongoDB!',
        adminEmail: 'admin@salarytracker.com',
        adminPassword: 'admin123'
      });
    } else {
      return res.json({
        success: true,
        message: 'In-memory fallback store is already populated with PRD October 2026 data!',
        adminEmail: 'admin@salarytracker.com',
        adminPassword: 'admin123'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
