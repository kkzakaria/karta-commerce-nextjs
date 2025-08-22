import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { sendEmailViaGraph, verifyGraphConfig, type EmailData } from '@/lib/graph';

// Schema de validation pour les données du formulaire
const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  product: z.string().optional(),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères')
});

// Configuration du transporteur SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true pour 465, false pour autres ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export async function POST(request: NextRequest) {
  try {
    // Vérifier d'abord si Microsoft Graph est configuré
    let useGraphAPI = false;
    try {
      verifyGraphConfig();
      useGraphAPI = true;
      console.log('Using Microsoft Graph API for email');
    } catch {
      // Fallback vers SMTP si Graph n'est pas configuré
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('Ni Microsoft Graph ni SMTP ne sont configurés');
        return NextResponse.json(
          { error: 'Configuration email non disponible' },
          { status: 500 }
        );
      }
      console.log('Using SMTP fallback for email');
    }

    // Parsing et validation des données
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Construction du contenu de l'email
    const { name, email, phone, product, message } = validatedData;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0000bc, #ff233f); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">KARTA COMMERCE GENERAL</h1>
          <p style="color: white; margin: 5px 0 0 0; font-size: 14px;">Nouveau message depuis le site web</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #0000bc; margin-bottom: 20px;">Détails du contact</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong style="color: #0000bc;">Nom :</strong> ${name}</p>
            <p><strong style="color: #0000bc;">Email :</strong> ${email}</p>
            ${phone ? `<p><strong style="color: #0000bc;">Téléphone :</strong> ${phone}</p>` : ''}
            ${product ? `<p><strong style="color: #0000bc;">Produit d'intérêt :</strong> ${product}</p>` : ''}
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: #ff233f; margin-top: 0;">Message :</h3>
            <p style="line-height: 1.6; color: #333;">${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
        
        <div style="background: #0000bc; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">KARTA COMMERCE GENERAL - La qualité aux meilleurs prix</p>
          <p style="margin: 5px 0 0 0;">contact@kcg.ci | +225 07 77 39 25 46</p>
        </div>
      </div>
    `;

    // Envoi de l'email selon la méthode disponible
    if (useGraphAPI) {
      // Utiliser Microsoft Graph API
      const emailData: EmailData = {
        to: process.env.CONTACT_EMAIL || process.env.EMAIL_FROM!,
        from: process.env.EMAIL_FROM!,
        replyTo: email,
        subject: `[KARTA COMMERCE] Nouveau contact${product ? ` - ${product}` : ''}`,
        htmlContent,
        textContent: `
Nouveau message de contact depuis le site KARTA COMMERCE GENERAL:

Nom: ${name}
Email: ${email}
Téléphone: ${phone || 'Non fourni'}
Produit d'intérêt: ${product || 'Aucun produit spécifique'}

Message:
${message}
        `
      };

      await sendEmailViaGraph(emailData);
      console.log('Email envoyé avec succès via Microsoft Graph');
    } else {
      // Fallback vers SMTP
      const transporter = createTransporter();
      await transporter.verify();

      const info = await transporter.sendMail({
        from: `"KARTA COMMERCE GENERAL" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
        replyTo: email,
        subject: `[KARTA COMMERCE] Nouveau contact${product ? ` - ${product}` : ''}`,
        html: htmlContent,
        text: `
Nouveau message de contact depuis le site KARTA COMMERCE GENERAL:

Nom: ${name}
Email: ${email}
Téléphone: ${phone || 'Non fourni'}
Produit d'intérêt: ${product || 'Aucun produit spécifique'}

Message:
${message}
        `,
      });

      console.log('Email envoyé avec succès via SMTP:', info.messageId);
    }

    return NextResponse.json({
      success: true,
      message: 'Email envoyé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données du formulaire invalides', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}