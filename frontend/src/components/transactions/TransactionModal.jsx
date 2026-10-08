import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  'Food', 'Groceries', 'Rent', 'Utilities', 'Transportation', 'Fuel', 
  'Shopping', 'Entertainment', 'Healthcare', 'Education', 'Subscriptions', 
  'Travel', 'Bills', 'EMI', 'Insurance', 'Personal', 'Salary', 'Other'
];

const PAYMENT_METHODS = [
  'UPI', 'Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'PayPal', 'Other'
];

export const TransactionModal = ({ isOpen, onClose, onSave, initialData, defaultType = 'expense', categories = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    payment_method: 'UPI',
    transaction_date: new Date().toISOString().split('T')[0],
    account: 'Primary Account',
    description: '',
    notes: ''
  });

  const availableCategories = categories.length > 0 
    ? categories.map(c => c.name) 
    : DEFAULT_CATEGORIES;

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        type: initialData.type || 'expense',
        category: initialData.category || 'Food',
        payment_method: initialData.payment_method || 'UPI',
        transaction_date: initialData.transaction_date ? new Date(initialData.transaction_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        account: initialData.account || 'Primary Account',
        description: initialData.description || '',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        type: defaultType,
        category: defaultType === 'income' ? 'Salary' : 'Food',
        payment_method: 'UPI',
        transaction_date: new Date().toISOString().split('T')[0],
        account: 'Primary Account',
        description: '',
        notes: ''
      });
    }
  }, [initialData, defaultType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;
    onSave({
      ...formData,
      _id: initialData?._id || initialData?.id,
      id: initialData?._id || initialData?.id,
      amount: Number(formData.amount)
    });
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">
            {initialData ? 'Edit Transaction' : 'Quick Add Transaction'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Type Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense' })}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                formData.type === 'expense'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income', category: 'Salary' })}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                formData.type === 'income'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Income
            </button>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Amount (₹) *
            </label>
            <input
              type="number"
              step="any"
              required
              placeholder="e.g. 850"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full text-xl font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Title Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dinner, Uber, Grocery"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Method
              </label>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {PAYMENT_METHODS.map(pm => (
                  <option key={pm} value={pm}>{pm}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Account */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.transaction_date}
                onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account / Wallet
              </label>
              <input
                type="text"
                placeholder="e.g. HDFC Bank, Cash"
                value={formData.account}
                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="Any extra details..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Transaction</span>
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
};
