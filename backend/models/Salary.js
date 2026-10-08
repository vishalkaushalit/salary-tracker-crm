const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  month: {
    type: Number, // 1 to 12
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  base_salary: {
    type: Number,
    required: true,
    default: 0,
  },
  bonus: {
    type: Number,
    default: 0,
  },
  commission: {
    type: Number,
    default: 0,
  },
  other_income: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  deductions: {
    type: Number,
    default: 0,
  },
  net_salary: {
    type: Number,
    required: true,
    default: 0,
  },
  payment_date: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    default: '',
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Salary', SalarySchema);
