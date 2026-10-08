const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const { auth } = require('../middleware/auth');
const { mockStore, defaultCategories } = require('../store/mockStore');

// @route   GET /api/categories
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (mongoose.connection.readyState === 1) {
      // Find default categories OR categories created by this user
      let categories = await Category.find({
        $or: [{ is_default: true }, { user_id: userId }]
      }).sort({ name: 1 });

      if (categories.length === 0) {
        // Seed default categories into MongoDB for first-time use
        await Category.insertMany(defaultCategories.map(c => ({
          name: c.name,
          icon: c.icon,
          type: c.type,
          color: c.color,
          is_default: true,
          subcategories: c.subcategories || []
        })));
        categories = await Category.find({
          $or: [{ is_default: true }, { user_id: userId }]
        }).sort({ name: 1 });
      }

      return res.json({ success: true, count: categories.length, data: categories });
    } else {
      let list = mockStore.categories.filter(c => c.is_default || String(c.user_id) === String(userId));
      return res.json({ success: true, count: list.length, data: list });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/categories
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { name, icon, type, color, subcategories } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    if (mongoose.connection.readyState === 1) {
      const existing = await Category.findOne({
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
        $or: [{ is_default: true }, { user_id: userId }]
      });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Category with this name already exists' });
      }

      const category = new Category({
        user_id: userId,
        name: name.trim(),
        icon: icon || 'Tag',
        type: type || 'expense',
        color: color || '#10b981',
        is_default: false,
        subcategories: Array.isArray(subcategories) ? subcategories : (subcategories ? subcategories.split(',').map(s => s.trim()) : [])
      });

      await category.save();
      return res.status(201).json({ success: true, message: 'Category created', data: category });
    } else {
      const existing = mockStore.categories.find(c => c.name.toLowerCase() === name.trim().toLowerCase() && (c.is_default || String(c.user_id) === String(userId)));
      if (existing) {
        return res.status(400).json({ success: false, message: 'Category with this name already exists' });
      }

      const newCat = {
        _id: `cat-${Date.now()}`,
        id: `cat-${Date.now()}`,
        user_id: userId,
        name: name.trim(),
        icon: icon || 'Tag',
        type: type || 'expense',
        color: color || '#10b981',
        is_default: false,
        subcategories: Array.isArray(subcategories) ? subcategories : (subcategories ? subcategories.split(',').map(s => s.trim()) : []),
        created_at: new Date()
      };
      mockStore.categories.push(newCat);
      return res.status(201).json({ success: true, message: 'Category created', data: newCat });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/categories/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ success: false, message: 'Custom category not found or cannot edit default category' });
      }

      const category = await Category.findOne({ _id: req.params.id, user_id: userId });
      if (!category) {
        return res.status(404).json({ success: false, message: 'Custom category not found or cannot edit default category' });
      }

      if (req.body.name) category.name = req.body.name.trim();
      if (req.body.icon) category.icon = req.body.icon;
      if (req.body.color) category.color = req.body.color;
      if (req.body.type) category.type = req.body.type;
      if (req.body.subcategories) {
        category.subcategories = Array.isArray(req.body.subcategories) ? req.body.subcategories : req.body.subcategories.split(',').map(s => s.trim());
      }

      await category.save();
      return res.json({ success: true, message: 'Category updated', data: category });
    } else {
      const idx = mockStore.categories.findIndex(c => (c._id === req.params.id || c.id === req.params.id) && String(c.user_id) === String(userId));
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Custom category not found or cannot edit default category' });
      }

      mockStore.categories[idx] = { ...mockStore.categories[idx], ...req.body, updated_at: new Date() };
      return res.json({ success: true, message: 'Category updated', data: mockStore.categories[idx] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/categories/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ success: false, message: 'Category not found or default categories cannot be deleted' });
      }

      const cat = await Category.findOne({ _id: req.params.id, user_id: userId });
      if (!cat) {
        return res.status(404).json({ success: false, message: 'Category not found or default categories cannot be deleted' });
      }
      await Category.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'Category deleted' });
    } else {
      const idx = mockStore.categories.findIndex(c => (c._id === req.params.id || c.id === req.params.id) && String(c.user_id) === String(userId));
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Category not found or default categories cannot be deleted' });
      }
      mockStore.categories.splice(idx, 1);
      return res.json({ success: true, message: 'Category deleted' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
