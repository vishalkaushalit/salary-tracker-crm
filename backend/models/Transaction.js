const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
    type: String,
    enum: ['expense', 'income', 'transfer'],
    default: 'expense',
    required: true,
  },
  category: {
    type: String,
    required: true,
    default: 'Other',
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  payment_method: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer', 'PayPal', 'Other'],
    default: 'UPI',
  },
  account: {
    type: String,
    default: 'Primary Account',
  },
  location: {
    type: String,
    default: '',
  },
  transaction_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  notes: {
    type: String,
    default: '',
  },
  receipt: {
    type: String,
    default: '',
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
