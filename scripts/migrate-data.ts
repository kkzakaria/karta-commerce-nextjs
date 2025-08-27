import { PrismaClient } from '@prisma/client';
import { motorcycles } from '../src/data/products';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting data migration...');

  // Migration des motos
  console.log('📱 Migrating motorcycles...');
  for (const motorcycle of motorcycles) {
    await prisma.motorcycle.upsert({
      where: { id: motorcycle.id },
      update: motorcycle,
      create: motorcycle,
    });
    console.log(`✅ Migrated: ${motorcycle.name}`);
  }

  // Création de l'admin par défaut
  console.log('👤 Creating default admin...');
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@kcg.ci';

  await prisma.admin.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      email: adminEmail,
      password: hashPassword(adminPassword),
    },
  });

  console.log(`✅ Admin created: ${adminUsername}`);
  console.log('🎉 Migration completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });