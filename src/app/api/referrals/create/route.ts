import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth';
import { generateReferralCode } from '@/lib/referral';

const prisma = new PrismaClient();

const createReferrerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  commission: z.number().min(0).max(100).optional()
});

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isValid) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createReferrerSchema.parse(body);

    // Generate unique code
    let code = generateReferralCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma.referrer.findUnique({ where: { code } });
      if (!existing) break;
      code = generateReferralCode();
      attempts++;
    }

    // Create referrer
    const referrer = await prisma.referrer.create({
      data: {
        ...validatedData,
        code,
        commission: validatedData.commission || 0
      }
    });

    return NextResponse.json({
      success: true,
      referrer: {
        id: referrer.id,
        name: referrer.name,
        email: referrer.email,
        code: referrer.code,
        referralLink: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?ref=${referrer.code}`
      }
    });

  } catch (error) {
    console.error('Error creating referrer:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Un référenceur avec cet email existe déjà' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du référenceur' },
      { status: 500 }
    );
  }
}