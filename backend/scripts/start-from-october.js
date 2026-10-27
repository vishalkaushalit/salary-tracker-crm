// Remove historical records for the demo tracker without reseeding October.
const path = require('path');
const fs = require('fs');
const os = require('os');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Salary = require('../models/Salary');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'salary-tracker', serverSelectionTimeoutMS: 5000
    });
    const user = await User.findOne({ email: 'admin@salarytracker.com' });
    if (!user) throw new Error('Tracker account not found');
    const period = { user_id: user._id, $or: [
      { year: { $lt: 2026 } }, { year: 2026, month: { $lt: 10 } }
    ] };
    const dated = { user_id: user._id,
      transaction_date: { $lt: new Date('2026-10-01T00:00:00+05:30') } };
    const targets = [[Salary, period], [Transaction, dated], [Budget, period]];
    const backup = {};
    for (const [model, filter] of targets) {
      backup[model.modelName] = await model.find(filter).lean();
    }
    console.log('Records before October 2026:', Object.fromEntries(
      Object.entries(backup).map(([name, records]) => [name, records.length])
    ));
    if (!process.argv.includes('--apply')) {
      console.log('Dry run. Pass --apply to back up and delete these records.');
      return;
    }
    const backupPath = path.join(os.tmpdir(), `salary-tracker-pre-october-${Date.now()}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2), { mode: 0o600 });
    console.log('Backup:', backupPath);
    for (const [model, filter] of targets) {
      const result = await model.deleteMany(filter);
      if (await model.countDocuments(filter)) throw new Error(`${model.modelName}: historical records remain`);
      console.log(`${model.modelName}: deleted ${result.deletedCount}; verified none remain before October.`);
    }
  } finally {
    await mongoose.disconnect();
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
