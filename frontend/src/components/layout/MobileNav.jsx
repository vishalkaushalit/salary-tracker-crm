import React from 'react';
import { LayoutDashboard, ArrowLeftRight, Plus, FileText, Settings } from 'lucide-react';

export const MobileNav = ({ activeTab, setActiveTab, onOpenQuickAdd }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-2 px-4 flex items-center justify-around z-30 shadow-lg">
      <button
        onClick={() => setActiveTab('overview')}
        className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
          activeTab === 'overview' ? 'text-emerald-600' : 'text-slate-500'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => setActiveTab('transactions')}
        className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
          activeTab === 'transactions' ? 'text-emerald-600' : 'text-slate-500'
        }`}
      >
        <ArrowLeftRight className="w-5 h-5" />
        <span>Transactions</span>
      </button>

      {/* Central Add Action Button */}
      <button
        onClick={onOpenQuickAdd}
        className="w-11 h-11 -mt-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>

      <button
        onClick={() => setActiveTab('reports')}
        className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
          activeTab === 'reports' ? 'text-emerald-600' : 'text-slate-500'
        }`}
      >
        <FileText className="w-5 h-5" />
        <span>Reports</span>
      </button>

      <button
        onClick={() => setActiveTab('settings')}
        className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
          activeTab === 'settings' ? 'text-emerald-600' : 'text-slate-500'
        }`}
      >
        <Settings className="w-5 h-5" />
        <span>Settings</span>
      </button>
    </div>
  );
};
