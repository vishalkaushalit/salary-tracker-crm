import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Salary } from './pages/Salary';
import { Transactions } from './pages/Transactions';
import { Expenses } from './pages/Expenses';
import { Budgets } from './pages/Budgets';
import { Reports } from './pages/Reports';
import { Categories } from './pages/Categories';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Modals
import { TransactionModal } from './components/transactions/TransactionModal';
import { SalaryModal } from './components/salary/SalaryModal';
import { BudgetModal } from './components/budget/BudgetModal';

import { api } from './services/api';

function MainApp() {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'

  // Navigation State
  const [activeTab, setActiveTab] = useState('overview');

  // Selected Period State (Default October 2026 as per PRD)
  const [selectedMonth, setSelectedMonth] = useState(10);
  const [selectedYear, setSelectedYear] = useState(2026);

  // Modals State
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [txModalType, setTxModalType] = useState('expense');
  const [editTxData, setEditTxData] = useState(null);

  const [salaryModalOpen, setSalaryModalOpen] = useState(false);
  const [editSalaryData, setEditSalaryData] = useState(null);

  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [editBudgetData, setEditBudgetData] = useState(null);

  // App-level data
  const [categories, setCategories] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [categoryFilterForTx, setCategoryFilterForTx] = useState('All');

  const triggerRefresh = () => setRefreshCounter(prev => prev + 1);

  const fetchGlobalData = async () => {
    try {
      const [catRes, sumRes] = await Promise.all([
        api.getCategories(),
        api.getDashboardSummary(selectedMonth, selectedYear)
      ]);
      if (catRes.success) setCategories(catRes.data || []);
      if (sumRes.success && sumRes.summary?.alerts) {
        setAlerts(sumRes.summary.alerts);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchGlobalData();
    }
  }, [user, selectedMonth, selectedYear, refreshCounter]);

  // Loading spinner during auth check
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Initializing Salary Tracker CRM...</span>
        </div>
      </div>
    );
  }

  // Auth pages if not logged in
  if (!user) {
    if (authView === 'register') {
      return <Register onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <Login onSwitchToRegister={() => setAuthView('register')} />;
  }

  // Handler for Saving Transactions
  const handleSaveTransaction = async (formData) => {
    try {
      if (editTxData) {
        await api.updateTransaction(editTxData._id || editTxData.id, formData);
      } else {
        await api.createTransaction(formData);
      }
      setTxModalOpen(false);
      setEditTxData(null);
      triggerRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handler for Saving Salary
  const handleSaveSalary = async (formData) => {
    try {
      const salaryId = formData._id || formData.id || editSalaryData?._id || editSalaryData?.id;
      if (salaryId) {
        await api.updateSalary(salaryId, formData);
      } else {
        await api.saveSalary(formData);
      }
      setSalaryModalOpen(false);
      setEditSalaryData(null);
      triggerRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handler for Saving Budget
  const handleSaveBudget = async (formData) => {
    try {
      const budgetId = formData._id || formData.id || editBudgetData?._id || editBudgetData?.id;
      if (budgetId) {
        await api.updateBudget(budgetId, formData);
      } else {
        await api.saveBudget(formData);
      }
      setBudgetModalOpen(false);
      setEditBudgetData(null);
      triggerRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-900">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          onOpenTransactionModal={(type, tx) => {
            setTxModalType(type || 'expense');
            setEditTxData(tx || null);
            setTxModalOpen(true);
          }}
          onOpenSalaryModal={() => {
            setEditSalaryData(null);
            setSalaryModalOpen(true);
          }}
          onOpenBudgetModal={() => {
            setEditBudgetData(null);
            setBudgetModalOpen(true);
          }}
          alerts={alerts}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <Dashboard
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onNavigateTab={setActiveTab}
              onCategoryFilter={setCategoryFilterForTx}
              refreshTrigger={refreshCounter}
            />
          )}

          {activeTab === 'salary' && (
            <Salary
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              refreshTrigger={refreshCounter}
              onSalaryChange={triggerRefresh}
              onOpenSalaryModal={(sal) => {
                setEditSalaryData(sal || null);
                setSalaryModalOpen(true);
              }}
            />
          )}

          {activeTab === 'transactions' && (
            <Transactions
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              categories={categories}
              initialCategoryFilter={categoryFilterForTx}
              refreshTrigger={refreshCounter}
              onTransactionChange={triggerRefresh}
              onOpenAddModal={(type, tx) => {
                setTxModalType(type || 'expense');
                setEditTxData(tx || null);
                setTxModalOpen(true);
              }}
            />
          )}

          {activeTab === 'expenses' && (
            <Expenses
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              refreshTrigger={refreshCounter}
            />
          )}

          {activeTab === 'budgets' && (
            <Budgets
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onOpenBudgetModal={(b) => {
                setEditBudgetData(b || null);
                setBudgetModalOpen(true);
              }}
              onBudgetChange={triggerRefresh}
              refreshTrigger={refreshCounter}
            />
          )}

          {activeTab === 'reports' && (
            <Reports
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              refreshTrigger={refreshCounter}
            />
          )}

          {activeTab === 'categories' && (
            <Categories
              categories={categories}
              onRefresh={triggerRefresh}
            />
          )}

          {activeTab === 'settings' && (
            <Settings onDataReloaded={triggerRefresh} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickAdd={() => {
          setTxModalType('expense');
          setEditTxData(null);
          setTxModalOpen(true);
        }}
      />

      {/* Global Modals */}
      <TransactionModal
        isOpen={txModalOpen}
        onClose={() => { setTxModalOpen(false); setEditTxData(null); }}
        onSave={handleSaveTransaction}
        initialData={editTxData}
        defaultType={txModalType}
        categories={categories}
      />

      <SalaryModal
        isOpen={salaryModalOpen}
        onClose={() => { setSalaryModalOpen(false); setEditSalaryData(null); }}
        onSave={handleSaveSalary}
        initialData={editSalaryData}
        defaultMonth={selectedMonth}
        defaultYear={selectedYear}
      />

      <BudgetModal
        isOpen={budgetModalOpen}
        onClose={() => { setBudgetModalOpen(false); setEditBudgetData(null); }}
        onSave={handleSaveBudget}
        initialData={editBudgetData}
        categories={categories}
        defaultMonth={selectedMonth}
        defaultYear={selectedYear}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
