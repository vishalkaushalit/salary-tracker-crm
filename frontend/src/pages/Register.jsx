import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  TrendingUp, 
  Target, 
  Wallet 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Register = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    currency: '₹',
    savings_target: 25000
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none -top-24 -right-24 animate-pulse-glow" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none -bottom-24 -left-24 animate-pulse-glow" style={{ animationDelay: '1.2s' }} />

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl w-full bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-fade-in my-6">
        
        {/* Left Feature & Benefits Showcase (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950/70 via-slate-900/80 to-slate-950 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-500/30">
                ₹
              </div>
              <div>
                <h1 className="font-extrabold text-base text-white tracking-tight leading-tight">Salary Tracker</h1>
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  New Account
                </span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-3">
              Start Tracking with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Zero Friction.
              </span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Create your account in seconds. Includes pre-configured ₹30,000 monthly salary tracking and 7 essential spending categories.
            </p>

            {/* Starter Package Perks */}
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-white">₹30,000 Initial Monthly Salary</span>
                  <span className="text-slate-400 text-[11px]">Ready for instant calculations & cashflow trends</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-300">
                <div className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-white">7 Clean Expense Categories</span>
                  <span className="text-slate-400 text-[11px]">Recharges, Medicines, Food, Transportation & more</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-300">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-white">Personal Savings Targets</span>
                  <span className="text-slate-400 text-[11px]">Dynamic savings rate and budget overspend alerts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted passwords with secure cloud backup</span>
          </div>
        </div>

        {/* Right Registration Form (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-slate-900/40">
          
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Create Account</h3>
            <p className="text-xs text-slate-400">Join Salary Tracker CRM in 30 seconds</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Vishal Kaushal"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs text-white bg-slate-800/80 border border-slate-700/80 rounded-xl focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs text-white bg-slate-800/80 border border-slate-700/80 rounded-xl focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 text-xs text-white bg-slate-800/80 border border-slate-700/80 rounded-xl focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-200 absolute right-3 top-2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs text-white bg-slate-800/80 border border-slate-700/80 rounded-xl focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold cursor-pointer"
                >
                  <option value="₹">₹ (INR - Indian Rupee)</option>
                  <option value="$">$ (USD - US Dollar)</option>
                  <option value="€">€ (EUR - Euro)</option>
                  <option value="£">£ (GBP - British Pound)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Savings Goal (₹)</label>
                <input
                  type="number"
                  value={formData.savings_target}
                  onChange={(e) => setFormData({ ...formData, savings_target: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 text-xs text-white bg-slate-800/80 border border-slate-700/80 rounded-xl focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-[0.99] disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account & Start Tracking'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 mt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              onClick={onSwitchToLogin}
              className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
            >
              Sign In to existing workspace
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
