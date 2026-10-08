import React from 'react';
import { 
  LayoutDashboard, 
  DollarSign, 
  ArrowLeftRight, 
  PieChart, 
  Target, 
  FileText, 
  Tags, 
  Settings, 
  LogOut,
  Database,
  CheckCircle2,
  AlertCircle,
  Download,
  Smartphone
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const Sidebar = () => {
  const { user, logout, dbStatus } = useAuth();
  const { isInstalled, installApp } = usePWAInstall();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Overview', icon: LayoutDashboard },
    { path: '/salary', label: 'Salary', icon: DollarSign },
    { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
    { path: '/expenses', label: 'Expenses', icon: PieChart },
    { path: '/budgets', label: 'Budgets', icon: Target },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/categories', label: 'Categories', icon: Tags },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-screen sticky top-0 shrink-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
          <DollarSign className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="font-bold text-base text-slate-900 leading-tight tracking-tight">Salary Tracker</h1>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">CRM Dashboard</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === '/'
            ? location.pathname === '/' || location.pathname === '/overview'
            : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* PWA Install Button (shown when running in browser) */}
      {!isInstalled && (
        <div className="px-3 mb-2">
          <button
            onClick={installApp}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-500/20 transition-all active:scale-95"
            title="Install as native mobile/desktop application"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install Web App</span>
          </button>
        </div>
      )}

      {/* Database Connection Pill */}
      <div className="px-4 py-3 mx-3 mb-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
        <div className="flex items-center justify-between font-medium">
          <span className="flex items-center gap-1.5 text-slate-700">
            <Database className="w-3.5 h-3.5 text-slate-500" />
            MongoDB
          </span>
          {dbStatus.connected ? (
            <span className="flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
              <CheckCircle2 className="w-3 h-3" /> Connected
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-600 font-semibold text-[11px]" title="Using resilient local fallback storage">
              <AlertCircle className="w-3 h-3" /> Fallback Mode
            </span>
          )}
        </div>
      </div>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">{user?.name || 'Admin User'}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.email || 'admin@crm.com'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          title="Sign out"
          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
