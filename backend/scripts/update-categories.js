const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const { defaultCategories } = require('../store/mockStore');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'salary-tracker' });
  console.log('Connected to Atlas salary-tracker database');

  // 1. Re-seed default categories
  await Category.deleteMany({ is_default: true });
  await Category.insertMany(defaultCategories.map(c => ({
    name: c.name,
    icon: c.icon,
    type: c.type,
    color: c.color,
    is_default: true,
    subcategories: c.subcategories || []
  })));
  console.log('✅ Updated categories in Atlas:', defaultCategories.map(c => `${c.name} (${c.type})`));

  // 2. Map existing transactions
  const txs = await Transaction.find({});
  let updatedCount = 0;
  for (const t of txs) {
    let newCategory = t.category;
    const titleLower = (t.title || '').toLowerCase();
    const descLower = (t.description || '').toLowerCase();
    const catLower = (t.category || '').toLowerCase();

    if (t.type === 'expense') {
      if (catLower === 'healthcare' || titleLower.includes('medicine') || descLower.includes('medicine')) {
        newCategory = 'Medicines';
      } else if (titleLower.includes('recharge') || descLower.includes('recharge') || titleLower.includes('broadband') || descLower.includes('broadband')) {
        newCategory = 'Recharges';
      } else if (titleLower.includes('netflix') || catLower === 'entertainment') {
        newCategory = 'Entertainment';
      } else if (catLower === 'rent' || catLower === 'education' || catLower === 'other' || (catLower === 'bills' && !titleLower.includes('recharge'))) {
        newCategory = 'Others';
      } else if (catLower === 'food' || catLower === 'groceries') {
        newCategory = 'Food';
      } else if (catLower === 'transportation' || catLower === 'fuel') {
        newCategory = 'Transportation';
      } else if (catLower === 'shopping') {
        newCategory = 'Shopping';
      } else {
        newCategory = 'Others';
      }
    }

    if (newCategory !== t.category) {
      console.log(`Mapped transaction "${t.title}": "${t.category}" -> "${newCategory}"`);
      t.category = newCategory;
      await t.save();
      updatedCount++;
    }
  }
  console.log(`✅ Updated ${updatedCount} transactions.`);

  // 3. Map existing budgets
  const budgets = await Budget.find({});
  for (const b of budgets) {
    let newCategory = b.category;
    const catLower = (b.category || '').toLowerCase();
    if (catLower === 'bills') newCategory = 'Recharges';
    else if (catLower === 'rent' || catLower === 'other') newCategory = 'Others';
    else if (catLower === 'healthcare') newCategory = 'Medicines';

    if (newCategory !== b.category) {
      console.log(`Mapped budget "${b.category}" -> "${newCategory}"`);
      b.category = newCategory;
      await b.save();
    }
  }

  // 4. Verification
  const finalCats = await Category.find({});
  console.log('✅ Final categories in DB:', finalCats.map(c => `${c.name} [${c.type}]`));
  const finalTxCats = await Transaction.distinct('category');
  console.log('✅ Final distinct transaction categories in DB:', finalTxCats);
  const finalBudgetCats = await Budget.distinct('category');
  console.log('✅ Final distinct budget categories in DB:', finalBudgetCats);

  process.exit(0);
}

run().catch(err => {
  console.error('❌ Error during update:', err);
  process.exit(1);
});
