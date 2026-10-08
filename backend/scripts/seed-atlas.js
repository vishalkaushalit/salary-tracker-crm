/**
 * Script to automatically connect to MongoDB Atlas and populate 'salary-tracker' database
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Salary = require('../models/Salary');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const Budget = require('../models/Budget');
const { mockStore, defaultCategories } = require('../store/mockStore');

async function seedAtlas() {
  console.log('Connecting to MongoDB Atlas with database: salary-tracker ...');
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'salary-tracker',
      serverSelectionTimeoutMS: 5000
    });

    console.log(`✅ Connected to Atlas! Target Database: ${mongoose.connection.name}`);

    // Create or update admin user
    let admin = await User.findOne({ email: 'admin@salarytracker.com' });
    if (!admin) {
      const hash = await bcrypt.hash('admin123', 10);
      admin = new User({
        name: 'Admin User',
        email: 'admin@salarytracker.com',
        password: hash,
        phone: '+91 98765 43210',
        currency: '₹',
        savings_target: 25000,
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin user created in salary-tracker database.');
    }

    // Categories
    await Category.deleteMany({});
    await Category.insertMany(defaultCategories.map(c => ({
      name: c.name,
      icon: c.icon,
      type: c.type,
      color: c.color,
      is_default: true,
      subcategories: c.subcategories || []
    })));
    console.log(`✅ ${defaultCategories.length} Categories seeded.`);

    // Salaries (30,000 each month)
    await Salary.deleteMany({ user_id: admin._id });
    await Salary.insertMany(mockStore.salaries.map(s => ({
      user_id: admin._id,
      month: s.month,
      year: s.year,
      base_salary: 30000,
      bonus: 0,
      commission: 0,
      other_income: 0,
      tax: 0,
      deductions: 0,
      net_salary: 30000,
      payment_date: new Date(s.payment_date),
      notes: s.notes
    })));
    console.log(`✅ 6 Monthly Salaries (₹30,000 each) seeded.`);

    // Budgets
    await Budget.deleteMany({ user_id: admin._id });
    await Budget.insertMany(mockStore.budgets.map(b => ({
      user_id: admin._id,
      category: b.category,
      month: b.month,
      year: b.year,
      amount: b.amount
    })));
    console.log(`✅ Budgets seeded.`);

    // Transactions
    await Transaction.deleteMany({ user_id: admin._id });
    await Transaction.insertMany(mockStore.transactions.map(t => ({
      user_id: admin._id,
      title: t.title,
      description: t.description || '',
      amount: t.amount,
      type: t.type,
      category: t.category,
      payment_method: t.payment_method,
      transaction_date: new Date(t.transaction_date),
      notes: t.notes || '',
      account: t.account || 'Primary Account',
      location: t.location || ''
    })));
    console.log(`✅ Transactions seeded.`);

    console.log('\n🎉 SUCCESS! "salary-tracker" database is now live in MongoDB Atlas with all collections!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
}

seedAtlas();
