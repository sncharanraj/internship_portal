require('dotenv').config();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '../backups');
const DATE = new Date().toISOString().split('T')[0];
const BACKUP_FILE = path.join(BACKUP_DIR, `backup-${DATE}.gz`);

// Create backups directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔄 Starting database backup...');
console.log('📁 Backup location:', BACKUP_FILE);

// Run mongodump
const command = `mongodump --uri="${MONGODB_URI}" --gzip --archive=${BACKUP_FILE}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  }
  
  const stats = fs.statSync(BACKUP_FILE);
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log('✅ Backup completed successfully!');
  console.log(`📊 Backup size: ${fileSizeMB} MB`);
  console.log(`📁 File: ${BACKUP_FILE}`);
});
