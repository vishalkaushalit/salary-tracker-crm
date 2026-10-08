import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { formatCurrency } from '../utils/currency';
import { MONTHS } from '../utils/date';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/common/Loader';

export const Reports = ({ selectedMonth, selectedYear, refreshTrigger }) => {
  const { user } = useAuth();
  const currency = user?.currency || '₹';

  // Compare month A vs Month B
  const [monthA, setMonthA] = useState(9); // September
  const [yearA, setYearA] = useState(2026);
  const [monthB, setMonthB] = useState(10); // October
  const [yearB, setYearB] = useState(2026);

  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchComparison = async () => {
    try {
      setLoading(true);
      const res = await api.getComparison(monthA, yearA, monthB, yearB);
      if (res.success) {
        setCompareData(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, [monthA, yearA, monthB, yearB, refreshTrigger]);

  const [exporting, setExporting] = useState(false);

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      await api.exportCsv(selectedMonth, selectedYear);
    } catch (err) {
      console.warn('Direct CSV export failed, using URL fallback:', err);
      window.open(api.getExportCsvUrl(selectedMonth, selectedYear), '_blank');
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const metrics = compareData?.metrics;

  if (loading && !compareData) {
    return (
      <Loader 
        message="Generating Financial Comparison"
        subMessage="Analyzing monthly salaries, expense patterns, and net savings..."
      />
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Financial Reports & Comparison</h2>
          <p className="text-xs text-slate-500">Analyze performance differences across months and export statements</p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto sm:min-w-[130px] flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs whitespace-nowrap rounded-xl shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Print Report</span>
          </button>
          <button
            onClick={handleExportCsv}
            disabled={exporting}
            className="w-full sm:w-auto sm:min-w-[130px] flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs whitespace-nowrap rounded-xl shadow-sm shadow-emerald-500/20 transition-all disabled:opacity-60"
          >
            <Download className={`w-3.5 h-3.5 shrink-0 ${exporting ? 'animate-bounce' : ''}`} />
            <span className="whitespace-nowrap">{exporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Monthly Comparison Module (PRD Section 16) */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-sm space-y-5 sm:space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3.5 sm:gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Month-over-Month Comparison</h3>
            <p className="text-xs text-slate-500">Select two periods to see percentage shifts in earnings, spending, and savings</p>
          </div>

          {/* Selectors in One Row - Zero Scroll */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-nowrap shrink-0">
            <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-50 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 text-xs shrink-0">
              <span className="text-slate-400 font-medium text-xs whitespace-nowrap">
                Period A:
              </span>
              <select
                value={monthA}
                onChange={(e) => setMonthA(Number(e.target.value))}
                className="bg-transparent font-bold text-xs text-slate-800 focus:outline-none cursor-pointer"
              >
                {MONTHS.map(m => <option key={m.value} value={m.value}>{m.short}</option>)}
              </select>
              <select
                value={yearA}
                onChange={(e) => setYearA(Number(e.target.value))}
                className="bg-transparent font-medium text-xs text-slate-700 focus:outline-none cursor-pointer border-l border-slate-200 pl-1.5"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
              </select>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-50 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 text-xs shrink-0">
              <span className="text-slate-400 font-medium text-xs whitespace-nowrap">
                Period B:
              </span>
              <select
                value={monthB}
                onChange={(e) => setMonthB(Number(e.target.value))}
                className="bg-transparent font-bold text-xs text-slate-800 focus:outline-none cursor-pointer"
              >
                {MONTHS.map(m => <option key={m.value} value={m.value}>{m.short}</option>)}
              </select>
              <select
                value={yearB}
                onChange={(e) => setYearB(Number(e.target.value))}
                className="bg-transparent font-medium text-xs text-slate-700 focus:outline-none cursor-pointer border-l border-slate-200 pl-1.5"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3 Comparison Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Salary Metric */}
            <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Salary Comparison</span>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">{compareData.periodA.label}</span>
                  <span className="text-sm font-semibold text-slate-700">{formatCurrency(metrics.salary.periodA, currency)}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">{compareData.periodB.label}</span>
                  <span className="text-base font-bold text-slate-900">{formatCurrency(metrics.salary.periodB, currency)}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                <span>Change:</span>
                <span className={`flex items-center gap-1 ${metrics.salary.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {metrics.salary.change >= 0 ? '+' : ''}{metrics.salary.change}%
                </span>
              </div>
            </div>

            {/* Expenses Metric */}
            <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Expenses Comparison</span>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">{compareData.periodA.label}</span>
                  <span className="text-sm font-semibold text-slate-700">{formatCurrency(metrics.expenses.periodA, currency)}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">{compareData.periodB.label}</span>
                  <span className="text-base font-bold text-slate-900">{formatCurrency(metrics.expenses.periodB, currency)}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                <span>Change:</span>
                {/* Note: In expenses, increase (+%) is negative for budget */}
                <span className={`flex items-center gap-1 ${metrics.expenses.change > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {metrics.expenses.change >= 0 ? '+' : ''}{metrics.expenses.change}%
                </span>
              </div>
            </div>

            {/* Savings Metric */}
            <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Savings Comparison</span>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">{compareData.periodA.label}</span>
                  <span className="text-sm font-semibold text-slate-700">{formatCurrency(metrics.savings.periodA, currency)}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">{compareData.periodB.label}</span>
                  <span className="text-base font-bold text-slate-900">{formatCurrency(metrics.savings.periodB, currency)}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                <span>Change:</span>
                <span className={`flex items-center gap-1 ${metrics.savings.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {metrics.savings.change >= 0 ? '+' : ''}{metrics.savings.change}%
                </span>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
