import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Trash2, 
  Edit2, 
  Eye, 
  ArrowDownLeft, 
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';
import { useAuth } from '../context/AuthContext';

export const Transactions = ({
  selectedMonth,
  selectedYear,
  onOpenAddModal,
  initialCategoryFilter,
  categories = [],
  refreshTrigger,
  onTransactionChange
}) => {
  const { user } = useAuth();
  const currency = user?.currency || '₹';

  const [transactions, setTransactions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter || 'All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // View modal
  const [viewTx, setViewTx] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        month: selectedMonth,
        year: selectedYear,
        page,
        limit: pageSize
      };
      if (search.trim()) params.search = search.trim();
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (paymentFilter !== 'All') params.payment_method = paymentFilter;
      if (typeFilter !== 'All') params.type = typeFilter;
      if (minAmount) params.minAmount = minAmount;
      if (maxAmount) params.maxAmount = maxAmount;

      const res = await api.getTransactions(params);
      if (res.success) {
        setTransactions(res.data || []);
        setTotalCount(res.total || res.count || 0);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth, selectedYear, categoryFilter, paymentFilter, typeFilter, page, search, refreshTrigger]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.deleteTransaction(id);
        fetchTransactions();
        if (onTransactionChange) onTransactionChange();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleExportCsv = () => {
    window.open(api.getExportCsvUrl(selectedMonth, selectedYear), '_blank');
  };

  return (
    <div className="space-y-5 pb-12 animate-fade-in">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Transactions</h2>
          <p className="text-xs text-slate-500">Record, filter and audit all your income and expenses</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => onOpenAddModal('expense')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search Box */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search title, description, category, payment method..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c._id || c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="All">All Types</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Income Only</option>
            </select>
          </div>

        </div>

        {/* Payment Method & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Payment:</span>
            {['All', 'UPI', 'Credit Card', 'Debit Card', 'Cash', 'Bank Transfer'].map(pm => (
              <button
                key={pm}
                onClick={() => { setPaymentFilter(pm); setPage(1); }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  paymentFilter === pm
                    ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {pm}
              </button>
            ))}
          </div>

          {(categoryFilter !== 'All' || paymentFilter !== 'All' || typeFilter !== 'All' || search) && (
            <button
              onClick={() => {
                setSearch('');
                setCategoryFilter('All');
                setPaymentFilter('All');
                setTypeFilter('All');
                setPage(1);
              }}
              className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Transaction Table (PRD Section 9) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-100 uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Description / Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => {
                const isExpense = tx.type === 'expense';
                return (
                  <tr key={tx._id || tx.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {formatDate(tx.transaction_date)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{tx.title}</div>
                      {tx.description && (
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{tx.description}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {tx.payment_method}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className={`font-bold ${isExpense ? 'text-slate-900' : 'text-emerald-600'}`}>
                        {isExpense ? '-' : '+'}{formatCurrency(tx.amount, currency)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewTx(tx)}
                          title="View Details"
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenAddModal(tx.type, tx)}
                          title="Edit"
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tx._id || tx.id)}
                          title="Delete"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {transactions.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {transactions.length} of {totalCount} records</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-semibold text-slate-700">Page {page}</span>
            <button
              disabled={transactions.length < pageSize}
              onClick={() => setPage(page + 1)}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {viewTx && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setViewTx(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Transaction Details</h3>
              <button 
                onClick={() => setViewTx(null)} 
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Title:</span>
                <span className="font-semibold text-slate-800">{viewTx.title}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Amount:</span>
                <span className="font-bold text-slate-900">{formatCurrency(viewTx.amount, currency)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Type:</span>
                <span className="font-semibold capitalize text-slate-800">{viewTx.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Category:</span>
                <span className="font-semibold text-slate-800">{viewTx.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Payment Method:</span>
                <span className="font-semibold text-slate-800">{viewTx.payment_method}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Account:</span>
                <span className="font-semibold text-slate-800">{viewTx.account || 'Primary'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Date:</span>
                <span className="font-semibold text-slate-800">{formatDate(viewTx.transaction_date)}</span>
              </div>
              {viewTx.description && (
                <div className="py-1">
                  <span className="text-slate-400 block mb-0.5">Description:</span>
                  <p className="text-slate-700 bg-slate-50 p-2 rounded-lg">{viewTx.description}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setViewTx(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
