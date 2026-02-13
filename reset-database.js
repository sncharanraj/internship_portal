require('dotenv').config();
const mongoose = require('mongoose');

async function resetDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Drop entire database
    await mongoose.connection.db.dropDatabase();
    console.log('🗑️  Database dropped completely');
    
    console.log('✅ Fresh start! Database is empty.');
    console.log('📝 Next application will be: INT-2026-0001');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetDatabase();
