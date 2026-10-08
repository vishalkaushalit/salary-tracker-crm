import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/currency';

export const CategoryExpenseChart = ({ data = [], onCategorySelect, currency = '₹' }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Expenses by Category</h3>
          <p className="text-xs text-slate-500">Distribution of expenditures this month</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">
          Total: {formatCurrency(total, currency)}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
        {/* Donut Chart */}
        <div className="h-52 w-full sm:w-1/2 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(value, name) => [formatCurrency(value, currency), name]}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                cursor="pointer"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={(entry) => onCategorySelect && onCategorySelect(entry.name)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || '#10b981'}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase font-semibold text-slate-400">Categories</span>
            <span className="text-base font-bold text-slate-800">{data.length}</span>
          </div>
        </div>

        {/* Legend / Category List with interactive click */}
        <div className="w-full sm:w-1/2 space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {data.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => onCategorySelect && onCategorySelect(cat.name)}
              className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors text-left group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-xs font-medium text-slate-700 truncate group-hover:text-emerald-600">
                  {cat.name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-slate-900">{formatCurrency(cat.value, currency)}</span>
                <span className="text-[10px] text-slate-400 font-medium w-8 text-right">{cat.percentage}%</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
