const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: '',
  },
  currency: {
    type: String,
    default: '₹',
  },
  savings_target: {
    type: Number,
    default: 25000,
  },
  profile_image: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'admin',
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('User', UserSchema);
