/**
 * Migration Script: Migrate from 'test' database to 'salary-tracker' database
 * Run: node scripts/migrate-test-to-salary-tracker.js
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

async function migrate() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not set in backend/.env');
    process.exit(1);
  }

  console.log('Connecting to MongoDB Atlas...');
  try {
    const client = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      dbName: 'salary-tracker'
    });

    console.log('✅ Connected to MongoDB!');
    const clientInstance = mongoose.connection.getClient();

    const testDb = clientInstance.db('test');
    const targetDb = clientInstance.db('salary-tracker');

    // List collections in test
    const testCollections = await testDb.listCollections().toArray();
    console.log(`Found ${testCollections.length} collections in 'test' database.`);

    for (const collInfo of testCollections) {
      const collName = collInfo.name;
      if (collName.startsWith('system.')) continue;

      const docs = await testDb.collection(collName).find({}).toArray();
      console.log(`- Copying ${docs.length} documents from test.${collName} -> salary-tracker.${collName}`);

      if (docs.length > 0) {
        await targetDb.collection(collName).deleteMany({});
        await targetDb.collection(collName).insertMany(docs);
      }
    }

    console.log('\n🎉 Migration complete! All collections copied to salary-tracker.');
    console.log('👉 You can now safely delete the old "test" database in MongoDB Atlas UI if desired.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration error:', err.message);
    if (err.message.includes('IP that isn\'t whitelisted') || err.message.includes('MongooseServerSelectionError')) {
      console.log('\n⚠️ Atlas IP Whitelist Notice:');
      console.log('Your current IP address is not whitelisted on MongoDB Atlas.');
      console.log('1. Go to MongoDB Atlas (https://cloud.mongodb.com)');
      console.log('2. In Security -> Network Access, click "Add IP Address"');
      console.log('3. Add "Allow Access from Anywhere" (0.0.0.0/0) or your current IP');
      console.log('4. Re-run: node scripts/migrate-test-to-salary-tracker.js');
    }
    process.exit(1);
  }
}

migrate();
