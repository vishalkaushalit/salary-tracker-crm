const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String,
    default: 'tag',
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    default: 'expense',
  },
  color: {
    type: String,
    default: '#10b981',
  },
  is_default: {
    type: Boolean,
    default: false,
  },
  subcategories: [{
    type: String,
    trim: true,
  }]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Category', CategorySchema);
