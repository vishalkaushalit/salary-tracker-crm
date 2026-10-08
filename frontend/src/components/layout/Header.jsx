import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  Bell, 
  DollarSign, 
  Target, 
  ArrowUpRight, 
  ArrowDownLeft, 
  X, 
  AlertTriangle,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Shield
} from 'lucide-react';
import { MONTHS } from '../../utils/date';
import { useAuth } from '../../context/AuthContext';

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
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  const addMenuRef = useRef(null);
  const notifMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  // Responsive mobile width listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdowns on outside click or tap
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target)) {
        setShowAddMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3.5 py-2.5 sm:px-6 sm:py-3.5 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-7xl mx-auto">
        
        {/* Left: Active Period Picker & Subtitle (shrink-0 prevents overlapping) */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100/90 hover:bg-slate-200/70 transition-colors px-2 py-1.5 sm:px-3 rounded-xl border border-slate-200 text-slate-800">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 shrink-0" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent font-semibold text-xs sm:text-sm text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {isMobile ? m.short : m.name}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent font-semibold text-xs sm:text-sm text-slate-800 focus:outline-none cursor-pointer border-l border-slate-300 pl-1.5 sm:pl-2"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>
          </div>
          <span className="hidden xl:inline-block text-xs font-medium text-slate-400 truncate">
            Financial Dashboard
          </span>
        </div>

        {/* Right: Actions & Notifications */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Desktop Full Action Buttons (visible on lg screens and up) */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Quick Action: Add Expense */}
            <button
              onClick={() => onOpenTransactionModal('expense')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200 transition-all shadow-xs"
            >
              <ArrowDownLeft className="w-3.5 h-3.5 text-rose-600" />
              <span>Add Expense</span>
            </button>

            {/* Quick Action: Add Income */}
            <button
              onClick={() => onOpenTransactionModal('income')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs rounded-xl border border-emerald-200 transition-all shadow-xs"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
              <span>Add Income</span>
            </button>

            {/* Quick Action: Add Salary */}
            <button
              onClick={onOpenSalaryModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl border border-indigo-200 transition-all shadow-xs"
            >
              <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
              <span>Salary</span>
            </button>

            {/* Quick Action: Add Budget */}
            <button
              onClick={onOpenBudgetModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold text-xs rounded-xl border border-amber-200 transition-all shadow-xs"
            >
              <Target className="w-3.5 h-3.5 text-amber-600" />
              <span>Budget</span>
            </button>
          </div>

          {/* Mobile / Tablet Compact '+ Add' Dropdown */}
          <div ref={addMenuRef} className="lg:hidden relative">
            <button
              onClick={() => {
                setShowAddMenu(!showAddMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm shadow-emerald-500/20 transition-all active:scale-95"
              title="Quick Actions"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showAddMenu ? 'rotate-180' : ''}`} />
            </button>

            {showAddMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-1.5 z-50 animate-fade-in divide-y divide-slate-100">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Quick Actions
                </div>

                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setShowAddMenu(false);
                      onOpenTransactionModal('expense');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-xl transition-colors text-left"
                  >
                    <div className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">Add Expense</div>
                      <div className="text-[10px] text-slate-400 font-normal">Record spending</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowAddMenu(false);
                      onOpenTransactionModal('income');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors text-left"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">Add Income</div>
                      <div className="text-[10px] text-slate-400 font-normal">Record extra earnings</div>
                    </div>
                  </button>
                </div>

                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setShowAddMenu(false);
                      onOpenSalaryModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors text-left"
                  >
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">Monthly Salary</div>
                      <div className="text-[10px] text-slate-400 font-normal">Set payroll & bonus</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowAddMenu(false);
                      onOpenBudgetModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 rounded-xl transition-colors text-left"
                  >
                    <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                      <Target className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">Category Budget</div>
                      <div className="text-[10px] text-slate-400 font-normal">Set spending limits</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown (Always visible on the far right) */}
          <div ref={notifMenuRef} className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowAddMenu(false);
              }}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition-colors active:scale-95"
              title="Notifications & Alerts"
            >
              <Bell className="w-4 h-4" />
              {alerts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 px-4 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <h3 className="font-semibold text-xs text-slate-800">Financial Alerts</h3>
                  <button 
                    onClick={() => setShowNotifications(false)} 
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {alerts.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3 text-center">No active warnings. Your budget is healthy!</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
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

          {/* User Account / Sign Out Dropdown */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
                setShowAddMenu(false);
              }}
              className="flex items-center gap-2 p-1 sm:pl-2 sm:pr-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all text-left"
              title="User Account & Settings"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden md:block leading-tight">
                <p className="text-xs font-bold text-slate-800 truncate max-w-[90px]">{user?.name || 'Admin User'}</p>
                <p className="text-[10px] text-slate-400">Account</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 px-3 z-50 animate-fade-in space-y-2">
                <div className="px-2 py-1.5 border-b border-slate-100">
                  <div className="font-bold text-xs text-slate-900">{user?.name || 'Admin User'}</div>
                  <div className="text-[11px] text-slate-500 truncate">{user?.email || 'admin@salarytracker.com'}</div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
                    <Shield className="w-3 h-3" />
                    <span>Role: {user?.role || 'Admin'}</span>
                  </div>
                </div>

                <div className="px-2 py-1 text-[11px] text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Currency:</span>
                    <span className="font-semibold text-slate-800">{user?.currency || '₹'} (INR)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Savings Goal:</span>
                    <span className="font-semibold text-slate-800">₹{(user?.savings_target || 25000).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
