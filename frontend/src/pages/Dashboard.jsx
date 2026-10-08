import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { FinancialSummarySection } from '../components/dashboard/FinancialSummarySection';
import { ExpenseChart } from '../components/dashboard/ExpenseChart';
import { CategoryExpenseChart } from '../components/dashboard/CategoryExpenseChart';
import { SalaryExpenseChart } from '../components/dashboard/SalaryExpenseChart';
import { DailySpendingChart } from '../components/dashboard/DailySpendingChart';
import { BudgetProgressWidget } from '../components/dashboard/BudgetProgressWidget';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { Loader } from '../components/common/Loader';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Dashboard = ({
  selectedMonth,
  selectedYear,
  onNavigateTab,
  onCategoryFilter,
  refreshTrigger
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [budgetList, setBudgetList] = useState([]);
  const [recentTx, setRecentTx] = useState([]);

  const currency = user?.currency || '₹';

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [sumRes, monRes, catRes, dayRes, budRes, txRes] = await Promise.all([
        api.getDashboardSummary(selectedMonth, selectedYear),
        api.getDashboardMonthly(selectedYear),
        api.getCategoryExpenses(selectedMonth, selectedYear),
        api.getDailyExpenses(selectedMonth, selectedYear),
        api.getBudgets(selectedMonth, selectedYear),
        api.getTransactions({ month: selectedMonth, year: selectedYear, limit: 10 })
      ]);

      if (sumRes.success) setSummaryData(sumRes);
      if (monRes.success) setMonthlyData(monRes.data || []);
      if (catRes.success) setCategoryData(catRes.data || []);
      if (dayRes.success) setDailyData(dayRes.data || []);
      if (budRes.success) setBudgetList(budRes.data || []);
      if (txRes.success) setRecentTx(txRes.data || []);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth, selectedYear, refreshTrigger]);

  if (loading && !summaryData) {
    return (
      <Loader 
        message="Loading your financial dashboard"
        subMessage="Aggregating monthly income, expenses, and budget limits..."
      />
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* 4 Top Summary Cards (Section 4) */}
      <SummaryCard cards={summaryData?.cards} currency={currency} />

      {/* Financial Snapshot Banner (Section 15) */}
      <FinancialSummarySection
        summary={summaryData?.summary}
        monthName={summaryData?.monthName || 'October'}
        year={selectedYear}
        currency={currency}
      />

      {/* Grid: Chart 1 (Monthly Expense Trend) & Chart 2 (Expenses by Category) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart data={monthlyData} currency={currency} />
        <CategoryExpenseChart
          data={categoryData}
          currency={currency}
          onCategorySelect={(cat) => {
            if (onCategoryFilter) onCategoryFilter(cat);
            if (onNavigateTab) onNavigateTab('transactions');
            navigate('/transactions');
          }}
        />
      </div>

      {/* Grid: Chart 3 (Salary vs Expenses) & Chart 4 (Daily Spending) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalaryExpenseChart data={monthlyData} currency={currency} />
        <DailySpendingChart data={dailyData} currency={currency} />
      </div>

      {/* Grid: Category Budgets Widget & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetProgressWidget
          budgets={budgetList}
          currency={currency}
          onViewAll={() => {
            if (onNavigateTab) onNavigateTab('budgets');
            navigate('/budgets');
          }}
        />
        <RecentTransactions
          transactions={recentTx}
          currency={currency}
          onViewAll={() => {
            if (onNavigateTab) onNavigateTab('transactions');
            navigate('/transactions');
          }}
        />
      </div>

    </div>
  );
};
