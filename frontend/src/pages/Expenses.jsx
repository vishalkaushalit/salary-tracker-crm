import React, { useState, useEffect } from 'react';
import { PieChart as PieIcon, ArrowDownRight, CreditCard, Tag } from 'lucide-react';
import { api } from '../services/api';
import { formatCurrency } from '../utils/currency';
import { CategoryExpenseChart } from '../components/dashboard/CategoryExpenseChart';
import { ExpenseChart } from '../components/dashboard/ExpenseChart';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/common/Loader';

export const Expenses = ({ selectedMonth, selectedYear, refreshTrigger }) => {
  const { user } = useAuth();
  const currency = user?.currency || '₹';

  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [expenseTx, setExpenseTx] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [catRes, monRes, txRes] = await Promise.all([
          api.getCategoryExpenses(selectedMonth, selectedYear),
          api.getDashboardMonthly(selectedYear),
          api.getTransactions({ month: selectedMonth, year: selectedYear, type: 'expense', limit: 20 })
        ]);
        if (catRes.success) setCategoryData(catRes.data || []);
        if (monRes.success) setMonthlyData(monRes.data || []);
        if (txRes.success) setExpenseTx(txRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedMonth, selectedYear, refreshTrigger]);

  const totalSpent = categoryData.reduce((sum, item) => sum + (item.value || 0), 0);

  if (loading && categoryData.length === 0) {
    return (
      <Loader 
        message="Analyzing Expenses"
        subMessage="Mapping your categorized spending breakdown and trends..."
      />
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Expense Analysis</h2>
        <p className="text-xs text-slate-500">Deep-dive into expense patterns, category distribution, and trends</p>
      </div>

      {/* Overview Stat Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Spent This Month</span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">{formatCurrency(totalSpent, currency)}</div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <ArrowDownRight className="w-6 h-6" />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryExpenseChart data={categoryData} currency={currency} />
        <ExpenseChart data={monthlyData} currency={currency} />
      </div>

      {/* Top Expense Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Top Expense Items</h3>
          <span className="text-xs text-slate-500">{expenseTx.length} items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenseTx.map((tx, idx) => (
                <tr key={tx._id || idx} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-semibold text-slate-900">{tx.title}</td>
                  <td className="py-3 px-4 text-slate-600">{tx.category}</td>
                  <td className="py-3 px-4 text-slate-500">{tx.payment_method}</td>
                  <td className="py-3 px-4 text-right font-bold text-rose-600">
                    -{formatCurrency(tx.amount, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
