import React from 'react';
import { 
  ArrowRight, 
  Utensils, 
  Car, 
  ShoppingCart, 
  Tv, 
  Home, 
  Zap, 
  ShoppingBag, 
  Film, 
  CreditCard,
  Smartphone,
  Pill,
  HelpCircle,
  Tag
} from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { formatRelativeDate } from '../../utils/date';
import { CategoryBadge } from '../common/CategoryBadge';

const getCategoryIcon = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('recharge') || cat.includes('mobile')) return Smartphone;
  if (cat.includes('medicin') || cat.includes('health') || cat.includes('pharm')) return Pill;
  if (cat.includes('food') || cat.includes('grocer')) return Utensils;
  if (cat.includes('entertain') || cat.includes('subscript') || cat.includes('netflix')) return Film;
  if (cat.includes('transport') || cat.includes('fuel') || cat.includes('cab')) return Car;
  if (cat.includes('shop')) return ShoppingBag;
  if (cat.includes('other')) return HelpCircle;
  if (cat.includes('rent')) return Home;
  if (cat.includes('bill') || cat.includes('util')) return Zap;
  return Tag;
};

export const RecentTransactions = ({ transactions = [], onViewAll, currency = '₹' }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Recent Transactions</h3>
          <p className="text-xs text-slate-500">Latest expense and income activity</p>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-80">
        {transactions.slice(0, 6).map((tx, idx) => {
          const Icon = getCategoryIcon(tx.category);
          const isExpense = tx.type === 'expense';

          return (
            <div key={tx._id || idx} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0 hover:bg-slate-50/50 px-1 rounded-xl transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isExpense ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-xs text-slate-900 truncate">{tx.title}</p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <CategoryBadge category={tx.category} size="xs" />
                    <span>•</span>
                    <span className="shrink-0">{formatRelativeDate(tx.transaction_date)}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-xs font-bold ${
                  isExpense ? 'text-slate-900' : 'text-emerald-600'
                }`}>
                  {isExpense ? '-' : '+'}{formatCurrency(tx.amount, currency)}
                </span>
                <p className="text-[10px] text-slate-400 font-medium">{tx.payment_method}</p>
              </div>
            </div>
          );
        })}

        {transactions.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs">
            No transactions found for this period.
          </div>
        )}
      </div>
    </div>
  );
};
