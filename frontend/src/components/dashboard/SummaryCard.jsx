import React from 'react';
import { DollarSign, CreditCard, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

export const SummaryCard = ({ cards, currency = '₹' }) => {
  if (!cards) return null;

  const { salary, expenses, remaining, savings } = cards;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Salary */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Monthly Salary</span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 mb-2">
          {formatCurrency(salary.amount, currency)}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium">
          {salary.change >= 0 ? (
            <span className="text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +{salary.change}%
            </span>
          ) : (
            <span className="text-rose-600 flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5" /> {salary.change}%
            </span>
          )}
          <span className="text-slate-400">from last month</span>
        </div>
      </div>

      {/* Card 2: Expenses */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Expenses</span>
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 mb-2">
          {formatCurrency(expenses.amount, currency)}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <span className="text-rose-600 font-semibold">{expenses.percentOfSalary}%</span>
          <span>of salary</span>
        </div>
      </div>

      {/* Card 3: Remaining */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Remaining Balance</span>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 mb-2">
          {formatCurrency(remaining.amount, currency)}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <span className="text-indigo-600 font-semibold">{remaining.percentRemaining}%</span>
          <span>remaining</span>
        </div>
      </div>

      {/* Card 4: Savings */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Savings</span>
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 mb-1">
          {formatCurrency(savings.amount, currency)}
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>Target: {formatCurrency(savings.target, currency)}</span>
            <span className="text-teal-600 font-semibold">{savings.targetProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-teal-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, savings.targetProgress)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
