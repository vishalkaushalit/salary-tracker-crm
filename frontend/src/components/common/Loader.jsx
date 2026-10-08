import React, { useState, useEffect } from 'react';
import { Wallet, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

const FINANCIAL_TIPS = [
  'Tracking every rupee is the first step to financial freedom.',
  'Aim to save at least 20% to 30% of your net monthly salary.',
  'Categorizing expenses helps identify hidden spending leaks.',
  'Synchronizing your latest salary and monthly budgets...'
];

export const Loader = ({ 
  message = 'Loading Salary Tracker CRM...', 
  subMessage,
  variant = 'page', // 'fullscreen' | 'page' | 'inline'
  size = 'md'       // 'sm' | 'md' | 'lg'
}) => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % FINANCIAL_TIPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const activeSubMessage = subMessage || FINANCIAL_TIPS[tipIndex];

  // Inline small loader
  if (variant === 'inline') {
    return (
      <div className="flex items-center justify-center gap-2.5 text-xs text-slate-500 font-medium py-2 px-3">
        <div className="relative w-4 h-4 shrink-0">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        </div>
        <span>{message}</span>
      </div>
    );
  }

  // Fullscreen loader (used during initial app / auth boot)
  if (variant === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-[99999] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center p-4">
        {/* Ambient atmospheric glows */}
        <div className="absolute w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none -top-12 -left-12 animate-pulse-glow" />
        <div className="absolute w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none -bottom-12 -right-12 animate-pulse-glow" style={{ animationDelay: '1s' }} />

        {/* Floating Glassmorphic Card */}
        <div className="relative z-10 max-w-sm w-full bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center animate-fade-in">
          
          {/* Dual Orbital Ring Spinner with Center Rupee Symbol */}
          <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
            {/* Outer gradient rotating ring */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400 border-r-teal-400 border-b-cyan-500 animate-spin-slow shadow-lg shadow-emerald-500/20" />
            
            {/* Inner counter-rotating ring */}
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-indigo-400 border-l-purple-400 animate-spin-reverse opacity-80" />
            
            {/* Central pulsing glow disc */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-xl shadow-emerald-500/40 relative transform active:scale-95 transition-transform animate-pulse-glow">
              <span className="text-2xl font-black font-sans tracking-tight">₹</span>
            </div>
          </div>

          {/* Brand & Status Text */}
          <div className="space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold tracking-wider uppercase">
              <Sparkles className="w-3 h-3 animate-spin" />
              <span>Salary Tracker CRM</span>
            </div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">{message}</h2>
            <p className="text-xs text-slate-400 transition-all duration-300 min-h-[32px] px-2 leading-relaxed">
              {activeSubMessage}
            </p>
          </div>

          {/* Shimmer progress bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden relative">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-500 rounded-full w-1/2 animate-shimmer" />
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/80" />
            <span>Secure Enterprise Workspace</span>
          </div>
        </div>
      </div>
    );
  }

  // Page-level loader (inside CRM layout)
  return (
    <div className="min-h-[420px] w-full flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="relative flex flex-col items-center text-center max-w-sm">
        
        {/* Orbital Spinner */}
        <div className="relative w-20 h-20 mb-5 flex items-center justify-center">
          {/* Subtle back ring */}
          <div className="absolute inset-0 rounded-full border-[3px] border-emerald-100" />
          {/* Active spinning ring with gradient */}
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-emerald-500 border-r-teal-500 animate-spin shadow-sm" />
          {/* Inner counter-spinning dashed ring */}
          <div className="absolute inset-2 rounded-full border border-dashed border-indigo-300 animate-spin-reverse opacity-70" />
          
          {/* Center Rupee Icon Badge */}
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner font-extrabold text-lg animate-pulse-glow">
            ₹
          </div>
        </div>

        {/* Text Details */}
        <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-1">
          {message}
        </h3>
        <p className="text-xs text-slate-500 transition-all duration-300 min-h-[20px] max-w-xs leading-relaxed mb-4">
          {activeSubMessage}
        </p>

        {/* Minimal sleek loader bar */}
        <div className="w-48 bg-slate-100 rounded-full h-1 overflow-hidden relative">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-1/2 animate-shimmer" />
        </div>
      </div>
    </div>
  );
};
