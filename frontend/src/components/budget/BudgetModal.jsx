import React, { useState, useEffect } from 'react';
import { X, Check, Target } from 'lucide-react';
import { MONTHS } from '../../utils/date';

export const BudgetModal = ({ isOpen, onClose, onSave, initialData, categories = [], defaultMonth = 10, defaultYear = 2026 }) => {
  const [formData, setFormData] = useState({
    category: 'Food',
    month: defaultMonth,
    year: defaultYear,
    amount: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        _id: initialData._id || initialData.id,
        id: initialData._id || initialData.id,
        category: initialData.category || (categories[0]?.name || 'Food'),
        month: initialData.month || defaultMonth,
        year: initialData.year || defaultYear,
        amount: initialData.amount ?? ''
      });
    } else {
      setFormData({
        category: categories.length > 0 ? categories[0].name : 'Food',
        month: defaultMonth,
        year: defaultYear,
        amount: ''
      });
    }
  }, [initialData, defaultMonth, defaultYear, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || formData.amount === '') return;
    onSave({
      ...formData,
      _id: initialData?._id || initialData?.id || formData._id || formData.id,
      id: initialData?._id || initialData?.id || formData._id || formData.id,
      amount: Number(formData.amount),
      month: Number(formData.month),
      year: Number(formData.year)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {initialData ? 'Edit Budget' : 'Set Monthly Budget'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {categories.map((c) => (
                <option key={c._id || c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Month</label>
              <select
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: Number(e.target.value) })}
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {MONTHS.map(m => (
                  <option key={m.value} value={m.value}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Monthly Limit Amount (₹) *
            </label>
            <input
              type="number"
              required
              min="0"
              placeholder="e.g. 7000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full text-lg font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Budget</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
