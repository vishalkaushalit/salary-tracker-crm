import React, { useState, useEffect } from 'react';
import { X, Check, Calculator } from 'lucide-react';
import { MONTHS } from '../../utils/date';
import { formatCurrency } from '../../utils/currency';

export const SalaryModal = ({ isOpen, onClose, onSave, initialData, defaultMonth = 10, defaultYear = 2026 }) => {
  const [formData, setFormData] = useState({
    month: defaultMonth,
    year: defaultYear,
    base_salary: 45000,
    bonus: 3000,
    commission: 0,
    other_income: 2000,
    tax: 0,
    deductions: 0,
    payment_date: new Date().toISOString().split('T')[0],
    notes: 'October 2026 Salary'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        _id: initialData._id || initialData.id,
        id: initialData._id || initialData.id,
        month: initialData.month ?? defaultMonth,
        year: initialData.year ?? defaultYear,
        base_salary: initialData.base_salary ?? 0,
        bonus: initialData.bonus ?? 0,
        commission: initialData.commission ?? 0,
        other_income: initialData.other_income ?? 0,
        tax: initialData.tax ?? 0,
        deductions: initialData.deductions ?? 0,
        payment_date: initialData.payment_date ? new Date(initialData.payment_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        month: defaultMonth,
        year: defaultYear,
        base_salary: 50000,
        bonus: 0,
        commission: 0,
        other_income: 0,
        tax: 0,
        deductions: 0,
        payment_date: new Date().toISOString().split('T')[0],
        notes: 'Monthly Salary'
      });
    }
  }, [initialData, defaultMonth, defaultYear, isOpen]);

  if (!isOpen) return null;

  const base = Number(formData.base_salary) || 0;
  const bonus = Number(formData.bonus) || 0;
  const comm = Number(formData.commission) || 0;
  const other = Number(formData.other_income) || 0;
  const tax = Number(formData.tax) || 0;
  const deductions = Number(formData.deductions) || 0;

  const grossIncome = base + bonus + comm + other;
  const netSalary = grossIncome - tax - deductions;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      _id: initialData?._id || initialData?.id || formData._id || formData.id,
      id: initialData?._id || initialData?.id || formData._id || formData.id,
      month: Number(formData.month),
      year: Number(formData.year),
      base_salary: base,
      bonus,
      commission: comm,
      other_income: other,
      tax,
      deductions,
      net_salary: netSalary
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {initialData ? 'Edit Salary' : 'Add Monthly Salary'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Month & Year */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Month</label>
              <select
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: Number(e.target.value) })}
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Earnings Breakdown */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Earnings</span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Base Salary (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.base_salary}
                  onChange={(e) => setFormData({ ...formData, base_salary: e.target.value })}
                  className="w-full text-sm font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Bonus (₹)</label>
                <input
                  type="number"
                  value={formData.bonus}
                  onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                  className="w-full text-sm font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Commission (₹)</label>
                <input
                  type="number"
                  value={formData.commission}
                  onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                  className="w-full text-sm font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Other Income (₹)</label>
                <input
                  type="number"
                  value={formData.other_income}
                  onChange={(e) => setFormData({ ...formData, other_income: e.target.value })}
                  className="w-full text-sm font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-xs font-semibold text-slate-700">
              <span>Gross Income:</span>
              <span className="text-slate-900 text-sm">{formatCurrency(grossIncome)}</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Deductions</span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Tax / TDS (₹)</label>
                <input
                  type="number"
                  value={formData.tax}
                  onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                  className="w-full text-sm font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Other Deductions (₹)</label>
                <input
                  type="number"
                  value={formData.deductions}
                  onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                  className="w-full text-sm font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Net Salary Calculation Box */}
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Net Take-Home Salary</span>
              <p className="text-xl font-bold text-emerald-900">{formatCurrency(netSalary)}</p>
            </div>
            <span className="text-xs text-emerald-700 font-medium bg-emerald-100 px-2 py-1 rounded-lg">
              Calculated
            </span>
          </div>

          {/* Payment Date & Notes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Date</label>
              <input
                type="date"
                value={formData.payment_date}
                onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
              <input
                type="text"
                placeholder="Optional notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
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
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Salary</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
