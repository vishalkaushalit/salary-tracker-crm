import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Plus, 
  Copy, 
  Calendar, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';
import { api } from '../services/api';
import { formatCurrency } from '../utils/currency';
import { formatDate, MONTHS } from '../utils/date';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/common/Loader';

export const Salary = ({
  selectedMonth,
  selectedYear,
  onOpenSalaryModal,
  onSalaryChange,
  refreshTrigger
}) => {
  const { user } = useAuth();
  const currency = user?.currency || '₹';

  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const res = await api.getSalaries();
      if (res.success) {
        setSalaries(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load salaries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, [selectedMonth, selectedYear, refreshTrigger]);

  if (loading && salaries.length === 0) {
    return (
      <Loader 
        message="Loading Monthly Salaries"
        subMessage="Fetching salary records and net compensation breakdowns..."
      />
    );
  }

  // Current selected month salary
  const currentSalary = salaries.find(s => s.month === selectedMonth && s.year === selectedYear);

  const handleDuplicate = async () => {
    try {
      const res = await api.duplicateSalary(selectedMonth, selectedYear);
      if (res.success) {
        setActionMessage('Salary duplicated from previous month successfully!');
        fetchSalaries();
        if (onSalaryChange) onSalaryChange();
        setTimeout(() => setActionMessage(''), 4000);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this salary record?')) {
      try {
        await api.deleteSalary(id);
        fetchSalaries();
        if (onSalaryChange) onSalaryChange();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const monthName = MONTHS.find(m => m.value === selectedMonth)?.name || 'October';

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Salary Management</h2>
          <p className="text-xs text-slate-500">Configure base salary, bonuses, deductions, and view historical payouts</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleDuplicate}
            className="w-full sm:w-auto sm:min-w-[180px] flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs whitespace-nowrap rounded-xl shadow-sm transition-all"
          >
            <Copy className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Duplicate Previous Month</span>
          </button>

          <button
            onClick={() => onOpenSalaryModal(currentSalary)}
            className="w-full sm:w-auto sm:min-w-[180px] flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs whitespace-nowrap rounded-xl shadow-sm shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">{currentSalary ? 'Edit Current Salary' : 'Add Salary'}</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Current Month Active Breakdown Card (PRD Section 5 Example) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{monthName} {selectedYear} Salary</h3>
              <p className="text-xs text-slate-500">Selected payroll period breakdown</p>
            </div>
          </div>
          {currentSalary && (
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
              Active Record
            </span>
          )}
        </div>

        {currentSalary ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
            
            {/* Earnings Breakdown */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Earnings</span>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Base Salary:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(currentSalary.base_salary, currency)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Bonus:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(currentSalary.bonus, currency)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Other Income:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(currentSalary.other_income, currency)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-bold text-slate-800">
                <span>Gross Income:</span>
                <span>{formatCurrency((currentSalary.base_salary || 0) + (currentSalary.bonus || 0) + (currentSalary.other_income || 0), currency)}</span>
              </div>
            </div>

            {/* Deductions Breakdown */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Deductions</span>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Tax / TDS:</span>
                <span className="font-semibold text-rose-600">-{formatCurrency(currentSalary.tax, currency)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Other Deductions:</span>
                <span className="font-semibold text-rose-600">-{formatCurrency(currentSalary.deductions, currency)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-bold text-slate-800">
                <span>Total Deductions:</span>
                <span className="text-rose-600">-{formatCurrency((currentSalary.tax || 0) + (currentSalary.deductions || 0), currency)}</span>
              </div>
            </div>

            {/* Net Take Home */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5 rounded-xl flex flex-col justify-between shadow-md">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Net Take-Home Salary</span>
                <div className="text-2xl font-bold mt-1">
                  {formatCurrency(currentSalary.net_salary, currency)}
                </div>
              </div>
              <div className="pt-4 border-t border-emerald-400/30 text-xs text-emerald-100">
                {currentSalary.payment_date && (
                  <p>Paid on: {formatDate(currentSalary.payment_date)}</p>
                )}
                {currentSalary.notes && (
                  <p className="mt-1 italic opacity-90">{currentSalary.notes}</p>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            No salary record for {monthName} {selectedYear}. Click "Add Salary" or "Duplicate Previous Month" to record it.
          </div>
        )}
      </div>

      {/* Salary History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Salary History</h3>
          <span className="text-xs text-slate-500">{salaries.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Base Salary</th>
                <th className="py-3 px-4">Bonus</th>
                <th className="py-3 px-4">Other Income</th>
                <th className="py-3 px-4">Deductions</th>
                <th className="py-3 px-4 text-right">Net Salary</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {salaries.map((s) => {
                const sMonthName = MONTHS.find(m => m.value === s.month)?.short || s.month;
                return (
                  <tr key={s._id || s.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {sMonthName} {s.year}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {formatCurrency(s.base_salary, currency)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {formatCurrency(s.bonus, currency)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {formatCurrency(s.other_income, currency)}
                    </td>
                    <td className="py-3.5 px-4 text-rose-600">
                      -{formatCurrency((s.tax || 0) + (s.deductions || 0), currency)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                      {formatCurrency(s.net_salary, currency)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onOpenSalaryModal(s)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(s._id || s.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
