import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

const trackSchema = z.object({
  code: z.string(),
  page: z.string(),
  sessionId: z.string()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = trackSchema.parse(body);

    // Get IP address and user agent
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] ||
                     headersList.get('x-real-ip') ||
                     'unknown';
    const userAgent = headersList.get('user-agent') || undefined;

    // Find referrer by code
    const referrer = await prisma.referrer.findUnique({
      where: { code: validatedData.code }
    });

    if (!referrer || referrer.status !== 'active') {
      return NextResponse.json(
        { error: 'Code de référencement invalide ou inactif' },
        { status: 400 }
      );
    }

    // Create visit record
    await prisma.referralVisit.create({
      data: {
        referrerId: referrer.id,
        page: validatedData.page,
        sessionId: validatedData.sessionId,
        ipAddress,
        userAgent
      }
    });

    // Set cookie for tracking
    const response = NextResponse.json({
      success: true,
      message: 'Visite enregistrée'
    });

    // Set referral cookie
    response.cookies.set('ref_code', validatedData.code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    });

    response.cookies.set('ref_session', validatedData.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Error tracking referral:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors du tracking' },
      { status: 500 }
    );
  }
}