import { exportSQLiteData } from './export-sqlite-data';
import { importPostgreSQLData } from './import-postgresql-data';

async function migrateToPostgreSQL() {
  try {
    console.log('🚀 Starting SQLite to PostgreSQL migration...');
    console.log('═'.repeat(60));

    // Phase 1: Export SQLite data
    console.log('📤 Phase 1: Exporting SQLite data...');
    const backupPath = await exportSQLiteData();
    console.log(`✅ Phase 1 completed: ${backupPath}`);
    console.log('═'.repeat(60));

    // Phase 2: Import to PostgreSQL
    console.log('📥 Phase 2: Importing to PostgreSQL...');
    const importResult = await importPostgreSQLData();
    console.log('✅ Phase 2 completed');
    console.log('═'.repeat(60));

    // Summary
    console.log('🎉 Migration completed successfully!');
    console.log('\\n📋 Next Steps:');
    console.log('1. Update your .env file to use POSTGRES_URL');
    console.log('2. Run: npx prisma generate');
    console.log('3. Test your application');
    console.log('4. Deploy to Vercel with Postgres environment variables');
    console.log('\\n⚠️ Important: Keep the SQLite backup until you verify everything works!');

    return {
      success: true,
      backup: backupPath,
      imported: importResult.imported,
      expected: importResult.expected
    };

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\\n🔧 Troubleshooting:');
    console.log('1. Ensure PostgreSQL is running and accessible');
    console.log('2. Check your POSTGRES_URL in .env file');
    console.log('3. Verify Prisma schema is correctly configured');
    console.log('4. Run: npx prisma db push --preview-feature');
    throw error;
  }
}

// Execute migration if script is called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateToPostgreSQL()
    .then(() => {
      console.log('\\n✅ Migration script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\\n❌ Migration script failed:', error);
      process.exit(1);
    });
}

export { migrateToPostgreSQL };