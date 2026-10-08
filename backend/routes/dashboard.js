const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Salary = require('../models/Salary');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { mockStore } = require('../store/mockStore');

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// @route   GET /api/dashboard/summary
router.get('/summary', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const month = Number(req.query.month) || 10;
    const year = Number(req.query.year) || 2026;

    let prevMonth = month - 1;
    let prevYear = year;
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear -= 1;
    }

    let currentSalary = null;
    let previousSalary = null;
    let transactions = [];
    let prevTransactions = [];
    let budgets = [];
    let userSavingsTarget = req.user.savings_target || 25000;

    if (mongoose.connection.readyState === 1) {
      currentSalary = await Salary.findOne({ user_id: userId, month, year });
      previousSalary = await Salary.findOne({ user_id: userId, month: prevMonth, year: prevYear });

      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59, 999);
      transactions = await Transaction.find({ user_id: userId, transaction_date: { $gte: start, $lte: end } });

      const pStart = new Date(prevYear, prevMonth - 1, 1);
      const pEnd = new Date(prevYear, prevMonth, 0, 23, 59, 59, 999);
      prevTransactions = await Transaction.find({ user_id: userId, transaction_date: { $gte: pStart, $lte: pEnd } });

      budgets = await Budget.find({ user_id: userId, month, year });
    } else {
      currentSalary = mockStore.salaries.find(s => String(s.user_id) === String(userId) && s.month === month && s.year === year);
      previousSalary = mockStore.salaries.find(s => String(s.user_id) === String(userId) && s.month === prevMonth && s.year === prevYear);

      transactions = mockStore.transactions.filter(t => {
        if (String(t.user_id) !== String(userId)) return false;
        const d = new Date(t.transaction_date);
        return (d.getMonth() + 1) === month && d.getFullYear() === year;
      });

      prevTransactions = mockStore.transactions.filter(t => {
        if (String(t.user_id) !== String(userId)) return false;
        const d = new Date(t.transaction_date);
        return (d.getMonth() + 1) === prevMonth && d.getFullYear() === prevYear;
      });

      budgets = mockStore.budgets.filter(b => String(b.user_id) === String(userId) && b.month === month && b.year === year);
    }

    const salaryAmount = currentSalary ? (currentSalary.net_salary !== undefined ? currentSalary.net_salary : currentSalary.base_salary) : 0;
    const prevSalaryAmount = previousSalary ? (previousSalary.net_salary !== undefined ? previousSalary.net_salary : previousSalary.base_salary) : 0;

    let totalExpenses = 0;
    let totalOtherIncome = 0;
    let largestExpense = { title: 'None', amount: 0, category: 'None' };
    const categoryTotals = {};

    transactions.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (t.type === 'expense') {
        totalExpenses += amt;
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amt;
        if (amt > largestExpense.amount) {
          largestExpense = { title: t.title, amount: amt, category: t.category, date: t.transaction_date };
        }
      } else if (t.type === 'income') {
        totalOtherIncome += amt;
      }
    });

    let prevExpenses = 0;
    prevTransactions.forEach(t => {
      if (t.type === 'expense') prevExpenses += Number(t.amount) || 0;
    });

    const totalIncome = salaryAmount + totalOtherIncome;
    const remainingBalance = totalIncome - totalExpenses;
    const savings = remainingBalance > 0 ? remainingBalance : 0;
    const savingsRate = totalIncome > 0 ? ((remainingBalance / totalIncome) * 100).toFixed(1) : 0;
    const expensePercentageOfSalary = totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : 0;
    const remainingPercentage = totalIncome > 0 ? ((remainingBalance / totalIncome) * 100).toFixed(1) : 0;

    const salaryChangePercent = prevSalaryAmount > 0
      ? (((salaryAmount - prevSalaryAmount) / prevSalaryAmount) * 100).toFixed(1)
      : 0;

    const expenseChangePercent = prevExpenses > 0
      ? (((totalExpenses - prevExpenses) / prevExpenses) * 100).toFixed(1)
      : 0;

    // Highest category
    let highestCategory = { name: 'None', amount: 0 };
    Object.entries(categoryTotals).forEach(([name, amount]) => {
      if (amount > highestCategory.amount) {
        highestCategory = { name, amount };
      }
    });

    // Budget alerts
    const alerts = [];
    budgets.forEach(b => {
      const spent = categoryTotals[b.category] || 0;
      const pct = b.amount > 0 ? (spent / b.amount) * 100 : 0;
      if (pct >= 100) {
        alerts.push({ type: 'danger', message: `Budget exceeded: ${b.category} is at ${Math.round(pct)}% (Spent: ₹${spent}, Limit: ₹${b.amount})` });
      } else if (pct >= 90) {
        alerts.push({ type: 'warning', message: `Budget alert: ${b.category} is ${Math.round(pct)}% used.` });
      } else if (pct >= 75) {
        alerts.push({ type: 'info', message: `${b.category} budget is ${Math.round(pct)}% utilized.` });
      }
    });

    return res.json({
      success: true,
      month,
      year,
      monthName: MONTH_NAMES[month - 1],
      cards: {
        salary: {
          amount: salaryAmount,
          change: Number(salaryChangePercent),
          isPositive: Number(salaryChangePercent) >= 0,
          label: `${salaryChangePercent >= 0 ? '+' : ''}${salaryChangePercent}% from last month`
        },
        expenses: {
          amount: totalExpenses,
          percentOfSalary: Number(expensePercentageOfSalary),
          change: Number(expenseChangePercent),
          label: `${expensePercentageOfSalary}% of salary`
        },
        remaining: {
          amount: remainingBalance,
          percentRemaining: Number(remainingPercentage),
          label: `${remainingPercentage}% remaining`
        },
        savings: {
          amount: savings,
          target: userSavingsTarget,
          targetProgress: Math.min(100, Math.round((savings / userSavingsTarget) * 100)),
          label: `Target: ₹${userSavingsTarget.toLocaleString('en-IN')}`
        }
      },
      summary: {
        totalIncome,
        totalExpenses,
        remainingBalance,
        savingsRate: Number(savingsRate),
        largestExpense,
        highestCategory,
        alerts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/dashboard/monthly
router.get('/monthly', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const year = Number(req.query.year) || 2026;

    // Look up salaries and transactions for all months in this year
    let salaries = [];
    let transactions = [];

    if (mongoose.connection.readyState === 1) {
      salaries = await Salary.find({ user_id: userId, year });
      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31, 23, 59, 59, 999);
      transactions = await Transaction.find({ user_id: userId, transaction_date: { $gte: start, $lte: end } });
    } else {
      salaries = mockStore.salaries.filter(s => String(s.user_id) === String(userId) && s.year === year);
      transactions = mockStore.transactions.filter(t => {
        if (String(t.user_id) !== String(userId)) return false;
        const d = new Date(t.transaction_date);
        return d.getFullYear() === year;
      });
    }

    // Default historical baseline data with 30,000 monthly salary
    const defaultData = [
      { month: 'May', monthNum: 5, salary: 30000, expenses: 22000, savings: 8000 },
      { month: 'Jun', monthNum: 6, salary: 30000, expenses: 25400, savings: 4600 },
      { month: 'Jul', monthNum: 7, salary: 30000, expenses: 21800, savings: 8200 },
      { month: 'Aug', monthNum: 8, salary: 30000, expenses: 28600, savings: 1400 },
      { month: 'Sep', monthNum: 9, salary: 30000, expenses: 26300, savings: 3700 },
      { month: 'Oct', monthNum: 10, salary: 30000, expenses: 28450, savings: 1550 },
    ];

    const monthlyMap = {};
    defaultData.forEach(d => {
      monthlyMap[d.monthNum] = { ...d };
    });

    salaries.forEach(s => {
      const m = s.month;
      if (!monthlyMap[m]) {
        monthlyMap[m] = {
          month: MONTH_NAMES[m - 1],
          monthNum: m,
          salary: 0,
          expenses: 0,
          savings: 0
        };
      }
      monthlyMap[m].salary = s.net_salary || s.base_salary;
    });

    // Group actual transactions dynamically
    const actualExpensesByMonth = {};
    transactions.forEach(t => {
      if (t.type === 'expense') {
        const d = new Date(t.transaction_date);
        const m = d.getMonth() + 1;
        actualExpensesByMonth[m] = (actualExpensesByMonth[m] || 0) + Number(t.amount);
      }
    });

    Object.keys(actualExpensesByMonth).forEach(m => {
      const monthNum = Number(m);
      if (!monthlyMap[monthNum]) {
        monthlyMap[monthNum] = {
          month: MONTH_NAMES[monthNum - 1],
          monthNum,
          salary: 0,
          expenses: 0,
          savings: 0
        };
      }
      monthlyMap[monthNum].expenses = actualExpensesByMonth[monthNum];
    });

    // Calculate savings
    const result = Object.values(monthlyMap)
      .sort((a, b) => a.monthNum - b.monthNum)
      .map(item => ({
        month: item.month,
        monthNum: item.monthNum,
        salary: item.salary,
        expenses: item.expenses,
        savings: item.salary - item.expenses,
        savingsRate: item.salary > 0 ? Math.round(((item.salary - item.expenses) / item.salary) * 100) : 0
      }));

    return res.json({ success: true, year, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/dashboard/category-expenses
router.get('/category-expenses', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const month = Number(req.query.month) || 10;
    const year = Number(req.query.year) || 2026;

    let transactions = [];
    if (mongoose.connection.readyState === 1) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59, 999);
      transactions = await Transaction.find({
        user_id: userId,
        type: 'expense',
        transaction_date: { $gte: start, $lte: end }
      });
    } else {
      transactions = mockStore.transactions.filter(t => {
        if (String(t.user_id) !== String(userId) || t.type !== 'expense') return false;
        const d = new Date(t.transaction_date);
        return (d.getMonth() + 1) === month && d.getFullYear() === year;
      });
    }

    const categoryMap = {};
    const categoryColors = {
      'Recharges': '#06b6d4',
      'Medicines': '#ef4444',
      'Food': '#f59e0b',
      'Entertainment': '#8b5cf6',
      'Transportation': '#3b82f6',
      'Shopping': '#ec4899',
      'Others': '#64748b',
      'Other': '#64748b',
      'Rent': '#64748b',
      'Bills': '#06b6d4',
      'Healthcare': '#ef4444',
      'Groceries': '#f59e0b'
    };

    transactions.forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
    });

    const total = Object.values(categoryMap).reduce((a, b) => a + b, 0);

    const data = Object.entries(categoryMap).map(([name, amount]) => ({
      name,
      value: amount,
      color: categoryColors[name] || '#10b981',
      percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : 0
    })).sort((a, b) => b.value - a.value);

    return res.json({ success: true, total, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/dashboard/daily-expenses
router.get('/daily-expenses', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const month = Number(req.query.month) || 10;
    const year = Number(req.query.year) || 2026;

    let transactions = [];
    if (mongoose.connection.readyState === 1) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59, 999);
      transactions = await Transaction.find({
        user_id: userId,
        type: 'expense',
        transaction_date: { $gte: start, $lte: end }
      });
    } else {
      transactions = mockStore.transactions.filter(t => {
        if (String(t.user_id) !== String(userId) || t.type !== 'expense') return false;
        const d = new Date(t.transaction_date);
        return (d.getMonth() + 1) === month && d.getFullYear() === year;
      });
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyMap = {};
    for (let day = 1; day <= daysInMonth; day++) {
      dailyMap[day] = 0;
    }

    transactions.forEach(t => {
      const day = new Date(t.transaction_date).getDate();
      if (dailyMap[day] !== undefined) {
        dailyMap[day] += Number(t.amount);
      }
    });

    const data = Object.entries(dailyMap).map(([day, amount]) => ({
      day: `${MONTH_NAMES[month - 1]} ${day}`,
      dayNum: Number(day),
      amount
    }));

    return res.json({ success: true, month, year, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
