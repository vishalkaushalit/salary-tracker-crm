import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatCurrency } from '../../utils/currency';

export const DailySpendingChart = ({ data = [], currency = '₹' }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Daily Spending</h3>
          <p className="text-xs text-slate-500">Identify high-spending spikes across the month</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} interval={2} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `${currency}${val}`} />
            <Tooltip
              formatter={(value) => [formatCurrency(value, currency), 'Daily Spent']}
              contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#6366f1"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }}
              activeDot={{ r: 6, stroke: '#818cf8', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
