import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';

// Configuration Microsoft Graph
const graphConfig = {
  tenantId: process.env.MICROSOFT_GRAPH_TENANT_ID!,
  clientId: process.env.MICROSOFT_GRAPH_CLIENT_ID!,
  clientSecret: process.env.MICROSOFT_GRAPH_CLIENT_SECRET!,
};

// Créer le client Graph avec authentification
export const createGraphClient = () => {
  const credential = new ClientSecretCredential(
    graphConfig.tenantId,
    graphConfig.clientId,
    graphConfig.clientSecret
  );

  return Client.initWithMiddleware({
    authProvider: {
      getAccessToken: async () => {
        const tokenResponse = await credential.getToken('https://graph.microsoft.com/.default');
        return tokenResponse?.token || '';
      }
    }
  });
};

// Interface pour les données de l'email
export interface EmailData {
  to: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  from: string;
  replyTo?: string;
}

// Fonction pour envoyer un email via Microsoft Graph
export const sendEmailViaGraph = async (emailData: EmailData) => {
  try {
    const graphClient = createGraphClient();

    const message = {
      subject: emailData.subject,
      body: {
        contentType: 'html' as const,
        content: emailData.htmlContent
      },
      toRecipients: [
        {
          emailAddress: {
            address: emailData.to
          }
        }
      ],
      from: {
        emailAddress: {
          address: emailData.from
        }
      },
      ...(emailData.replyTo && {
        replyTo: [
          {
            emailAddress: {
              address: emailData.replyTo
            }
          }
        ]
      })
    };

    // Envoyer l'email
    await graphClient
      .api(`/users/${emailData.from}/sendMail`)
      .post({
        message,
        saveToSentItems: true
      });

    return { success: true };
  } catch (error) {
    console.error('Erreur Microsoft Graph:', error);
    throw new Error(`Erreur lors de l'envoi via Microsoft Graph: ${error}`);
  }
};

// Fonction de vérification de la configuration
export const verifyGraphConfig = () => {
  const requiredVars = [
    'MICROSOFT_GRAPH_TENANT_ID',
    'MICROSOFT_GRAPH_CLIENT_ID', 
    'MICROSOFT_GRAPH_CLIENT_SECRET'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Variables d'environnement manquantes: ${missing.join(', ')}`);
  }

  return true;
};