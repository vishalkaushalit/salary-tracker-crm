const bcrypt = require('bcryptjs');

const defaultCategories = [
  { id: 'cat-1', name: 'Food', icon: 'Utensils', type: 'expense', color: '#f59e0b', is_default: true, subcategories: ['Restaurants', 'Fast Food', 'Coffee'] },
  { id: 'cat-2', name: 'Groceries', icon: 'ShoppingCart', type: 'expense', color: '#10b981', is_default: true, subcategories: ['Supermarket', 'Fruits & Vegetables'] },
  { id: 'cat-3', name: 'Rent', icon: 'Home', type: 'expense', color: '#6366f1', is_default: true, subcategories: ['Apartment', 'Maintenance'] },
  { id: 'cat-4', name: 'Utilities', icon: 'Zap', type: 'expense', color: '#eab308', is_default: true, subcategories: ['Electricity', 'Water', 'Gas'] },
  { id: 'cat-5', name: 'Transportation', icon: 'Car', type: 'expense', color: '#3b82f6', is_default: true, subcategories: ['Fuel', 'Uber', 'Public Transport'] },
  { id: 'cat-6', name: 'Fuel', icon: 'Fuel', type: 'expense', color: '#0ea5e9', is_default: true, subcategories: ['Petrol', 'Diesel'] },
  { id: 'cat-7', name: 'Shopping', icon: 'ShoppingBag', type: 'expense', color: '#ec4899', is_default: true, subcategories: ['Clothes', 'Electronics', 'Footwear'] },
  { id: 'cat-8', name: 'Entertainment', icon: 'Film', type: 'expense', color: '#8b5cf6', is_default: true, subcategories: ['Movies', 'Games', 'Concerts'] },
  { id: 'cat-9', name: 'Healthcare', icon: 'HeartPulse', type: 'expense', color: '#ef4444', is_default: true, subcategories: ['Doctor', 'Pharmacy', 'Tests'] },
  { id: 'cat-10', name: 'Education', icon: 'GraduationCap', type: 'expense', color: '#14b8a6', is_default: true, subcategories: ['Courses', 'Books', 'Tuition'] },
  { id: 'cat-11', name: 'Subscriptions', icon: 'Tv', type: 'expense', color: '#a855f7', is_default: true, subcategories: ['Netflix', 'Spotify', 'Software'] },
  { id: 'cat-12', name: 'Travel', icon: 'Plane', type: 'expense', color: '#f97316', is_default: true, subcategories: ['Flights', 'Hotels', 'Vacation'] },
  { id: 'cat-13', name: 'Bills', icon: 'FileText', type: 'expense', color: '#64748b', is_default: true, subcategories: ['Internet', 'Mobile Recharge', 'Credit Card'] },
  { id: 'cat-14', name: 'EMI', icon: 'CreditCard', type: 'expense', color: '#d946ef', is_default: true, subcategories: ['Home Loan', 'Car Loan', 'Personal Loan'] },
  { id: 'cat-15', name: 'Insurance', icon: 'ShieldCheck', type: 'expense', color: '#06b6d4', is_default: true, subcategories: ['Health', 'Life', 'Vehicle'] },
  { id: 'cat-16', name: 'Personal', icon: 'User', type: 'expense', color: '#84cc16', is_default: true, subcategories: ['Salon', 'Grooming', 'Gym'] },
  { id: 'cat-17', name: 'Other', icon: 'HelpCircle', type: 'expense', color: '#94a3b8', is_default: true, subcategories: ['Miscellaneous'] },
  { id: 'cat-18', name: 'Salary', icon: 'DollarSign', type: 'income', color: '#10b981', is_default: true, subcategories: ['Monthly Salary', 'Bonus'] },
  { id: 'cat-19', name: 'Investments', icon: 'TrendingUp', type: 'income', color: '#059669', is_default: true, subcategories: ['Dividends', 'Interest'] }
];

