import { PrismaClient } from '@prisma/client';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

interface BackupData {
  metadata: {
    exportDate: string;
    version: string;
    source: string;
    target: string;
  };
  motorcycles: any[];
  admins: any[];
  referrers: any[];
  referralVisits: any[];
  referralContacts: any[];
  referralConversions: any[];
  stats: {
    motorcyclesCount: number;
    adminsCount: number;
    referrersCount: number;
    visitsCount: number;
    contactsCount: number;
    conversionsCount: number;
    totalRecords: number;
  };
}

async function importPostgreSQLData() {
  try {
    console.log('🔄 Starting PostgreSQL data import...');

    // Find the most recent backup file
    const backupDir = join(process.cwd(), 'backup');
    const backupFiles = readdirSync(backupDir)
      .filter(file => file.startsWith('sqlite-export-') && file.endsWith('.json'))
      .sort()
      .reverse();

    if (backupFiles.length === 0) {
      throw new Error('No backup files found. Please run export-sqlite-data.ts first.');
    }

    const latestBackup = backupFiles[0];
    const backupPath = join(backupDir, latestBackup);

    console.log(`📁 Loading backup from: ${backupPath}`);

    // Load backup data
    const backupData: BackupData = JSON.parse(readFileSync(backupPath, 'utf-8'));

    console.log('📊 Backup Summary:');
    console.log(`   • Export Date: ${backupData.metadata.exportDate}`);
    console.log(`   • Source: ${backupData.metadata.source}`);
    console.log(`   • Target: ${backupData.metadata.target}`);
    console.log(`   • Total Records: ${backupData.stats.totalRecords}`);

    // Clear existing data (in reverse order due to foreign keys)
    console.log('🗑️ Clearing existing PostgreSQL data...');
    await prisma.referralConversion.deleteMany();
    await prisma.referralContact.deleteMany();
    await prisma.referralVisit.deleteMany();
    await prisma.referrer.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.motorcycle.deleteMany();

    // Import motorcycles
    if (backupData.motorcycles.length > 0) {
      console.log(`🏍️ Importing ${backupData.motorcycles.length} motorcycles...`);
      await prisma.motorcycle.createMany({
        data: backupData.motorcycles.map(moto => ({
          ...moto,
          createdAt: new Date(moto.createdAt),
          updatedAt: new Date(moto.updatedAt)
        }))
      });
      console.log(`✅ Imported ${backupData.motorcycles.length} motorcycles`);
    }

    // Import admins
    if (backupData.admins.length > 0) {
      console.log(`👤 Importing ${backupData.admins.length} admins...`);
      await prisma.admin.createMany({
        data: backupData.admins
      });
      console.log(`✅ Imported ${backupData.admins.length} admins`);
    }

    // Import referrers
    if (backupData.referrers.length > 0) {
      console.log(`🎯 Importing ${backupData.referrers.length} referrers...`);
      await prisma.referrer.createMany({
        data: backupData.referrers.map(referrer => ({
          ...referrer,
          createdAt: new Date(referrer.createdAt),
          updatedAt: new Date(referrer.updatedAt)
        }))
      });
      console.log(`✅ Imported ${backupData.referrers.length} referrers`);
    }

    // Import referral visits
    if (backupData.referralVisits.length > 0) {
      console.log(`👁️ Importing ${backupData.referralVisits.length} referral visits...`);
      await prisma.referralVisit.createMany({
        data: backupData.referralVisits.map(visit => ({
          ...visit,
          timestamp: new Date(visit.timestamp)
        }))
      });
      console.log(`✅ Imported ${backupData.referralVisits.length} visits`);
    }

    // Import referral contacts
    if (backupData.referralContacts.length > 0) {
      console.log(`📧 Importing ${backupData.referralContacts.length} referral contacts...`);
      await prisma.referralContact.createMany({
        data: backupData.referralContacts.map(contact => ({
          ...contact,
          timestamp: new Date(contact.timestamp)
        }))
      });
      console.log(`✅ Imported ${backupData.referralContacts.length} contacts`);
    }

    // Import referral conversions
    if (backupData.referralConversions.length > 0) {
      console.log(`💰 Importing ${backupData.referralConversions.length} referral conversions...`);
      await prisma.referralConversion.createMany({
        data: backupData.referralConversions.map(conversion => ({
          ...conversion,
          timestamp: new Date(conversion.timestamp)
        }))
      });
      console.log(`✅ Imported ${backupData.referralConversions.length} conversions`);
    }

    // Verify import
    console.log('🔍 Verifying import...');
    const counts = {
      motorcycles: await prisma.motorcycle.count(),
      admins: await prisma.admin.count(),
      referrers: await prisma.referrer.count(),
      visits: await prisma.referralVisit.count(),
      contacts: await prisma.referralContact.count(),
      conversions: await prisma.referralConversion.count()
    };

    console.log('\\n🎉 PostgreSQL import completed successfully!');
    console.log('\\n📊 Import Verification:');
    console.log(`   • Motorcycles: ${counts.motorcycles}/${backupData.stats.motorcyclesCount} ✅`);
    console.log(`   • Admins: ${counts.admins}/${backupData.stats.adminsCount} ✅`);
    console.log(`   • Referrers: ${counts.referrers}/${backupData.stats.referrersCount} ✅`);
    console.log(`   • Visits: ${counts.visits}/${backupData.stats.visitsCount} ✅`);
    console.log(`   • Contacts: ${counts.contacts}/${backupData.stats.contactsCount} ✅`);
    console.log(`   • Conversions: ${counts.conversions}/${backupData.stats.conversionsCount} ✅`);

    const totalImported = Object.values(counts).reduce((sum, count) => sum + count, 0);
    console.log(`   • Total Records: ${totalImported}/${backupData.stats.totalRecords} ✅`);

    if (totalImported === backupData.stats.totalRecords) {
      console.log('\\n✅ All data migrated successfully!');
    } else {
      console.log('\\n⚠️ Some data may be missing. Please verify manually.');
    }

    return {
      success: true,
      backupFile: latestBackup,
      imported: counts,
      expected: backupData.stats
    };

  } catch (error) {
    console.error('❌ PostgreSQL import failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute import if script is called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  importPostgreSQLData();
}

export { importPostgreSQLData };