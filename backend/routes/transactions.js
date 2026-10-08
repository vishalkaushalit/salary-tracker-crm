const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');
const { mockStore } = require('../store/mockStore');

// @route   GET /api/transactions
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const {
      search,
      month,
      year,
      category,
      payment_method,
      type,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      limit,
      page
    } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = { user_id: userId };

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { payment_method: { $regex: search, $options: 'i' } },
          { notes: { $regex: search, $options: 'i' } },
        ];
      }

      if (category && category !== 'All') {
        query.category = category;
      }

      if (payment_method && payment_method !== 'All') {
        query.payment_method = payment_method;
      }

      if (type && type !== 'All') {
        query.type = type.toLowerCase();
      }

      if (minAmount || maxAmount) {
        query.amount = {};
        if (minAmount) query.amount.$gte = Number(minAmount);
        if (maxAmount) query.amount.$lte = Number(maxAmount);
      }

      if (startDate || endDate) {
        query.transaction_date = {};
        if (startDate) query.transaction_date.$gte = new Date(startDate);
        if (endDate) query.transaction_date.$lte = new Date(endDate);
      } else if (month && year) {
        const start = new Date(Number(year), Number(month) - 1, 1);
        const end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
        query.transaction_date = { $gte: start, $lte: end };
      }

      let txQuery = Transaction.find(query).sort({ transaction_date: -1 });

      if (limit) {
        const take = Number(limit);
        const skip = (Number(page || 1) - 1) * take;
        txQuery = txQuery.skip(skip).limit(take);
      }

      const transactions = await txQuery;
      const totalCount = await Transaction.countDocuments(query);

      return res.json({
        success: true,
        count: transactions.length,
        total: totalCount,
        data: transactions
      });
    } else {
      // In-memory filter
      let list = mockStore.transactions.filter(t => String(t.user_id) === String(userId));

      if (search) {
        const q = search.toLowerCase();
        list = list.filter(t =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          (t.category && t.category.toLowerCase().includes(q)) ||
          (t.payment_method && t.payment_method.toLowerCase().includes(q)) ||
          (t.notes && t.notes.toLowerCase().includes(q))
        );
      }

      if (category && category !== 'All') {
        list = list.filter(t => t.category.toLowerCase() === category.toLowerCase());
      }

      if (payment_method && payment_method !== 'All') {
        list = list.filter(t => t.payment_method === payment_method);
      }

      if (type && type !== 'All') {
        list = list.filter(t => t.type.toLowerCase() === type.toLowerCase());
      }

      if (minAmount) {
        list = list.filter(t => t.amount >= Number(minAmount));
      }
      if (maxAmount) {
        list = list.filter(t => t.amount <= Number(maxAmount));
      }

      if (startDate || endDate) {
        if (startDate) {
          const s = new Date(startDate);
          list = list.filter(t => new Date(t.transaction_date) >= s);
        }
        if (endDate) {
          const e = new Date(endDate);
          list = list.filter(t => new Date(t.transaction_date) <= e);
        }
      } else if (month && year) {
        list = list.filter(t => {
          const d = new Date(t.transaction_date);
          return (d.getMonth() + 1) === Number(month) && d.getFullYear() === Number(year);
        });
      }

      list.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

      const total = list.length;
      if (limit) {
        const take = Number(limit);
        const skip = (Number(page || 1) - 1) * take;
        list = list.slice(skip, skip + take);
      }

      return res.json({
        success: true,
        count: list.length,
        total,
        data: list
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/transactions/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (mongoose.connection.readyState === 1) {
      const tx = await Transaction.findOne({ _id: req.params.id, user_id: userId });
      if (!tx) return res.status(404).json({ success: false, message: 'Transaction not found' });
      return res.json({ success: true, data: tx });
    } else {
      const tx = mockStore.transactions.find(t => (t._id === req.params.id || t.id === req.params.id) && String(t.user_id) === String(userId));
      if (!tx) return res.status(404).json({ success: false, message: 'Transaction not found' });
      return res.json({ success: true, data: tx });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/transactions
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const {
      title,
      description,
      amount,
      type,
      category,
      category_id,
      payment_method,
      transaction_date,
      notes,
      receipt,
      account,
      location
    } = req.body;

    if (!title || amount === undefined) {
      return res.status(400).json({ success: false, message: 'Title and amount are required' });
    }

    const txDate = transaction_date ? new Date(transaction_date) : new Date();

    if (mongoose.connection.readyState === 1) {
      if (req.body._id || req.body.id) {
        const existing = await Transaction.findOne({ _id: req.body._id || req.body.id, user_id: userId });
        if (existing) {
          existing.title = title.trim();
          existing.description = description || '';
          existing.amount = Number(amount);
          existing.type = type || 'expense';
          existing.category = category || 'Other';
          existing.category_id = category_id || null;
          existing.payment_method = payment_method || 'UPI';
          existing.transaction_date = txDate;
          existing.notes = notes || '';
          existing.receipt = receipt || '';
          existing.account = account || 'Primary Account';
          existing.location = location || '';
          await existing.save();
          return res.json({ success: true, message: 'Transaction updated', data: existing });
        }
      }

      const transaction = new Transaction({
        user_id: userId,
        title: title.trim(),
        description: description || '',
        amount: Number(amount),
        type: type || 'expense',
        category: category || 'Other',
        category_id: category_id || null,
        payment_method: payment_method || 'UPI',
        transaction_date: txDate,
        notes: notes || '',
        receipt: receipt || '',
        account: account || 'Primary Account',
        location: location || '',
      });

      await transaction.save();
      return res.status(201).json({ success: true, message: 'Transaction created', data: transaction });
    } else {
      const targetId = req.body._id || req.body.id;
      if (targetId) {
        const idx = mockStore.transactions.findIndex(t => (t._id === targetId || t.id === targetId) && String(t.user_id) === String(userId));
        if (idx !== -1) {
          mockStore.transactions[idx] = {
            ...mockStore.transactions[idx],
            title: title.trim(),
            description: description || '',
            amount: Number(amount),
            type: type || 'expense',
            category: category || 'Other',
            category_id: category_id || null,
            payment_method: payment_method || 'UPI',
            transaction_date: txDate.toISOString(),
            notes: notes || '',
            receipt: receipt || '',
            account: account || 'Primary Account',
            location: location || '',
            updated_at: new Date()
          };
          return res.json({ success: true, message: 'Transaction updated', data: mockStore.transactions[idx] });
        }
      }

      const newTx = {
        _id: `tx-${Date.now()}`,
        id: `tx-${Date.now()}`,
        user_id: userId,
        title: title.trim(),
        description: description || '',
        amount: Number(amount),
        type: type || 'expense',
        category: category || 'Other',
        category_id: category_id || null,
        payment_method: payment_method || 'UPI',
        transaction_date: txDate.toISOString(),
        notes: notes || '',
        receipt: receipt || '',
        account: account || 'Primary Account',
        location: location || '',
        created_at: new Date()
      };

      mockStore.transactions.unshift(newTx);
      return res.status(201).json({ success: true, message: 'Transaction created', data: newTx });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/transactions/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }

      const tx = await Transaction.findOne({ _id: req.params.id, user_id: userId });
      if (!tx) return res.status(404).json({ success: false, message: 'Transaction not found' });

      const updatePayload = { ...req.body };
      delete updatePayload._id;
      delete updatePayload.id;
      delete updatePayload.user_id;
      delete updatePayload.__v;

      if (updatePayload.amount !== undefined) updatePayload.amount = Number(updatePayload.amount);
      if (updatePayload.transaction_date) updatePayload.transaction_date = new Date(updatePayload.transaction_date);

      Object.assign(tx, updatePayload);
      await tx.save();
      return res.json({ success: true, message: 'Transaction updated', data: tx });
    } else {
      const idx = mockStore.transactions.findIndex(t => (t._id === req.params.id || t.id === req.params.id) && String(t.user_id) === String(userId));
      if (idx === -1) return res.status(404).json({ success: false, message: 'Transaction not found' });

      const updatePayload = { ...req.body };
      delete updatePayload._id;
      delete updatePayload.id;
      delete updatePayload.user_id;

      const updated = {
        ...mockStore.transactions[idx],
        ...updatePayload,
        amount: updatePayload.amount !== undefined ? Number(updatePayload.amount) : mockStore.transactions[idx].amount,
        updated_at: new Date()
      };
      mockStore.transactions[idx] = updated;
      return res.json({ success: true, message: 'Transaction updated', data: updated });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/transactions/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }

      const result = await Transaction.findOneAndDelete({ _id: req.params.id, user_id: userId });
      if (!result) return res.status(404).json({ success: false, message: 'Transaction not found' });
      return res.json({ success: true, message: 'Transaction deleted' });
    } else {
      const initialLength = mockStore.transactions.length;
      mockStore.transactions = mockStore.transactions.filter(t => !((t._id === req.params.id || t.id === req.params.id) && String(t.user_id) === String(userId)));
      if (mockStore.transactions.length === initialLength) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }
      return res.json({ success: true, message: 'Transaction deleted' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
