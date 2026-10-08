import React from 'react';
import { TrendingUp, AlertCircle, Award, Layers } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/currency';

export const FinancialSummarySection = ({ summary, monthName = 'October', year = 2026, currency = '₹' }) => {
  if (!summary) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-700/60">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Monthly Snapshot</span>
          <h2 className="text-xl font-bold text-white mt-0.5">{monthName} {year} Financial Summary</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            Savings Rate: <strong className="text-emerald-400">{summary.savingsRate}%</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-5">
        <div>
          <span className="text-xs text-slate-400">Total Income</span>
          <p className="text-lg font-bold text-white mt-1">{formatCurrency(summary.totalIncome, currency)}</p>
        </div>

        <div>
          <span className="text-xs text-slate-400">Total Expenses</span>
          <p className="text-lg font-bold text-rose-400 mt-1">{formatCurrency(summary.totalExpenses, currency)}</p>
        </div>

        <div>
          <span className="text-xs text-slate-400">Remaining Balance</span>
          <p className="text-lg font-bold text-emerald-400 mt-1">{formatCurrency(summary.remainingBalance, currency)}</p>
        </div>

        <div>
          <span className="text-xs text-slate-400">Savings Rate</span>
          <p className="text-lg font-bold text-teal-400 mt-1">{summary.savingsRate}%</p>
        </div>

        <div>
          <span className="text-xs text-slate-400">Largest Expense</span>
          <p className="text-sm font-semibold text-white mt-1 truncate" title={summary.largestExpense?.title}>
            {summary.largestExpense?.title || 'None'}
          </p>
          <p className="text-xs text-rose-300 font-medium">{formatCurrency(summary.largestExpense?.amount, currency)}</p>
        </div>

        <div>
          <span className="text-xs text-slate-400">Highest Category</span>
          <p className="text-sm font-semibold text-white mt-1 truncate">
            {summary.highestCategory?.name || 'None'}
          </p>
          <p className="text-xs text-amber-300 font-medium">{formatCurrency(summary.highestCategory?.amount, currency)}</p>
        </div>
      </div>
    </div>
  );
};
