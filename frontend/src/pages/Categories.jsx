import React, { useState } from 'react';
import { Plus, Tag, Trash2, Edit2, Check } from 'lucide-react';
import { api } from '../services/api';

export const Categories = ({ categories = [], onRefresh }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [color, setColor] = useState('#10b981');
  const [subcategories, setSubcategories] = useState('');

  const openEdit = (cat) => {
    setEditingCat(cat);
    setName(cat.name);
    setType(cat.type || 'expense');
    setColor(cat.color || '#10b981');
    setSubcategories(Array.isArray(cat.subcategories) ? cat.subcategories.join(', ') : '');
    setShowAdd(true);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const payload = {
        name: name.trim(),
        type,
        color,
        subcategories: subcategories ? subcategories.split(',').map(s => s.trim()) : []
      };

      if (editingCat) {
        await api.updateCategory(editingCat._id || editingCat.id, payload);
      } else {
        await api.createCategory(payload);
      }

      setName('');
      setSubcategories('');
      setEditingCat(null);
      setShowAdd(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id, isDefault) => {
    if (isDefault) {
      alert('Default categories cannot be deleted.');
      return;
    }
    if (window.confirm('Delete this category?')) {
      try {
        await api.deleteCategory(id);
        if (onRefresh) onRefresh();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Expense & Income Categories</h2>
          <p className="text-xs text-slate-500">Manage default financial categories and create custom spending buckets</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Custom Category</span>
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreateOrUpdate} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 max-w-lg">
          <h3 className="font-bold text-sm text-slate-900">
            {editingCat ? 'Edit Custom Category' : 'New Custom Category'}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Pet Care, Gadgets"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Color Tag</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-9 rounded-xl border border-slate-200 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subcategories (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Food, Vet, Toys"
                value={subcategories}
                onChange={(e) => setSubcategories(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => { setShowAdd(false); setEditingCat(null); }}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <div
            key={c._id || c.id}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: c.color || '#10b981' }} />
              <div className="min-w-0">
                <p className="font-bold text-xs text-slate-900 truncate">{c.name}</p>
                <span className="text-[10px] text-slate-400 capitalize">{c.type}</span>
              </div>
            </div>

            {!c.is_default && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(c)}
                  className="p-1 text-slate-300 hover:text-emerald-600 rounded transition-colors"
                  title="Edit custom category"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(c._id || c.id, c.is_default)}
                  className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors"
                  title="Delete custom category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
