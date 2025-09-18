import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

// Generate unique referral code
export function generateReferralCode(prefix: string = 'KCG'): string {
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestamp = Date.now().toString(36).substring(-2).toUpperCase();
  return `${prefix}-${randomPart}${timestamp}`;
}

// Store referral code in cookie
export async function setReferralCookie(code: string) {
  const cookieStore = await cookies();
  cookieStore.set('ref_code', code, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/'
  });
}

// Get referral code from cookie
export async function getReferralCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const refCode = cookieStore.get('ref_code');
  return refCode?.value || null;
}

// Track referral visit
export async function trackReferralVisit(
  code: string,
  page: string,
  sessionId: string,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    const referrer = await prisma.referrer.findUnique({
      where: { code }
    });

    if (!referrer || referrer.status !== 'active') {
      return null;
    }

    const visit = await prisma.referralVisit.create({
      data: {
        referrerId: referrer.id,
        page,
        sessionId,
        ipAddress,
        userAgent
      }
    });

    return visit;
  } catch (error) {
    console.error('Error tracking referral visit:', error);
    return null;
  }
}

// Track referral contact
export async function trackReferralContact(
  code: string,
  contactData: {
    name: string;
    email: string;
    phone?: string;
    productInterest?: string;
    message: string;
  }
) {
  try {
    const referrer = await prisma.referrer.findUnique({
      where: { code }
    });

    if (!referrer) {
      return null;
    }

    const contact = await prisma.referralContact.create({
      data: {
        referrerId: referrer.id,
        ...contactData
      }
    });

    return contact;
  } catch (error) {
    console.error('Error tracking referral contact:', error);
    return null;
  }
}

// Get referrer statistics
export async function getReferrerStats(code: string) {
  try {
    const referrer = await prisma.referrer.findUnique({
      where: { code },
      include: {
        _count: {
          select: {
            visits: true,
            contacts: true,
            conversions: true
          }
        },
        visits: {
          select: {
            timestamp: true,
            page: true
          },
          orderBy: {
            timestamp: 'desc'
          },
          take: 10
        },
        contacts: {
          select: {
            timestamp: true,
            productInterest: true
          },
          orderBy: {
            timestamp: 'desc'
          },
          take: 10
        },
        conversions: {
          where: {
            status: 'confirmed'
          },
          select: {
            amount: true,
            timestamp: true,
            product: true
          }
        }
      }
    });

    if (!referrer) {
      return null;
    }

    const totalRevenue = referrer.conversions.reduce((sum, conv) => sum + conv.amount, 0);
    const conversionRate = referrer._count.contacts > 0
      ? (referrer._count.conversions / referrer._count.contacts) * 100
      : 0;

    return {
      ...referrer,
      totalRevenue,
      conversionRate
    };
  } catch (error) {
    console.error('Error getting referrer stats:', error);
    return null;
  }
}

// Validate referral code
export async function validateReferralCode(code: string): Promise<boolean> {
  try {
    const referrer = await prisma.referrer.findUnique({
      where: { code }
    });
    return !!referrer && referrer.status === 'active';
  } catch (error) {
    console.error('Error validating referral code:', error);
    return false;
  }
}