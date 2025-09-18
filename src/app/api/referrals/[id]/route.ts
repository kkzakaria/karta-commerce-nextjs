import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/auth';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateReferrerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  commission: z.number().min(0).max(100),
  status: z.enum(['active', 'inactive', 'suspended']).optional()
});

// GET - Récupérer un référenceur spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isValid) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const referrer = await prisma.referrer.findUnique({
      where: { id },
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
        },
        visits: {
          select: {
            id: true,
            page: true,
            ipAddress: true,
            timestamp: true
          },
          orderBy: {
            timestamp: 'desc'
          },
          take: 20
        },
        contacts: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            productInterest: true,
            message: true,
            timestamp: true
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
            id: true,
            amount: true,
            product: true,
            status: true,
            timestamp: true
          },
          orderBy: {
            timestamp: 'desc'
          }
        }
      }
    });

    if (!referrer) {
      return NextResponse.json(
        { error: 'Référenceur non trouvé' },
        { status: 404 }
      );
    }

    // Calculer les statistiques
    const totalRevenue = referrer.conversions.reduce(
      (sum, conv) => sum + Number(conv.amount),
      0
    );

    const conversionRate = referrer._count.contacts > 0
      ? (referrer._count.conversions / referrer._count.contacts) * 100
      : 0;

    // Calculer les statistiques des 30 derniers jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentVisits = await prisma.referralVisit.count({
      where: {
        referrerId: id,
        timestamp: {
          gte: thirtyDaysAgo
        }
      }
    });

    const recentContacts = await prisma.referralContact.count({
      where: {
        referrerId: id,
        timestamp: {
          gte: thirtyDaysAgo
        }
      }
    });

    const result = {
      ...referrer,
      commission: Number(referrer.commission),
      totalEarnings: Number(referrer.totalEarnings),
      stats: {
        visits: referrer._count.visits,
        contacts: referrer._count.contacts,
        conversions: referrer._count.conversions,
        totalRevenue,
        conversionRate: conversionRate.toFixed(1),
        recentVisits,
        recentContacts
      },
      referralLink: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?ref=${referrer.code}`
    };

    return NextResponse.json({ referrer: result });

  } catch (error) {
    console.error('Error fetching referrer:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du référenceur' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un référenceur
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isValid) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateReferrerSchema.parse(body);

    // Vérifier que le référenceur existe
    const existingReferrer = await prisma.referrer.findUnique({
      where: { id }
    });

    if (!existingReferrer) {
      return NextResponse.json(
        { error: 'Référenceur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier l'unicité de l'email (sauf pour le référenceur actuel)
    if (validatedData.email !== existingReferrer.email) {
      const emailExists = await prisma.referrer.findFirst({
        where: {
          email: validatedData.email,
          id: {
            not: id
          }
        }
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé par un autre référenceur' },
          { status: 400 }
        );
      }
    }

    // Mettre à jour le référenceur
    const updatedReferrer = await prisma.referrer.update({
      where: { id },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        commission: validatedData.commission,
        status: validatedData.status || existingReferrer.status
      }
    });

    return NextResponse.json({
      success: true,
      referrer: {
        ...updatedReferrer,
        commission: Number(updatedReferrer.commission),
        totalEarnings: Number(updatedReferrer.totalEarnings),
        referralLink: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?ref=${updatedReferrer.code}`
      }
    });

  } catch (error) {
    console.error('Error updating referrer:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du référenceur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un référenceur
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isValid) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier que le référenceur existe
    const existingReferrer = await prisma.referrer.findUnique({
      where: { id },
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

    if (!existingReferrer) {
      return NextResponse.json(
        { error: 'Référenceur non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le référenceur (les données liées seront supprimées en cascade)
    await prisma.referrer.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Référenceur supprimé avec succès',
      deletedData: {
        referrer: existingReferrer.name,
        visits: existingReferrer._count.visits,
        contacts: existingReferrer._count.contacts,
        conversions: existingReferrer._count.conversions
      }
    });

  } catch (error) {
    console.error('Error deleting referrer:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du référenceur' },
      { status: 500 }
    );
  }
}