import React from 'react';

// Comprehensive category color themes (d/f distinct colors for every category)
export const CATEGORY_THEMES = {
  'Medicines': {
    badge: 'bg-rose-50 text-rose-700 border-rose-200/90 hover:bg-rose-100/70',
    dot: 'bg-rose-500',
    iconColor: 'text-rose-600',
    name: 'Medicines'
  },
  'Recharges': {
    badge: 'bg-blue-50 text-blue-700 border-blue-200/90 hover:bg-blue-100/70',
    dot: 'bg-blue-500',
    iconColor: 'text-blue-600',
    name: 'Recharges'
  },
  'Food': {
    badge: 'bg-amber-50 text-amber-800 border-amber-200/90 hover:bg-amber-100/70',
    dot: 'bg-amber-500',
    iconColor: 'text-amber-600',
    name: 'Food'
  },
  'Entertainment': {
    badge: 'bg-purple-50 text-purple-700 border-purple-200/90 hover:bg-purple-100/70',
    dot: 'bg-purple-500',
    iconColor: 'text-purple-600',
    name: 'Entertainment'
  },
  'Transportation': {
    badge: 'bg-teal-50 text-teal-700 border-teal-200/90 hover:bg-teal-100/70',
    dot: 'bg-teal-500',
    iconColor: 'text-teal-600',
    name: 'Transportation'
  },
  'Shopping': {
    badge: 'bg-pink-50 text-pink-700 border-pink-200/90 hover:bg-pink-100/70',
    dot: 'bg-pink-500',
    iconColor: 'text-pink-600',
    name: 'Shopping'
  },
  'Others': {
    badge: 'bg-slate-100 text-slate-700 border-slate-200/90 hover:bg-slate-200/70',
    dot: 'bg-slate-400',
    iconColor: 'text-slate-500',
    name: 'Others'
  },
  'Salary': {
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/90 hover:bg-emerald-100/70',
    dot: 'bg-emerald-500',
    iconColor: 'text-emerald-600',
    name: 'Salary'
  },
  'Investments': {
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/90 hover:bg-indigo-100/70',
    dot: 'bg-indigo-500',
    iconColor: 'text-indigo-600',
    name: 'Investments'
  }
};

export const getCategoryTheme = (category) => {
  if (!category) return CATEGORY_THEMES['Others'];
  const matched = CATEGORY_THEMES[category];
  if (matched) return matched;

  // Case-insensitive fallback
  const catLower = category.toLowerCase().trim();
  for (const [key, value] of Object.entries(CATEGORY_THEMES)) {
    if (key.toLowerCase() === catLower) return value;
  }

  // Fallback styling
  return {
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    iconColor: 'text-slate-500',
    name: category
  };
};

export const CategoryBadge = ({ category, showDot = true, size = 'sm', className = '' }) => {
  const theme = getCategoryTheme(category);
  const sizeClasses = size === 'xs' 
    ? 'text-[10px] px-2 py-0.5' 
    : size === 'md'
    ? 'text-xs px-3 py-1 font-semibold'
    : 'text-[11px] px-2.5 py-0.5 font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-colors ${theme.badge} ${sizeClasses} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${theme.dot}`} />
      )}
      <span className="truncate">{category || 'Others'}</span>
    </span>
  );
};
