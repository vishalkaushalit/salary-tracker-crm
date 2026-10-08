import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import { Loader } from './components/common/Loader';

import { api } from './services/api';

function MainApp() {
  const { user, loading } = useAuth();

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
      <Loader 
        variant="fullscreen" 
        message="Initializing Salary Tracker CRM"
        subMessage="Preparing your personal financial workspace..."
      />
    );
  }

  // Auth pages if not logged in
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
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
        <Sidebar />
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

        <main className="flex-1 p-3.5 pb-24 sm:p-6 md:p-8 md:pb-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  onCategoryFilter={setCategoryFilterForTx}
                  refreshTrigger={refreshCounter}
                />
              }
            />
            <Route path="/overview" element={<Navigate to="/" replace />} />
            <Route
              path="/salary"
              element={
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
              }
            />
            <Route
              path="/transactions"
              element={
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
              }
            />
            <Route
              path="/expenses"
              element={
                <Expenses
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  refreshTrigger={refreshCounter}
                />
              }
            />
            <Route
              path="/budgets"
              element={
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
              }
            />
            <Route
              path="/reports"
              element={
                <Reports
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  refreshTrigger={refreshCounter}
                />
              }
            />
            <Route
              path="/categories"
              element={
                <Categories
                  categories={categories}
                  onRefresh={triggerRefresh}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <Settings onDataReloaded={triggerRefresh} />
              }
            />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
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
