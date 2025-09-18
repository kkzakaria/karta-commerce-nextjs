import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateReferralCode } from '../src/lib/referral';

const prisma = new PrismaClient();

async function testReferralSystem() {
  try {
    console.log('🚀 Testing Referral System...\n');

    // 1. Create a test referrer
    console.log('1. Creating test referrer...');
    const testReferrer = await prisma.referrer.create({
      data: {
        name: 'Jean Test',
        email: 'jean.test@example.com',
        phone: '+225 07 00 00 00 00',
        code: generateReferralCode(),
        commission: 15,
        status: 'active'
      }
    });
    console.log('✅ Referrer created:', testReferrer.code);
    console.log(`   Referral Link: http://localhost:3000?ref=${testReferrer.code}\n`);

    // 2. Simulate a visit
    console.log('2. Simulating a referral visit...');
    const visit = await prisma.referralVisit.create({
      data: {
        referrerId: testReferrer.id,
        page: '/produits/qs125-8',
        sessionId: `session_test_${Date.now()}`,
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 Test Browser'
      }
    });
    console.log('✅ Visit tracked\n');

    // 3. Simulate a contact
    console.log('3. Simulating a referral contact...');
    const contact = await prisma.referralContact.create({
      data: {
        referrerId: testReferrer.id,
        name: 'Client Test',
        email: 'client@example.com',
        phone: '+225 07 11 11 11 11',
        productInterest: 'QS125-8 Moto Sportive',
        message: 'Je suis intéressé par cette moto'
      }
    });
    console.log('✅ Contact tracked\n');

    // 4. Get statistics
    console.log('4. Fetching referrer statistics...');
    const stats = await prisma.referrer.findUnique({
      where: { id: testReferrer.id },
      include: {
        _count: {
          select: {
            visits: true,
            contacts: true,
            conversions: true
          }
        }
      }
    });

    console.log('📊 Referrer Statistics:');
    console.log(`   Name: ${stats?.name}`);
    console.log(`   Code: ${stats?.code}`);
    console.log(`   Visits: ${stats?._count.visits}`);
    console.log(`   Contacts: ${stats?._count.contacts}`);
    console.log(`   Conversions: ${stats?._count.conversions}`);
    console.log(`   Commission: ${stats?.commission}%\n`);

    console.log('✨ Referral system test completed successfully!');
    console.log('\n📝 Instructions:');
    console.log('1. Visit the admin panel at http://localhost:3000/admin/referrals');
    console.log('2. You should see the test referrer in the list');
    console.log(`3. Test the tracking by visiting: http://localhost:3000?ref=${testReferrer.code}`);
    console.log('4. Submit a contact form to see the referral tracking in action\n');

  } catch (error) {
    console.error('❌ Error testing referral system:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testReferralSystem();