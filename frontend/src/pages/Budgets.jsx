import React, { useState, useEffect } from 'react';
import { Target, Plus, AlertTriangle, CheckCircle, Trash2, Edit2, TrendingUp, ShieldAlert, Wallet } from 'lucide-react';
import { api } from '../services/api';
import { formatCurrency } from '../utils/currency';
import { MONTHS } from '../utils/date';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/common/Loader';

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

  if (loading && budgets.length === 0) {
    return (
      <Loader 
        message="Calculating Monthly Budgets"
        subMessage="Checking category spending thresholds and alert limits..."
      />
    );
  }

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

  // Compute aggregate budget KPIs
  const totalAllocated = budgets.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (Number(b.spent) || 0), 0);
  const totalRemaining = totalAllocated - totalSpent;
  const overallPct = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  return (
    <div className="space-y-5 sm:space-y-6 pb-12 animate-fade-in">
      
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">{monthName} {selectedYear} Budgets</h2>
          <p className="text-xs text-slate-500">Set limits per category and monitor your spending progress</p>
        </div>
        <button
          onClick={() => onOpenBudgetModal()}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs whitespace-nowrap rounded-xl shadow-sm shadow-emerald-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Add Budget</span>
        </button>
      </div>

      {/* Aggregate Overview Banner */}
      {budgets.length > 0 && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-800">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
            <div className="pt-2 sm:pt-0 sm:pr-3">
              <span className="text-[11px] text-slate-400 font-medium">Total Allocated</span>
              <p className="text-base sm:text-xl font-bold text-white mt-0.5">{formatCurrency(totalAllocated, currency)}</p>
            </div>
            <div className="pt-2 sm:pt-0 sm:px-3">
              <span className="text-[11px] text-slate-400 font-medium">Total Spent</span>
              <p className="text-base sm:text-xl font-bold text-rose-400 mt-0.5">{formatCurrency(totalSpent, currency)}</p>
            </div>
            <div className="pt-2 sm:pt-0 sm:px-3">
              <span className="text-[11px] text-slate-400 font-medium">Remaining</span>
              <p className={`text-base sm:text-xl font-bold mt-0.5 ${totalRemaining >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatCurrency(totalRemaining, currency)}
              </p>
            </div>
            <div className="pt-2 sm:pt-0 sm:pl-3">
              <span className="text-[11px] text-slate-400 font-medium">Budget Utilization</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-base sm:text-xl font-bold ${overallPct > 100 ? 'text-rose-400' : overallPct >= 75 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {overallPct}%
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">utilized</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Budget Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
            <div key={b._id || b.id} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900 text-sm truncate pr-2">{b.category}</h3>
                  <div className="flex items-center gap-1.5 shrink-0">
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
                <div className="space-y-1.5 mb-3.5">
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`${progressColor} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Spent</span>
                    <span className="font-bold text-slate-800">{formatCurrency(b.spent, currency)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Budget</span>
                    <span className="font-bold text-slate-800">{formatCurrency(b.amount, currency)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs flex justify-between items-center text-slate-500 border-t border-slate-50 mt-1">
                <span className="text-[11px]">Remaining:</span>
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
