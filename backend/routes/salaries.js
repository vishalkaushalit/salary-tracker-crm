const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Salary = require('../models/Salary');
const { auth } = require('../middleware/auth');
const { mockStore } = require('../store/mockStore');

const calculateNet = (data) => {
  const base = Number(data.base_salary) || 0;
  const bonus = Number(data.bonus) || 0;
  const commission = Number(data.commission) || 0;
  const other = Number(data.other_income) || 0;
  const tax = Number(data.tax) || 0;
  const deductions = Number(data.deductions) || 0;
  return base + bonus + commission + other - tax - deductions;
};

// @route   GET /api/salaries
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { year, month } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = { user_id: userId };
      if (year) query.year = Number(year);
      if (month) query.month = Number(month);

      const salaries = await Salary.find(query).sort({ year: -1, month: -1 });
      return res.json({ success: true, count: salaries.length, data: salaries });
    } else {
      let salaries = mockStore.salaries.filter(s => String(s.user_id) === String(userId));
      if (year) salaries = salaries.filter(s => s.year === Number(year));
      if (month) salaries = salaries.filter(s => s.month === Number(month));
      salaries.sort((a, b) => (b.year * 100 + b.month) - (a.year * 100 + a.month));
      return res.json({ success: true, count: salaries.length, data: salaries });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/salaries/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (mongoose.connection.readyState === 1) {
      const salary = await Salary.findOne({ _id: req.params.id, user_id: userId });
      if (!salary) return res.status(404).json({ success: false, message: 'Salary record not found' });
      return res.json({ success: true, data: salary });
    } else {
      const salary = mockStore.salaries.find(s => (s._id === req.params.id || s.id === req.params.id) && String(s.user_id) === String(userId));
      if (!salary) return res.status(404).json({ success: false, message: 'Salary record not found' });
      return res.json({ success: true, data: salary });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/salaries
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { month, year, base_salary, bonus, commission, other_income, tax, deductions, payment_date, notes } = req.body;

    if (!month || !year || base_salary === undefined) {
      return res.status(400).json({ success: false, message: 'Month, Year, and Base Salary are required' });
    }

    const net_salary = calculateNet(req.body);

    if (mongoose.connection.readyState === 1) {
      // Upsert or create for month/year or by ID
      let salary = null;
      const targetId = req.body._id || req.body.id;
      if (targetId) {
        salary = await Salary.findOne({ _id: targetId, user_id: userId });
      }
      if (!salary) {
        salary = await Salary.findOne({ user_id: userId, month: Number(month), year: Number(year) });
      }

      if (salary) {
        salary.month = Number(month);
        salary.year = Number(year);
        salary.base_salary = Number(base_salary);
        salary.bonus = Number(bonus) || 0;
        salary.commission = Number(commission) || 0;
        salary.other_income = Number(other_income) || 0;
        salary.tax = Number(tax) || 0;
        salary.deductions = Number(deductions) || 0;
        salary.net_salary = net_salary;
        salary.payment_date = payment_date || salary.payment_date;
        salary.notes = notes !== undefined ? notes : salary.notes;
        await salary.save();
        return res.json({ success: true, message: 'Salary updated successfully', data: salary });
      }

      salary = new Salary({
        user_id: userId,
        month: Number(month),
        year: Number(year),
        base_salary: Number(base_salary),
        bonus: Number(bonus) || 0,
        commission: Number(commission) || 0,
        other_income: Number(other_income) || 0,
        tax: Number(tax) || 0,
        deductions: Number(deductions) || 0,
        net_salary,
        payment_date: payment_date || new Date(),
        notes: notes || '',
      });
      await salary.save();
      return res.status(201).json({ success: true, message: 'Salary created successfully', data: salary });
    } else {
      let existingIndex = mockStore.salaries.findIndex(s => String(s.user_id) === String(userId) && s.month === Number(month) && s.year === Number(year));
      const newSalary = {
        _id: existingIndex !== -1 ? mockStore.salaries[existingIndex]._id : `sal-${Date.now()}`,
        id: existingIndex !== -1 ? mockStore.salaries[existingIndex].id : `sal-${Date.now()}`,
        user_id: userId,
        month: Number(month),
        year: Number(year),
        base_salary: Number(base_salary),
        bonus: Number(bonus) || 0,
        commission: Number(commission) || 0,
        other_income: Number(other_income) || 0,
        tax: Number(tax) || 0,
        deductions: Number(deductions) || 0,
        net_salary,
        payment_date: payment_date || new Date().toISOString(),
        notes: notes || '',
        updated_at: new Date()
      };

      if (existingIndex !== -1) {
        mockStore.salaries[existingIndex] = { ...mockStore.salaries[existingIndex], ...newSalary };
      } else {
        newSalary.created_at = new Date();
        mockStore.salaries.push(newSalary);
      }

      return res.status(201).json({ success: true, message: 'Salary saved successfully', data: newSalary });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/salaries/duplicate-previous
router.post('/duplicate-previous', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { targetMonth, targetYear } = req.body;

    if (!targetMonth || !targetYear) {
      return res.status(400).json({ success: false, message: 'Target month and year required' });
    }

    let prevMonth = Number(targetMonth) - 1;
    let prevYear = Number(targetYear);
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear -= 1;
    }

    if (mongoose.connection.readyState === 1) {
      const prevSalary = await Salary.findOne({ user_id: userId, month: prevMonth, year: prevYear });
      if (!prevSalary) {
        return res.status(404).json({ success: false, message: `No salary record found for previous month (${prevMonth}/${prevYear}) to duplicate.` });
      }

      let newSalary = await Salary.findOne({ user_id: userId, month: Number(targetMonth), year: Number(targetYear) });
      if (!newSalary) {
        newSalary = new Salary({
          user_id: userId,
          month: Number(targetMonth),
          year: Number(targetYear),
          base_salary: prevSalary.base_salary,
          bonus: prevSalary.bonus,
          commission: prevSalary.commission,
          other_income: prevSalary.other_income,
          tax: prevSalary.tax,
          deductions: prevSalary.deductions,
          net_salary: prevSalary.net_salary,
          payment_date: new Date(targetYear, targetMonth - 1, 1),
          notes: `Duplicated from ${prevMonth}/${prevYear}`,
        });
      } else {
        newSalary.base_salary = prevSalary.base_salary;
        newSalary.bonus = prevSalary.bonus;
        newSalary.commission = prevSalary.commission;
        newSalary.other_income = prevSalary.other_income;
        newSalary.tax = prevSalary.tax;
        newSalary.deductions = prevSalary.deductions;
        newSalary.net_salary = prevSalary.net_salary;
      }
      await newSalary.save();
      return res.json({ success: true, message: 'Salary duplicated successfully', data: newSalary });
    } else {
      const prevSalary = mockStore.salaries.find(s => String(s.user_id) === String(userId) && s.month === prevMonth && s.year === prevYear);
      if (!prevSalary) {
        return res.status(404).json({ success: false, message: `No salary record found for previous month (${prevMonth}/${prevYear}) to duplicate.` });
      }

      const newRecord = {
        _id: `sal-${Date.now()}`,
        id: `sal-${Date.now()}`,
        user_id: userId,
        month: Number(targetMonth),
        year: Number(targetYear),
        base_salary: prevSalary.base_salary,
        bonus: prevSalary.bonus,
        commission: prevSalary.commission,
        other_income: prevSalary.other_income,
        tax: prevSalary.tax,
        deductions: prevSalary.deductions,
        net_salary: prevSalary.net_salary,
        payment_date: new Date(targetYear, targetMonth - 1, 1).toISOString(),
        notes: `Duplicated from ${prevMonth}/${prevYear}`,
        created_at: new Date()
      };
      mockStore.salaries.push(newRecord);
      return res.json({ success: true, message: 'Salary duplicated successfully', data: newRecord });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/salaries/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const net_salary = calculateNet(req.body);

    if (mongoose.connection.readyState === 1) {
      let salary = null;
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        salary = await Salary.findOne({ _id: req.params.id, user_id: userId });
      }
      if (!salary && req.body.month && req.body.year) {
        salary = await Salary.findOne({ user_id: userId, month: Number(req.body.month), year: Number(req.body.year) });
      }
      if (!salary) return res.status(404).json({ success: false, message: 'Salary not found' });

      const updateData = { ...req.body };
      delete updateData._id;
      delete updateData.id;
      delete updateData.user_id;
      delete updateData.__v;

      Object.assign(salary, updateData, { net_salary });
      await salary.save();
      return res.json({ success: true, message: 'Salary updated', data: salary });
    } else {
      const idx = mockStore.salaries.findIndex(s => (s._id === req.params.id || s.id === req.params.id) && String(s.user_id) === String(userId));
      if (idx === -1) return res.status(404).json({ success: false, message: 'Salary not found' });

      const updateData = { ...req.body };
      delete updateData._id;
      delete updateData.id;
      delete updateData.user_id;

      mockStore.salaries[idx] = { ...mockStore.salaries[idx], ...updateData, net_salary, updated_at: new Date() };
      return res.json({ success: true, message: 'Salary updated', data: mockStore.salaries[idx] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/salaries/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ success: false, message: 'Salary not found' });
      }

      const result = await Salary.findOneAndDelete({ _id: req.params.id, user_id: userId });
      if (!result) return res.status(404).json({ success: false, message: 'Salary not found' });
      return res.json({ success: true, message: 'Salary deleted' });
    } else {
      const initialLength = mockStore.salaries.length;
      mockStore.salaries = mockStore.salaries.filter(s => !((s._id === req.params.id || s.id === req.params.id) && String(s.user_id) === String(userId)));
      if (mockStore.salaries.length === initialLength) {
        return res.status(404).json({ success: false, message: 'Salary not found' });
      }
      return res.json({ success: true, message: 'Salary deleted' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
