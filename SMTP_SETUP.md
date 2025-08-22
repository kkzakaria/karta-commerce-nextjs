# Configuration SMTP pour KARTA COMMERCE GENERAL

Ce guide vous explique comment configurer l'envoi d'emails pour le formulaire de contact.

## 📧 Variables d'environnement requises

Copiez le fichier `.env.example` vers `.env.local` et configurez les variables suivantes :

```bash
cp .env.example .env.local
```

### Configuration de base

```env
# Serveur SMTP
SMTP_HOST=smtp.votre-fournisseur.com
SMTP_PORT=587
SMTP_SECURE=false

# Authentification
SMTP_USER=contact@kcg.ci
SMTP_PASSWORD=votre_mot_de_passe

# Email de destination
CONTACT_EMAIL=contact@kcg.ci
```

## 🔧 Configurations par fournisseur

### Gmail

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@kcg.ci
SMTP_PASSWORD=votre_mot_de_passe_app
```

**Important pour Gmail :**
1. Activez la validation en 2 étapes
2. Générez un "mot de passe d'application"
3. Utilisez ce mot de passe au lieu de votre mot de passe Gmail

### Outlook/Hotmail

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@kcg.ci
SMTP_PASSWORD=votre_mot_de_passe
```

### OVH

```env
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@kcg.ci
SMTP_PASSWORD=votre_mot_de_passe
```

### Gandi Mail

```env
SMTP_HOST=mail.gandi.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@kcg.ci
SMTP_PASSWORD=votre_mot_de_passe
```

## 🚀 Test de la configuration

1. **Démarrez le serveur de développement :**
   ```bash
   npm run dev
   ```

2. **Testez le formulaire :**
   - Allez sur http://localhost:3003
   - Remplissez le formulaire de contact
   - Vérifiez que l'email est bien reçu

3. **Vérifiez les logs :**
   - Les erreurs apparaissent dans la console
   - Les succès sont également loggés

## 🛡️ Sécurité

- **Jamais** de commit des vraies valeurs SMTP
- Utilisez des mots de passe d'application quand disponible
- Le fichier `.env.local` est ignoré par Git
- En production, configurez les variables via votre hébergeur

## 🐛 Dépannage

### Erreur d'authentification
- Vérifiez le nom d'utilisateur et mot de passe
- Pour Gmail, utilisez un mot de passe d'application
- Vérifiez que le compte autorise les connexions moins sécurisées

### Timeout de connexion
- Vérifiez l'adresse du serveur SMTP
- Vérifiez le port (587 pour STARTTLS, 465 pour SSL)
- Vérifiez votre firewall

### Email non reçu
- Vérifiez les spams
- Vérifiez l'adresse de destination
- Vérifiez les logs de l'application

## 📝 Format des emails

Les emails sont envoyés avec :
- **Expéditeur** : Le nom du visiteur <contact@kcg.ci>
- **Destinataire** : CONTACT_EMAIL
- **Sujet** : [KARTA COMMERCE] Nouveau contact - [Produit]
- **Contenu** : HTML formaté avec les couleurs de la marque
- **Reply-To** : Email du visiteur

## 🔄 API Endpoint

L'API est disponible sur `/api/contact` avec méthode POST :

```typescript
// Structure des données
{
  name: string,
  email: string,
  phone?: string,
  product?: string,
  message: string
}
```

**Réponses :**
- `200` : Email envoyé avec succès
- `400` : Données invalides
- `500` : Erreur serveur/SMTP