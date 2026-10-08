import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  TrendingUp, 
  PiggyBank, 
  PieChart,
  User,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('admin@salarytracker.com');
    setPassword('admin123');
    setLoading(true);
    setError('');
    try {
      await login('admin@salarytracker.com', 'admin123');
      navigate('/');
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none -top-24 -left-24 animate-pulse-glow" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none -bottom-24 -right-24 animate-pulse-glow" style={{ animationDelay: '1.2s' }} />

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl w-full bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-fade-in">
        
        {/* Left Feature & Branding Showcase (5 cols) */}
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
                  CRM Cloud
                </span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-3">
              Master Your Money, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Every Single Month.
              </span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Track ₹30,000 monthly payrolls, monitor Recharges, Medicines, Food & Transportation, and stay on top of budget targets.
            </p>

            {/* Feature List */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span>Monthly Salary & Net Payroll Tracking</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300">
                <div className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <PieChart className="w-3.5 h-3.5" />
                </div>
                <span>7 Essential Expense Categories & Analytics</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <PiggyBank className="w-3.5 h-3.5" />
                </div>
                <span>Automated Budget Alerts & Savings Goals</span>
              </div>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted with JWT & MongoDB Atlas</span>
          </div>
        </div>

        {/* Right Form Card (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-slate-900/40">
          
          {/* Header Segmented Switcher */}
          <div className="flex sm:flex-column items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Welcome Back</h3>
              <p className="text-xs text-slate-400">Sign in to access your financial dashboard</p>
            </div>
            {/* Tabs */}
            <div className="flex p-1 bg-slate-800/80 rounded-xl border border-white/5 text-xs font-semibold">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white shadow-sm font-bold">
                Sign In
              </span>
              <Link
                to="/register"
                onClick={onSwitchToRegister}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                Register
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="admin@salarytracker.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs text-white bg-slate-800/80 border border-slate-700/80 rounded-xl focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-[0.99] disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Demo Login */}
          <div className="pt-4 mt-4 border-t border-slate-800 space-y-3">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span>1-Click Demo Login (Admin Access)</span>
            </button>

            <div className="text-center text-xs text-slate-400">
              Need a new account?{' '}
              <Link
                to="/register"
                onClick={onSwitchToRegister}
                className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
              >
                Create an account
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
