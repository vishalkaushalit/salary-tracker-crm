import React from 'react';
import { Target, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

export const BudgetProgressWidget = ({ budgets = [], onViewAll, currency = '₹' }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Category Budgets</h3>
            <p className="text-xs text-slate-500">Track monthly expense limits</p>
          </div>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
        >
          <span>Manage</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {budgets.slice(0, 5).map((b, idx) => {
          const pct = b.percentage || 0;
          let progressColor = 'bg-emerald-500';
          let textColor = 'text-emerald-600';

          if (pct >= 100) {
            progressColor = 'bg-rose-500';
            textColor = 'text-rose-600';
          } else if (pct >= 75) {
            progressColor = 'bg-amber-500';
            textColor = 'text-amber-600';
          }

          return (
            <div key={b._id || idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{b.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">
                    {formatCurrency(b.spent, currency)} / {formatCurrency(b.amount, currency)}
                  </span>
                  <span className={`font-bold ${textColor}`}>{pct}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`${progressColor} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </div>
          );
        })}

        {budgets.length === 0 && (
          <div className="text-center py-6 text-slate-400 text-xs">
            No budgets defined for this month yet.
          </div>
        )}
      </div>
    </div>
  );
};
