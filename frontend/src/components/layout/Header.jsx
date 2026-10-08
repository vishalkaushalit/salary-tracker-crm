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
  Shield,
  CheckCircle2,
  Settings as SettingsIcon,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
  const { user, logout, loginNotification, notifications = [], dismissNotification } = useAuth();
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

  const totalNotifsCount = alerts.length + (notifications?.length || 0);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3.5 py-2.5 sm:px-5 lg:px-6 sm:py-3 sticky top-0 z-30 shadow-xs relative">
      
      {/* Floating Login / Auth Success Toast Banner */}
      {loginNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-start gap-3 animate-fade-in ring-1 ring-emerald-500/20">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{loginNotification.title}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </p>
              <span className="text-[10px] text-slate-400">{loginNotification.time}</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-snug">{loginNotification.message}</p>
          </div>
          <button
            onClick={dismissNotification}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors ml-1"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-7xl mx-auto w-full">
        
        {/* Left: Mobile shows Logo, Desktop shows Active Period Picker & Subtitle */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Mobile Logo: Only visible on mobile screens (< md) */}
          <Link to="/" className="flex items-center gap-2.5 md:hidden group" title="Salary Tracker Dashboard">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <DollarSign className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 leading-tight tracking-tight">Salary Tracker</div>
              <div className="text-[9px] font-semibold tracking-wider uppercase text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded w-fit leading-tight">CRM Dashboard</div>
            </div>
          </Link>

          {/* Desktop Active Period Picker & Subtitle (Hidden on mobile < md, visible on md and up) */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100/90 hover:bg-slate-200/70 transition-colors px-2 py-1.5 sm:px-3 rounded-xl border border-slate-200 text-slate-800">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 shrink-0" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-transparent font-semibold text-xs sm:text-sm text-slate-800 focus:outline-none cursor-pointer pr-1"
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
                className="bg-transparent font-semibold text-xs sm:text-sm text-slate-800 focus:outline-none cursor-pointer border-l border-slate-300 pl-1.5 sm:pl-2"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
              </select>
            </div>
            <span className="hidden 2xl:inline-block text-xs font-medium text-slate-400 truncate">
              Financial Dashboard
            </span>
          </div>
        </div>

        {/* Right: Actions, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Quick '+ Add' Dropdown (Clean responsive pill button replacing cramped individual buttons) */}
          <div ref={addMenuRef} className="hidden md:block relative">
            <button
              onClick={() => {
                setShowAddMenu(!showAddMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-full shadow-sm shadow-emerald-500/25 transition-all active:scale-95"
              title="Add Transaction, Salary, or Budget"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add</span>
              <ChevronDown className={`w-3.5 h-3.5 stroke-[2.5] transition-transform duration-200 ${showAddMenu ? 'rotate-180' : ''}`} />
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

          {/* Notifications Dropdown (Bell icon with badge) */}
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
              {totalNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 px-4 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-emerald-600" />
                    <h3 className="font-bold text-xs text-slate-800">Notifications & Alerts</h3>
                  </div>
                  <button 
                    onClick={() => setShowNotifications(false)} 
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {/* Session / Login Notifications */}
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl text-xs bg-emerald-50/70 text-emerald-900 border border-emerald-100 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-[11px] text-emerald-950">{n.title}</p>
                          <span className="text-[10px] text-emerald-600">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-emerald-800 mt-0.5">{n.message}</p>
                      </div>
                    </div>
                  ))}

                  {/* Financial Budget Alerts */}
                  {alerts.map((a, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl text-xs flex items-start gap-2.5 ${
                        a.type === 'danger'
                          ? 'bg-rose-50 text-rose-800 border border-rose-100'
                          : 'bg-amber-50 text-amber-800 border border-amber-100'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight">{a.message}</span>
                    </div>
                  ))}

                  {totalNotifsCount === 0 && (
                    <div className="py-6 text-center text-slate-400 text-xs">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1 opacity-70" />
                      <p className="font-semibold text-slate-600">All caught up!</p>
                      <p className="text-[10px]">No unread alerts or warnings.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile in Header Right Side */}
          <div ref={userMenuRef} className="relative shrink-0">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
                setShowAddMenu(false);
              }}
              className="flex items-center gap-1.5 sm:gap-2 p-1 sm:px-2 sm:py-1 rounded-full sm:rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 transition-all text-left shadow-2xs group shrink-0"
              title="User Profile & Account Menu"
            >
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full sm:rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                {/* Active online green indicator dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
              </div>

              {/* Full profile info: shown on 2xl ultra-wide screens */}
              <div className="hidden 2xl:block leading-tight max-w-[110px]">
                <p className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-700 transition-colors">
                  {user?.name || 'Admin User'}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400 capitalize">{user?.role || 'Admin'}</span>
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-emerald-600 font-semibold">Active</span>
                </div>
              </div>

              {/* Compact single name: shown only on xl screens */}
              <span className="hidden xl:inline 2xl:hidden text-xs font-bold text-slate-800 truncate max-w-[85px] group-hover:text-emerald-700 transition-colors">
                {user?.name?.split(' ')[0] || 'Admin'}
              </span>

              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180 text-emerald-600' : ''} shrink-0`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 px-3 z-50 animate-fade-in space-y-2">
                <div className="px-2 py-1.5 border-b border-slate-100 flex items-start justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{user?.name || 'Admin User'}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[170px]">{user?.email || 'admin@salarytracker.com'}</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                    Online
                  </span>
                </div>

                <div className="px-2 py-1 text-[11px] text-slate-500 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span>Currency:</span>
                    <span className="font-bold text-slate-800">{user?.currency || '₹'} (INR)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Monthly Savings Goal:</span>
                    <span className="font-bold text-emerald-700">₹{(user?.savings_target || 25000).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <SettingsIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>Profile & Settings</span>
                  </Link>

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

      {/* Mobile Month/Year Picker: Displayed below on mobile (< md) */}
      <div className="md:hidden mt-2 pt-2 border-t border-slate-100 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 bg-slate-100/90 hover:bg-slate-200/70 transition-colors px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800 justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Calendar className="w-4 h-4 text-slate-600 shrink-0" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent font-semibold text-xs sm:text-sm text-slate-800 focus:outline-none cursor-pointer flex-1"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center border-l border-slate-300 pl-2 shrink-0">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent font-semibold text-xs sm:text-sm text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
