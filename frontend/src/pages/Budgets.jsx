import React, { useState, useEffect } from 'react';
import { Target, Plus, AlertTriangle, CheckCircle, Trash2, Edit2 } from 'lucide-react';
import { api } from '../services/api';
import { formatCurrency } from '../utils/currency';
import { MONTHS } from '../utils/date';
import { useAuth } from '../context/AuthContext';

export const Budgets = ({ selectedMonth, selectedYear, onOpenBudgetModal, onBudgetChange, refreshTrigger }) => {
  const { user } = useAuth();
  const currency = user?.currency || '₹';

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await api.getBudgets(selectedMonth, selectedYear);
      if (res.success) {
        setBudgets(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth, selectedYear, refreshTrigger]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this budget?')) {
      try {
        await api.deleteBudget(id);
        fetchBudgets();
        if (onBudgetChange) onBudgetChange();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const monthName = MONTHS.find(m => m.value === selectedMonth)?.name || 'October';

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{monthName} {selectedYear} Budgets</h2>
          <p className="text-xs text-slate-500">Set limits per category and monitor your spending progress</p>
        </div>
        <button
          onClick={() => onOpenBudgetModal()}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Budget</span>
        </button>
      </div>

      {/* Grid of Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {budgets.map((b) => {
          const pct = b.percentage || 0;
          const isOver = pct >= 100;
          const isWarning = pct >= 90 && pct < 100;
          const isCaution = pct >= 75 && pct < 90;

          let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
          let progressColor = 'bg-emerald-500';
          if (isOver) {
            badgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
            progressColor = 'bg-rose-500';
          } else if (isWarning || isCaution) {
            badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
            progressColor = 'bg-amber-500';
          }

          return (
            <div key={b._id || b.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900 text-sm">{b.category}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                      {pct}%
                    </span>
                    <button
                      onClick={() => onOpenBudgetModal(b)}
                      className="p-1 text-slate-300 hover:text-emerald-600 rounded transition-colors"
                      title="Edit Budget"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(b._id || b.id)}
                      className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors"
                      title="Delete Budget"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`${progressColor} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block">Spent</span>
                    <span className="font-bold text-slate-800">{formatCurrency(b.spent, currency)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Budget</span>
                    <span className="font-bold text-slate-800">{formatCurrency(b.amount, currency)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs flex justify-between items-center text-slate-500">
                <span>Remaining:</span>
                <span className={`font-bold ${b.remaining < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {formatCurrency(b.remaining, currency)}
                </span>
              </div>
            </div>
          );
        })}

        {budgets.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
            No budgets configured for this month. Click "+ Add Budget" above.
          </div>
        )}
      </div>
    </div>
  );
};
