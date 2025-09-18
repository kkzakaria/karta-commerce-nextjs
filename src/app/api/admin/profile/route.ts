import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/auth';

const prisma = new PrismaClient();

// GET - Récupérer le profil de l'admin connecté
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isValid || !authResult.payload) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Get admin profile from database
    const admin = await prisma.admin.findUnique({
      where: { id: authResult.payload.id },
      select: {
        id: true,
        username: true,
        email: true
        // Exclude password field for security
      }
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Administrateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      admin
    });

  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du profil' },
      { status: 500 }
    );
  }
}