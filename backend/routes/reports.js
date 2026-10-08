const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Salary = require('../models/Salary');
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');
const { mockStore } = require('../store/mockStore');

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// @route   GET /api/reports/compare
// Compares two months (e.g., monthA=9&yearA=2026 vs monthB=10&yearB=2026)
router.get('/compare', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const monthA = Number(req.query.monthA) || 9;
    const yearA = Number(req.query.yearA) || 2026;
    const monthB = Number(req.query.monthB) || 10;
    const yearB = Number(req.query.yearB) || 2026;

    let salaryA = 0;
    let salaryB = 0;
    let expensesA = 0;
    let expensesB = 0;

    if (mongoose.connection.readyState === 1) {
      const salA = await Salary.findOne({ user_id: userId, month: monthA, year: yearA });
      if (salA) salaryA = salA.net_salary !== undefined ? salA.net_salary : salA.base_salary;

      const salB = await Salary.findOne({ user_id: userId, month: monthB, year: yearB });
      if (salB) salaryB = salB.net_salary !== undefined ? salB.net_salary : salB.base_salary;

      const startA = new Date(yearA, monthA - 1, 1);
      const endA = new Date(yearA, monthA, 0, 23, 59, 59, 999);
      const txA = await Transaction.find({ user_id: userId, type: 'expense', transaction_date: { $gte: startA, $lte: endA } });
      expensesA = txA.reduce((sum, t) => sum + Number(t.amount), 0);

      const startB = new Date(yearB, monthB - 1, 1);
      const endB = new Date(yearB, monthB, 0, 23, 59, 59, 999);
      const txB = await Transaction.find({ user_id: userId, type: 'expense', transaction_date: { $gte: startB, $lte: endB } });
      expensesB = txB.reduce((sum, t) => sum + Number(t.amount), 0);
    } else {
      const salA = mockStore.salaries.find(s => String(s.user_id) === String(userId) && s.month === monthA && s.year === yearA);
      if (salA) salaryA = salA.net_salary || salA.base_salary;

      const salB = mockStore.salaries.find(s => String(s.user_id) === String(userId) && s.month === monthB && s.year === yearB);
      if (salB) salaryB = salB.net_salary || salB.base_salary;

      const txA = mockStore.transactions.filter(t => {
        if (String(t.user_id) !== String(userId) || t.type !== 'expense') return false;
        const d = new Date(t.transaction_date);
        return (d.getMonth() + 1) === monthA && d.getFullYear() === yearA;
      });
      expensesA = txA.reduce((sum, t) => sum + Number(t.amount), 0);

      const txB = mockStore.transactions.filter(t => {
        if (String(t.user_id) !== String(userId) || t.type !== 'expense') return false;
        const d = new Date(t.transaction_date);
        return (d.getMonth() + 1) === monthB && d.getFullYear() === yearB;
      });
      expensesB = txB.reduce((sum, t) => sum + Number(t.amount), 0);
    }

    const savingsA = salaryA - expensesA;
    const savingsB = salaryB - expensesB;

    const salaryChangePct = salaryA > 0 ? (((salaryB - salaryA) / salaryA) * 100).toFixed(1) : 0;
    const expenseChangePct = expensesA > 0 ? (((expensesB - expensesA) / expensesA) * 100).toFixed(1) : 0;
    const savingsChangePct = savingsA !== 0 ? (((savingsB - savingsA) / Math.abs(savingsA)) * 100).toFixed(1) : 0;

    return res.json({
      success: true,
      periodA: { label: `${MONTH_NAMES[monthA - 1]} ${yearA}`, month: monthA, year: yearA },
      periodB: { label: `${MONTH_NAMES[monthB - 1]} ${yearB}`, month: monthB, year: yearB },
      metrics: {
        salary: {
          periodA: salaryA,
          periodB: salaryB,
          change: Number(salaryChangePct),
          isPositive: Number(salaryChangePct) >= 0
        },
        expenses: {
          periodA: expensesA,
          periodB: expensesB,
          change: Number(expenseChangePct),
          isPositive: Number(expenseChangePct) <= 0 // Lower expenses is positive
        },
        savings: {
          periodA: savingsA,
          periodB: savingsB,
          change: Number(savingsChangePct),
          isPositive: Number(savingsChangePct) >= 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/reports/export-csv
router.get('/export-csv', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { month, year } = req.query;

    let transactions = [];
    if (mongoose.connection.readyState === 1) {
      let query = { user_id: userId };
      if (month && year) {
        const start = new Date(Number(year), Number(month) - 1, 1);
        const end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
        query.transaction_date = { $gte: start, $lte: end };
      }
      transactions = await Transaction.find(query).sort({ transaction_date: -1 });
    } else {
      transactions = mockStore.transactions.filter(t => String(t.user_id) === String(userId));
      if (month && year) {
        transactions = transactions.filter(t => {
          const d = new Date(t.transaction_date);
          return (d.getMonth() + 1) === Number(month) && d.getFullYear() === Number(year);
        });
      }
      transactions.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
    }

    let csv = 'ID,Date,Title,Type,Category,Payment Method,Amount,Account,Description,Notes\n';
    transactions.forEach(t => {
      const dateStr = new Date(t.transaction_date).toISOString().split('T')[0];
      const row = [
        `"${t._id || t.id}"`,
        `"${dateStr}"`,
        `"${(t.title || '').replace(/"/g, '""')}"`,
        `"${t.type || 'expense'}"`,
        `"${t.category || 'Other'}"`,
        `"${t.payment_method || 'UPI'}"`,
        `${t.amount}`,
        `"${(t.account || '').replace(/"/g, '""')}"`,
        `"${(t.description || '').replace(/"/g, '""')}"`,
        `"${(t.notes || '').replace(/"/g, '""')}"`
      ].join(',');
      csv += row + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=salary-tracker-transactions-${year || 2026}-${month || 10}.csv`);
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
