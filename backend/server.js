const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const salaryRoutes = require('./routes/salaries');
const transactionRoutes = require('./routes/transactions');
const categoryRoutes = require('./routes/categories');
const budgetRoutes = require('./routes/budgets');
const dashboardRoutes = require('./routes/dashboard');
const reportsRoutes = require('./routes/reports');
const seedRoutes = require('./routes/seed');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/seed', seedRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const { getDbStatus } = require('./config/db');
  res.json({
    status: 'ok',
    app: 'Salary Tracker CRM API',
    version: '1.0.0',
    db: getDbStatus(),
    time: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 [Salary Tracker CRM Server] Running on http://localhost:${PORT}`);
  });
}

module.exports = app;
