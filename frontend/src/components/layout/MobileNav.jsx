import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Plus, FileText, Settings } from 'lucide-react';

export const MobileNav = ({ onOpenQuickAdd }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '/overview';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-2 px-4 flex items-center justify-around z-30 shadow-lg">
      <Link
        to="/"
        className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
          isActive('/') ? 'text-emerald-600 font-semibold' : 'text-slate-500'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span>Home</span>
      </Link>

      <Link
        to="/transactions"
        className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
          isActive('/transactions') ? 'text-emerald-600 font-semibold' : 'text-slate-500'
        }`}
      >
        <ArrowLeftRight className="w-5 h-5" />
        <span>Transactions</span>
      </Link>

      {/* Central Add Action Button */}
      <button
        onClick={onOpenQuickAdd}
        className="w-11 h-11 -mt-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>

      <Link
        to="/reports"
        className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
          isActive('/reports') ? 'text-emerald-600 font-semibold' : 'text-slate-500'
        }`}
      >
        <FileText className="w-5 h-5" />
        <span>Reports</span>
      </Link>

      <Link
        to="/settings"
        className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
          isActive('/settings') ? 'text-emerald-600 font-semibold' : 'text-slate-500'
        }`}
      >
        <Settings className="w-5 h-5" />
        <span>Settings</span>
      </Link>
    </div>
  );
};

