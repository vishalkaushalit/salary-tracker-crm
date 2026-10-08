const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('salary_crm_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(errorData.message || 'Request failed');
  }
  return res.json();
};

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },
  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },
  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
  updateProfile: async (profileData) => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(res);
  },
  getStatus: async () => {
    const res = await fetch(`${API_BASE}/auth/status`);
    return handleResponse(res);
  },

  // Salaries
  getSalaries: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/salaries?${q}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
  saveSalary: async (data) => {
    const salaryId = data._id || data.id;
    if (salaryId) {
      return api.updateSalary(salaryId, data);
    }
    const res = await fetch(`${API_BASE}/salaries`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateSalary: async (id, data) => {
    const res = await fetch(`${API_BASE}/salaries/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  duplicateSalary: async (targetMonth, targetYear) => {
    const res = await fetch(`${API_BASE}/salaries/duplicate-previous`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ targetMonth, targetYear }),
    });
    return handleResponse(res);
  },
  deleteSalary: async (id) => {
    const res = await fetch(`${API_BASE}/salaries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Transactions
  getTransactions: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/transactions?${q}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
  createTransaction: async (data) => {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateTransaction: async (id, data) => {
    const res = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteTransaction: async (id) => {
    const res = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
  bulkDeleteTransactions: async (ids) => {
    const res = await fetch(`${API_BASE}/transactions/bulk-delete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids }),
    });
    return handleResponse(res);
  },

  // Categories
  getCategories: async () => {
    const res = await fetch(`${API_BASE}/categories`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
  createCategory: async (data) => {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  saveCategory: async (data) => {
    const id = data._id || data.id;
    if (id) {
      return api.updateCategory(id, data);
    }
    return api.createCategory(data);
  },
  updateCategory: async (id, data) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteCategory: async (id) => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Budgets
  getBudgets: async (month, year) => {
    const res = await fetch(`${API_BASE}/budgets?month=${month}&year=${year}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
  saveBudget: async (data) => {
    const budgetId = data._id || data.id;
    if (budgetId) {
      return api.updateBudget(budgetId, data);
    }
    const res = await fetch(`${API_BASE}/budgets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateBudget: async (id, data) => {
    const res = await fetch(`${API_BASE}/budgets/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteBudget: async (id) => {
    const res = await fetch(`${API_BASE}/budgets/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Dashboard
  getDashboardSummary: async (month, year) => {
    const res = await fetch(`${API_BASE}/dashboard/summary?month=${month}&year=${year}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
  getDashboardMonthly: async (year) => {
    const res = await fetch(`${API_BASE}/dashboard/monthly?year=${year}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
  getCategoryExpenses: async (month, year) => {
    const res = await fetch(`${API_BASE}/dashboard/category-expenses?month=${month}&year=${year}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
  getDailyExpenses: async (month, year) => {
    const res = await fetch(`${API_BASE}/dashboard/daily-expenses?month=${month}&year=${year}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Reports
  getComparison: async (monthA, yearA, monthB, yearB) => {
    const res = await fetch(`${API_BASE}/reports/compare?monthA=${monthA}&yearA=${yearA}&monthB=${monthB}&yearB=${yearB}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
  getExportCsvUrl: (month, year) => {
    const token = localStorage.getItem('salary_crm_token');
    return `${API_BASE}/reports/export-csv?month=${month}&year=${year}&token=${token}`;
  },

  // Seed demo
  seedDemo: async () => {
    const res = await fetch(`${API_BASE}/seed`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  }
};
