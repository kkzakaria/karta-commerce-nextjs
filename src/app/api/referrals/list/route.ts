import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isValid) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const referrers = await prisma.referrer.findMany({
      include: {
        _count: {
          select: {
            visits: true,
            contacts: true,
            conversions: {
              where: {
                status: 'confirmed'
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate additional metrics
    const referrersWithStats = await Promise.all(
      referrers.map(async (referrer) => {
        const confirmedConversions = await prisma.referralConversion.findMany({
          where: {
            referrerId: referrer.id,
            status: 'confirmed'
          }
        });

        const totalRevenue = confirmedConversions.reduce(
          (sum, conv) => sum + conv.amount,
          0
        );

        const conversionRate = referrer._count.contacts > 0
          ? (referrer._count.conversions / referrer._count.contacts) * 100
          : 0;

        return {
          id: referrer.id,
          name: referrer.name,
          email: referrer.email,
          phone: referrer.phone,
          code: referrer.code,
          status: referrer.status,
          commission: referrer.commission,
          totalEarnings: referrer.totalEarnings,
          createdAt: referrer.createdAt,
          stats: {
            visits: referrer._count.visits,
            contacts: referrer._count.contacts,
            conversions: referrer._count.conversions,
            totalRevenue,
            conversionRate: conversionRate.toFixed(1)
          },
          referralLink: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?ref=${referrer.code}`
        };
      })
    );

    return NextResponse.json({
      success: true,
      referrers: referrersWithStats
    });

  } catch (error) {
    console.error('Error fetching referrers:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des référenceurs' },
      { status: 500 }
    );
  }
}