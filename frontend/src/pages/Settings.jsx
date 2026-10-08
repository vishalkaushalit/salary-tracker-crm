import React, { useState } from 'react';
import { 
  User, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  RefreshCw,
  Smartphone,
  Download,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { api } from '../services/api';

export const Settings = ({ onDataReloaded }) => {
  const { user, updateUserProfile, dbStatus, checkDbStatus } = useAuth();
  const { isInstalled, installApp } = usePWAInstall();

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

      {/* Progressive Web App (PWA) Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Progressive Web App (PWA) & Mobile App</h3>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
            isInstalled 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
          }`}>
            {isInstalled ? '✓ Installed as Standalone App' : 'Browser Web Mode'}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Salary Tracker is built with a complete <strong>Web App Manifest</strong> and <strong>Service Worker</strong> caching layer. You can install it on iOS, Android, macOS, or Windows to use it with a native full-screen experience and offline shell caching.
        </p>

        {!isInstalled ? (
          <div className="p-4 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-xl border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-xs text-emerald-950">Install on this device</p>
              <p className="text-[11px] text-emerald-700">Add icon to your Home Screen or Dock with one tap</p>
            </div>
            <button
              onClick={installApp}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all shrink-0 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Install Web App</span>
            </button>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>App is currently running in standalone PWA mode!</span>
          </div>
        )}

        {/* Installation Instructions by Platform */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1.5">
            <p className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-slate-200 flex items-center justify-center text-[10px]">🍎</span>
              <span>iOS / Safari</span>
            </p>
            <ol className="text-[11px] text-slate-600 list-decimal list-inside space-y-1 leading-snug">
              <li>Open this site in <strong>Safari</strong></li>
              <li>Tap the <strong>Share</strong> button (<Share2 className="w-3 h-3 inline text-slate-500" />)</li>
              <li>Scroll down & tap <strong>"Add to Home Screen"</strong></li>
            </ol>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1.5">
            <p className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-slate-200 flex items-center justify-center text-[10px]">🤖</span>
              <span>Android / Chrome</span>
            </p>
            <ol className="text-[11px] text-slate-600 list-decimal list-inside space-y-1 leading-snug">
              <li>Open this site in <strong>Chrome</strong></li>
              <li>Tap the 3 dots <strong>(⋮) menu</strong></li>
              <li>Tap <strong>"Install app"</strong> or "Add to Home Screen"</li>
            </ol>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1.5">
            <p className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-slate-200 flex items-center justify-center text-[10px]">💻</span>
              <span>Desktop (Chrome / Edge)</span>
            </p>
            <ol className="text-[11px] text-slate-600 list-decimal list-inside space-y-1 leading-snug">
              <li>Look at the top URL address bar</li>
              <li>Click the <strong>Install</strong> icon (<Download className="w-3 h-3 inline text-slate-500" />) on the right</li>
              <li>Click <strong>Install</strong> to add to Apps/Dock</li>
            </ol>
          </div>
        </div>
      </div>

    </div>
  );
};

