export const formatCurrency = (amount, symbol = '₹') => {
  if (amount === undefined || amount === null || isNaN(amount)) return `${symbol}0`;
  const num = Math.round(Number(amount));
  return `${symbol}${num.toLocaleString('en-IN')}`;
};

export const formatPercentage = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0%';
  return `${Number(val).toFixed(1)}%`;
};
