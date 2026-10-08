const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');
const { mockStore } = require('../store/mockStore');

// @route   GET /api/budgets
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { month, year } = req.query;

    const currentMonth = Number(month) || 10;
    const currentYear = Number(year) || 2026;

    if (mongoose.connection.readyState === 1) {
      const budgets = await Budget.find({
        user_id: userId,
        month: currentMonth,
        year: currentYear
      });

      // Compute actual spent for each budget category in this month
      const start = new Date(currentYear, currentMonth - 1, 1);
      const end = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

      const expenseTransactions = await Transaction.find({
        user_id: userId,
        type: 'expense',
        transaction_date: { $gte: start, $lte: end }
      });

      const categorySpentMap = {};
      expenseTransactions.forEach(t => {
        const cat = t.category;
        categorySpentMap[cat] = (categorySpentMap[cat] || 0) + Number(t.amount);
      });

      const budgetsWithProgress = budgets.map(b => {
        const spent = categorySpentMap[b.category] || 0;
        const remaining = b.amount - spent;
        const percentage = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;
        return {
          ...b.toObject(),
          spent,
          remaining,
          percentage
        };
      });

      return res.json({ success: true, count: budgetsWithProgress.length, data: budgetsWithProgress });
    } else {
      const budgets = mockStore.budgets.filter(b =>
        String(b.user_id) === String(userId) &&
        b.month === currentMonth &&
        b.year === currentYear
      );

      const categorySpentMap = {};
      mockStore.transactions.forEach(t => {
        if (String(t.user_id) === String(userId) && t.type === 'expense') {
          const d = new Date(t.transaction_date);
          if (d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear) {
            categorySpentMap[t.category] = (categorySpentMap[t.category] || 0) + Number(t.amount);
          }
        }
      });

      const budgetsWithProgress = budgets.map(b => {
        const spent = categorySpentMap[b.category] || 0;
        const remaining = b.amount - spent;
        const percentage = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;
        return {
          ...b,
          spent,
          remaining,
          percentage
        };
      });

      return res.json({ success: true, count: budgetsWithProgress.length, data: budgetsWithProgress });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/budgets
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { category, month, year, amount, category_id } = req.body;

    if (!category || !month || !year || amount === undefined) {
      return res.status(400).json({ success: false, message: 'Category, month, year, and amount are required' });
    }

    if (mongoose.connection.readyState === 1) {
      let budget = null;
      if (req.body._id || req.body.id) {
        budget = await Budget.findOne({ _id: req.body._id || req.body.id, user_id: userId });
      }
      if (!budget) {
        budget = await Budget.findOne({
          user_id: userId,
          category: category.trim(),
          month: Number(month),
          year: Number(year)
        });
      }

      if (budget) {
        budget.amount = Number(amount);
        if (category) budget.category = category.trim();
        budget.month = Number(month);
        budget.year = Number(year);
        await budget.save();
        return res.json({ success: true, message: 'Budget updated', data: budget });
      }

      budget = new Budget({
        user_id: userId,
        category: category.trim(),
        category_id: category_id || null,
        month: Number(month),
        year: Number(year),
        amount: Number(amount)
      });

      await budget.save();
      return res.status(201).json({ success: true, message: 'Budget set successfully', data: budget });
    } else {
      let idx = -1;
      if (req.body._id || req.body.id) {
        idx = mockStore.budgets.findIndex(b => (b._id === (req.body._id || req.body.id) || b.id === (req.body._id || req.body.id)) && String(b.user_id) === String(userId));
      }
      if (idx === -1) {
        idx = mockStore.budgets.findIndex(b =>
          String(b.user_id) === String(userId) &&
          b.category.toLowerCase() === category.trim().toLowerCase() &&
          b.month === Number(month) &&
          b.year === Number(year)
        );
      }

      if (idx !== -1) {
        mockStore.budgets[idx].amount = Number(amount);
        if (category) mockStore.budgets[idx].category = category.trim();
        return res.json({ success: true, message: 'Budget updated', data: mockStore.budgets[idx] });
      }

      const newBudget = {
        _id: `b-${Date.now()}`,
        id: `b-${Date.now()}`,
        user_id: userId,
        category: category.trim(),
        month: Number(month),
        year: Number(year),
        amount: Number(amount),
        created_at: new Date()
      };
      mockStore.budgets.push(newBudget);
      return res.status(201).json({ success: true, message: 'Budget set successfully', data: newBudget });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/budgets/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { amount, category, month, year } = req.body;

    if (mongoose.connection.readyState === 1) {
      let budget = null;
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        budget = await Budget.findOne({ _id: req.params.id, user_id: userId });
      }
      if (!budget && category && month && year) {
        budget = await Budget.findOne({
          user_id: userId,
          category: category.trim(),
          month: Number(month),
          year: Number(year)
        });
      }
      if (!budget) return res.status(404).json({ success: false, message: 'Budget not found' });

      if (amount !== undefined) budget.amount = Number(amount);
      if (category) budget.category = category.trim();
      if (month !== undefined) budget.month = Number(month);
      if (year !== undefined) budget.year = Number(year);
      await budget.save();
      return res.json({ success: true, message: 'Budget updated', data: budget });
    } else {
      const idx = mockStore.budgets.findIndex(b => (b._id === req.params.id || b.id === req.params.id) && String(b.user_id) === String(userId));
      if (idx === -1) return res.status(404).json({ success: false, message: 'Budget not found' });

      if (amount !== undefined) mockStore.budgets[idx].amount = Number(amount);
      if (category) mockStore.budgets[idx].category = category.trim();
      if (month !== undefined) mockStore.budgets[idx].month = Number(month);
      if (year !== undefined) mockStore.budgets[idx].year = Number(year);
      return res.json({ success: true, message: 'Budget updated', data: mockStore.budgets[idx] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/budgets/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ success: false, message: 'Budget not found' });
      }

      const result = await Budget.findOneAndDelete({ _id: req.params.id, user_id: userId });
      if (!result) return res.status(404).json({ success: false, message: 'Budget not found' });
      return res.json({ success: true, message: 'Budget deleted' });
    } else {
      const initial = mockStore.budgets.length;
      mockStore.budgets = mockStore.budgets.filter(b => !((b._id === req.params.id || b.id === req.params.id) && String(b.user_id) === String(userId)));
      if (mockStore.budgets.length === initial) return res.status(404).json({ success: false, message: 'Budget not found' });
      return res.json({ success: true, message: 'Budget deleted' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
