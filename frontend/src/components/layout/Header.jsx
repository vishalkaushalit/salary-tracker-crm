import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Bell, 
  PlusCircle, 
  DollarSign, 
  Target, 
  ArrowUpRight, 
  ArrowDownLeft,
  X,
  AlertTriangle,
  Info
} from 'lucide-react';
import { MONTHS } from '../../utils/date';

export const Header = ({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  onOpenTransactionModal,
  onOpenSalaryModal,
  onOpenBudgetModal,
  alerts = []
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-4 sticky top-0 z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Current Active Period Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/70 transition-colors px-3 py-1.5 rounded-xl border border-slate-200">
            <Calendar className="w-4 h-4 text-slate-600" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent font-semibold text-slate-800 text-sm focus:outline-none cursor-pointer"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.name}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent font-semibold text-slate-800 text-sm focus:outline-none cursor-pointer border-l border-slate-300 pl-2"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>
          </div>
          <span className="hidden sm:inline-block text-xs font-medium text-slate-500">
            Financial Dashboard
          </span>
        </div>

        {/* Right: Quick Actions & Notifications */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Action: Add Expense */}
          <button
            onClick={() => onOpenTransactionModal('expense')}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium text-xs rounded-xl border border-rose-200 transition-all shadow-sm"
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-rose-600" />
            <span>+ Add Expense</span>
          </button>

          {/* Quick Action: Add Income */}
          <button
            onClick={() => onOpenTransactionModal('income')}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium text-xs rounded-xl border border-emerald-200 transition-all shadow-sm"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            <span>+ Add Income</span>
          </button>

          {/* Quick Action: Add Salary */}
          <button
            onClick={onOpenSalaryModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-xs rounded-xl border border-indigo-200 transition-all shadow-sm"
          >
            <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
            <span>+ Salary</span>
          </button>

          {/* Quick Action: Add Budget */}
          <button
            onClick={onOpenBudgetModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium text-xs rounded-xl border border-amber-200 transition-all shadow-sm"
          >
            <Target className="w-3.5 h-3.5 text-amber-600" />
            <span>+ Budget</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition-colors"
              title="Notifications & Alerts"
            >
              <Bell className="w-4 h-4" />
              {alerts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 px-4 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <h3 className="font-semibold text-xs text-slate-800">Financial Alerts</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {alerts.length === 0 ? (
                  <p className="text-xs text-slate-500 py-2">No active warnings. Your budget is healthy!</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {alerts.map((a, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl text-xs flex items-start gap-2 ${
                          a.type === 'danger'
                            ? 'bg-rose-50 text-rose-800 border border-rose-100'
                            : 'bg-amber-50 text-amber-800 border border-amber-100'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{a.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