const mockStore = {
  users: [
    {
      _id: 'user-admin-1',
      id: 'user-admin-1',
      name: 'Admin User',
      email: 'admin@salarytracker.com',
      password: bcrypt.hashSync('admin123', 10),
      phone: '+91 98765 43210',
      currency: '₹',
      savings_target: 25000,
      profile_image: '',
      role: 'admin',
      created_at: new Date('2026-05-01')
    }
  ],
  categories: [...defaultCategories],
  salaries: [
    {
      _id: 'sal-1',
      id: 'sal-1',
      user_id: 'user-admin-1',
      month: 5,
      year: 2026,
      base_salary: 50000,
      bonus: 0,
      commission: 0,
      other_income: 0,
      tax: 0,
      deductions: 0,
      net_salary: 50000,
      payment_date: '2026-05-01',
      notes: 'May standard salary',
      created_at: new Date('2026-05-01')
    },
    {
      _id: 'sal-2',
      id: 'sal-2',
      user_id: 'user-admin-1',
      month: 6,
      year: 2026,
      base_salary: 50000,
      bonus: 0,
      commission: 0,
      other_income: 0,
      tax: 0,
      deductions: 0,
      net_salary: 50000,
      payment_date: '2026-06-01',
      notes: 'June salary',
      created_at: new Date('2026-06-01')
    },
    {
      _id: 'sal-3',
      id: 'sal-3',
      user_id: 'user-admin-1',
      month: 7,
      year: 2026,
      base_salary: 52000,
      bonus: 0,
      commission: 0,
      other_income: 0,
      tax: 0,
      deductions: 0,
      net_salary: 52000,
      payment_date: '2026-07-01',
      notes: 'July salary appraisal',
      created_at: new Date('2026-07-01')
    },
    {
      _id: 'sal-4',
      id: 'sal-4',
      user_id: 'user-admin-1',
      month: 8,
      year: 2026,
      base_salary: 52000,
      bonus: 0,
      commission: 0,
      other_income: 0,
      tax: 0,
      deductions: 0,
      net_salary: 52000,
      payment_date: '2026-08-01',
      notes: 'August salary',
      created_at: new Date('2026-08-01')
    },
    {
      _id: 'sal-5',
      id: 'sal-5',
      user_id: 'user-admin-1',
      month: 9,
      year: 2026,
      base_salary: 52000,
      bonus: 0,
      commission: 0,
      other_income: 0,
      tax: 0,
      deductions: 0,
      net_salary: 52000,
      payment_date: '2026-09-01',
      notes: 'September salary',
      created_at: new Date('2026-09-01')
    },
    {
      _id: 'sal-6',
      id: 'sal-6',
      user_id: 'user-admin-1',
      month: 10,
      year: 2026,
      base_salary: 45000,
      bonus: 3000,
      commission: 0,
      other_income: 2000,
      tax: 0,
      deductions: 0,
      net_salary: 50000,
      payment_date: '2026-10-01',
      notes: 'October 2026 festive salary + bonus',
      created_at: new Date('2026-10-01')
    }
  ],
  budgets: [
    { _id: 'b-1', id: 'b-1', user_id: 'user-admin-1', category: 'Food', month: 10, year: 2026, amount: 7000 },
    { _id: 'b-2', id: 'b-2', user_id: 'user-admin-1', category: 'Transportation', month: 10, year: 2026, amount: 4500 },
    { _id: 'b-3', id: 'b-3', user_id: 'user-admin-1', category: 'Shopping', month: 10, year: 2026, amount: 4500 },
    { _id: 'b-4', id: 'b-4', user_id: 'user-admin-1', category: 'Rent', month: 10, year: 2026, amount: 8000 },
    { _id: 'b-5', id: 'b-5', user_id: 'user-admin-1', category: 'Bills', month: 10, year: 2026, amount: 3000 },
    { _id: 'b-6', id: 'b-6', user_id: 'user-admin-1', category: 'Entertainment', month: 10, year: 2026, amount: 2000 }
  ],
  transactions: [
    // Historical Monthly totals to match PRD:
    // May: ₹22,000
    { _id: 'tx-m-1', id: 'tx-m-1', user_id: 'user-admin-1', title: 'May Expenses Total', amount: 22000, type: 'expense', category: 'Rent', payment_method: 'Bank Transfer', transaction_date: '2026-05-15T10:00:00.000Z', notes: 'Monthly total for May' },
    // Jun: ₹25,400
    { _id: 'tx-jn-1', id: 'tx-jn-1', user_id: 'user-admin-1', title: 'June Expenses Total', amount: 25400, type: 'expense', category: 'Rent', payment_method: 'Bank Transfer', transaction_date: '2026-06-15T10:00:00.000Z', notes: 'Monthly total for June' },
    // Jul: ₹21,800
    { _id: 'tx-jl-1', id: 'tx-jl-1', user_id: 'user-admin-1', title: 'July Expenses Total', amount: 21800, type: 'expense', category: 'Rent', payment_method: 'Bank Transfer', transaction_date: '2026-07-15T10:00:00.000Z', notes: 'Monthly total for July' },
    // Aug: ₹28,600
    { _id: 'tx-ag-1', id: 'tx-ag-1', user_id: 'user-admin-1', title: 'August Expenses Total', amount: 28600, type: 'expense', category: 'Rent', payment_method: 'Bank Transfer', transaction_date: '2026-08-15T10:00:00.000Z', notes: 'Monthly total for August' },
    // Sep: ₹26,300
    { _id: 'tx-sp-1', id: 'tx-sp-1', user_id: 'user-admin-1', title: 'September Expenses Total', amount: 26300, type: 'expense', category: 'Rent', payment_method: 'Bank Transfer', transaction_date: '2026-09-15T10:00:00.000Z', notes: 'Monthly total for September' },

    // October 2026 Transactions (matching PRD sum ₹28,450 exactly)
    { _id: 'tx-1', id: 'tx-1', user_id: 'user-admin-1', title: 'Dinner', description: 'Weekend dinner with friends', amount: 850, type: 'expense', category: 'Food', payment_method: 'UPI', transaction_date: '2026-10-08T20:30:00.000Z', notes: 'At cafe', account: 'HDFC Bank' },
    { _id: 'tx-2', id: 'tx-2', user_id: 'user-admin-1', title: 'Uber', description: 'Cab ride to client office', amount: 320, type: 'expense', category: 'Transportation', payment_method: 'UPI', transaction_date: '2026-10-07T14:15:00.000Z', notes: '', account: 'HDFC Bank' },
    { _id: 'tx-3', id: 'tx-3', user_id: 'user-admin-1', title: 'Grocery', description: 'Weekly vegetables and pantry', amount: 2000, type: 'expense', category: 'Food', payment_method: 'Credit Card', transaction_date: '2026-10-06T18:00:00.000Z', notes: 'Supermarket', account: 'Credit Card' },
    { _id: 'tx-4', id: 'tx-4', user_id: 'user-admin-1', title: 'Netflix', description: 'Monthly 4K subscription', amount: 649, type: 'expense', category: 'Bills', payment_method: 'Credit Card', transaction_date: '2026-10-05T09:00:00.000Z', notes: 'Recurring', account: 'Credit Card' },
    { _id: 'tx-5', id: 'tx-5', user_id: 'user-admin-1', title: 'Weekly Fuel', description: 'Full tank petrol', amount: 2100, type: 'expense', category: 'Transportation', payment_method: 'Debit Card', transaction_date: '2026-10-04T11:20:00.000Z', notes: '', account: 'ICICI Bank' },
    { _id: 'tx-6', id: 'tx-6', user_id: 'user-admin-1', title: 'Metro Recharge', description: 'Smart card recharge', amount: 300, type: 'expense', category: 'Transportation', payment_method: 'UPI', transaction_date: '2026-10-03T08:45:00.000Z', notes: '', account: 'UPI Wallet' },
    { _id: 'tx-7', id: 'tx-7', user_id: 'user-admin-1', title: 'Electricity Bill', description: 'Bescom bill October', amount: 1200, type: 'expense', category: 'Bills', payment_method: 'UPI', transaction_date: '2026-10-02T16:00:00.000Z', notes: 'Paid online', account: 'HDFC Bank' },
    { _id: 'tx-8', id: 'tx-8', user_id: 'user-admin-1', title: 'Coffee & Snacks', description: 'Breakfast snack', amount: 500, type: 'expense', category: 'Food', payment_method: 'UPI', transaction_date: '2026-10-01T10:10:00.000Z', notes: '', account: 'UPI Wallet' },
    { _id: 'tx-9', id: 'tx-9', user_id: 'user-admin-1', title: 'Apartment Rent', description: 'October monthly house rent', amount: 8000, type: 'expense', category: 'Rent', payment_method: 'Bank Transfer', transaction_date: '2026-10-10T10:00:00.000Z', notes: 'Owner account transfer', account: 'HDFC Bank' },
    { _id: 'tx-10', id: 'tx-10', user_id: 'user-admin-1', title: 'Autumn Shopping', description: 'Festive season clothing and essentials', amount: 4500, type: 'expense', category: 'Shopping', payment_method: 'Credit Card', transaction_date: '2026-10-12T17:30:00.000Z', notes: 'Lifestyle mall', account: 'Credit Card' },
    { _id: 'tx-11', id: 'tx-11', user_id: 'user-admin-1', title: 'Cinema & Outing', description: 'Weekend movie and entertainment', amount: 1500, type: 'expense', category: 'Entertainment', payment_method: 'UPI', transaction_date: '2026-10-14T21:00:00.000Z', notes: 'PVR IMAX', account: 'UPI Wallet' },
    { _id: 'tx-12', id: 'tx-12', user_id: 'user-admin-1', title: 'Internet Broadband Bill', description: 'Fiber high speed connection', amount: 901, type: 'expense', category: 'Bills', payment_method: 'UPI', transaction_date: '2026-10-15T12:00:00.000Z', notes: 'Airtel Xstream', account: 'HDFC Bank' },
    { _id: 'tx-13', id: 'tx-13', user_id: 'user-admin-1', title: 'Home Repair & Supplies', description: 'Hardware and maintenance equipment', amount: 2000, type: 'expense', category: 'Other', payment_method: 'Bank Transfer', transaction_date: '2026-10-16T15:00:00.000Z', notes: '', account: 'HDFC Bank' },
    { _id: 'tx-14', id: 'tx-14', user_id: 'user-admin-1', title: 'City Taxi Ride', description: 'Late evening cab return', amount: 480, type: 'expense', category: 'Transportation', payment_method: 'UPI', transaction_date: '2026-10-18T22:15:00.000Z', notes: '', account: 'HDFC Bank' },
    { _id: 'tx-15', id: 'tx-15', user_id: 'user-admin-1', title: 'Family Dining', description: 'Family dinner and celebration', amount: 3150, type: 'expense', category: 'Food', payment_method: 'UPI', transaction_date: '2026-10-20T20:00:00.000Z', notes: 'Special dinner', account: 'HDFC Bank' }
  ]
};

module.exports = { mockStore, defaultCategories };
