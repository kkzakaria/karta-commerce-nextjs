import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth, verifyPassword, hashPassword } from '@/lib/auth';
import { z } from 'zod';

const prisma = new PrismaClient();

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
  newPassword: z.string()
    .min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  confirmPassword: z.string().min(1, 'La confirmation est requise')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

// PUT - Changer le mot de passe de l'admin
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isValid || !authResult.payload) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = changePasswordSchema.parse(body);

    // Get current admin from database
    const admin = await prisma.admin.findUnique({
      where: { id: authResult.payload.id }
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Administrateur non trouvé' },
        { status: 404 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = verifyPassword(validatedData.currentPassword, admin.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Le mot de passe actuel est incorrect' },
        { status: 400 }
      );
    }

    // Check if new password is different from current
    const isSamePassword = verifyPassword(validatedData.newPassword, admin.password);
    if (isSamePassword) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit être différent de l\'actuel' },
        { status: 400 }
      );
    }

    // Hash new password and update in database
    const hashedNewPassword = hashPassword(validatedData.newPassword);

    await prisma.admin.update({
      where: { id: authResult.payload.id },
      data: { password: hashedNewPassword }
    });

    return NextResponse.json({
      success: true,
      message: 'Mot de passe mis à jour avec succès'
    });

  } catch (error) {
    console.error('Error changing password:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors du changement de mot de passe' },
      { status: 500 }
    );
  }
}