import React, { useState } from 'react';
import { 
  User, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  RefreshCw 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const Settings = ({ onDataReloaded }) => {
  const { user, updateUserProfile, dbStatus, checkDbStatus } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || 'Admin User',
    phone: user?.phone || '',
    currency: user?.currency || '₹',
    savings_target: user?.savings_target || 25000
  });

  const [statusMsg, setStatusMsg] = useState('');
  const [seedMsg, setSeedMsg] = useState('');
  const [loadingSeed, setLoadingSeed] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
      setStatusMsg('Profile updated successfully!');
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSeedData = async () => {
    if (window.confirm('Populate/Reset the database with PRD October 2026 and historical test data?')) {
      try {
        setLoadingSeed(true);
        const res = await api.seedDemo();
        if (res.success) {
          setSeedMsg(res.message);
          if (onDataReloaded) onDataReloaded();
          setTimeout(() => setSeedMsg(''), 5000);
        }
      } catch (err) {
        alert(err.message);
      } finally {
        setLoadingSeed(false);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Settings & Database</h2>
        <p className="text-xs text-slate-500">Manage user preferences, currency format, and inspect MongoDB connection</p>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Profile & Currency Form */}
      <form onSubmit={handleProfileSave} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-600" />
          <span>User Profile & Financial Targets</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Currency Symbol</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="₹">₹ (INR - Indian Rupee)</option>
              <option value="$">$ (USD - US Dollar)</option>
              <option value="€">€ (EUR - Euro)</option>
              <option value="£">£ (GBP - British Pound)</option>
              <option value="AED">AED (UAE Dirham)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Savings Goal ({formData.currency})</label>
            <input
              type="number"
              value={formData.savings_target}
              onChange={(e) => setFormData({ ...formData, savings_target: Number(e.target.value) })}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>

      {/* Database Connection & Seed Data Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>MongoDB Database Status</span>
          </h3>
          <button
            onClick={checkDbStatus}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg text-xs flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
          dbStatus.connected
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : 'bg-amber-50/70 border-amber-200 text-amber-900'
        }`}>
          {dbStatus.connected ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}

          <div className="space-y-1">
            <p className="font-bold text-sm">
              {dbStatus.connected
                ? 'MongoDB Atlas Connected Successfully'
                : 'Using Local In-Memory Storage Fallback'}
            </p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {dbStatus.connected
                ? `Connected to database via backend/.env configuration. All transactions, salaries, and budgets are persisting directly to MongoDB.`
                : `To persist data directly to MongoDB, ensure your MONGODB_URI in backend/.env has your cluster credentials. The application is completely functional using resilient in-memory storage.`
              }
            </p>
          </div>
        </div>

        {/* 1-Click Demo Data Button */}
        <div className="pt-2">
          {seedMsg && (
            <div className="mb-3 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{seedMsg}</span>
            </div>
          )}

          <button
            onClick={handleSeedData}
            disabled={loadingSeed}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loadingSeed ? 'Seeding...' : 'Load / Reset PRD October 2026 Sample Data'}</span>
          </button>
          <p className="text-[11px] text-slate-400 mt-1">
            Pre-populates the exact figures specified in your PRD (₹50,000 salary, ₹28,450 expenses across 7 categories, and historical months May-Oct 2026).
          </p>
        </div>
      </div>

    </div>
  );
};
