import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Créer un utilisateur admin par défaut
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        email: 'admin@karta-commerce.ci',
        password: hashedPassword,
      },
    });

    console.log('✅ Admin user created successfully:');
    console.log('Username:', admin.username);
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('\n⚠️  Please change the password after first login!');
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      console.log('❌ Admin user already exists with this username or email');
    } else {
      console.error('Error creating admin:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();