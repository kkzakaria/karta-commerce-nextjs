import { PrismaClient } from '@prisma/client';
import { writeFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function exportSQLiteData() {
  try {
    console.log('🔄 Starting SQLite data export...');

    // Export des motos
    console.log('📱 Exporting motorcycles...');
    const motorcycles = await prisma.motorcycle.findMany({
      orderBy: { name: 'asc' }
    });
    console.log(`✅ Found ${motorcycles.length} motorcycles`);

    // Export des admins
    console.log('👤 Exporting admins...');
    const admins = await prisma.admin.findMany({
      orderBy: { username: 'asc' }
    });
    console.log(`✅ Found ${admins.length} admins`);

    // Export des référenceurs
    console.log('🎯 Exporting referrers...');
    const referrers = await prisma.referrer.findMany({
      include: {
        visits: true,
        contacts: true,
        conversions: true
      },
      orderBy: { createdAt: 'asc' }
    });
    console.log(`✅ Found ${referrers.length} referrers`);

    // Export des visites (séparément pour éviter la duplication)
    console.log('👁️ Exporting referral visits...');
    const visits = await prisma.referralVisit.findMany({
      orderBy: { timestamp: 'asc' }
    });
    console.log(`✅ Found ${visits.length} visits`);

    // Export des contacts (séparément)
    console.log('📧 Exporting referral contacts...');
    const contacts = await prisma.referralContact.findMany({
      orderBy: { timestamp: 'asc' }
    });
    console.log(`✅ Found ${contacts.length} contacts`);

    // Export des conversions (séparément)
    console.log('💰 Exporting referral conversions...');
    const conversions = await prisma.referralConversion.findMany({
      orderBy: { timestamp: 'asc' }
    });
    console.log(`✅ Found ${conversions.length} conversions`);

    // Préparation des données pour l'export
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0',
        source: 'sqlite',
        target: 'postgresql'
      },
      motorcycles,
      admins,
      referrers: referrers.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        code: r.code,
        status: r.status,
        commission: r.commission,
        totalEarnings: r.totalEarnings,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt
      })),
      referralVisits: visits,
      referralContacts: contacts,
      referralConversions: conversions,
      stats: {
        motorcyclesCount: motorcycles.length,
        adminsCount: admins.length,
        referrersCount: referrers.length,
        visitsCount: visits.length,
        contactsCount: contacts.length,
        conversionsCount: conversions.length,
        totalRecords: motorcycles.length + admins.length + referrers.length + visits.length + contacts.length + conversions.length
      }
    };

    // Sauvegarde dans un fichier JSON
    const backupPath = join(process.cwd(), 'backup', `sqlite-export-${Date.now()}.json`);

    // Créer le dossier backup s'il n'existe pas
    const { mkdirSync } = await import('fs');
    try {
      mkdirSync(join(process.cwd(), 'backup'), { recursive: true });
    } catch (error) {
      // Le dossier existe déjà
    }

    writeFileSync(backupPath, JSON.stringify(exportData, null, 2));

    console.log('\n🎉 SQLite export completed successfully!');
    console.log(`📁 Backup saved to: ${backupPath}`);
    console.log('\n📊 Export Summary:');
    console.log(`   • Motorcycles: ${exportData.stats.motorcyclesCount}`);
    console.log(`   • Admins: ${exportData.stats.adminsCount}`);
    console.log(`   • Referrers: ${exportData.stats.referrersCount}`);
    console.log(`   • Visits: ${exportData.stats.visitsCount}`);
    console.log(`   • Contacts: ${exportData.stats.contactsCount}`);
    console.log(`   • Conversions: ${exportData.stats.conversionsCount}`);
    console.log(`   • Total Records: ${exportData.stats.totalRecords}`);

    return backupPath;

  } catch (error) {
    console.error('❌ SQLite export failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter l'export si le script est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  exportSQLiteData();
}

export { exportSQLiteData };