# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KARTA COMMERCE GENERAL Next.js application - Modern motorcycle dealership website for premium QASKI motorcycles in Côte d'Ivoire. Multi-language (FR/EN) e-commerce platform built with Next.js 15.5 App Router, TypeScript, Tailwind CSS, and next-intl for internationalization.

## Technology Stack

- **Framework**: Next.js 15.5.0 with App Router and Turbopack
- **Language**: TypeScript with strict mode
- **Database**: SQLite with Prisma ORM (6.14.0)
- **Authentication**: JWT with bcryptjs hashing
- **Internationalization**: next-intl with FR (default) and EN locales
- **Styling**: Tailwind CSS with custom QASKI/KARTA brand colors
- **Animations**: Framer Motion for smooth transitions
- **Forms**: React Hook Form + Zod validation
- **Email**: Nodemailer with Microsoft Graph API integration
- **Fonts**: Inter (Google Fonts)
- **Images**: Product images with PDF specs in `/public` folders

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build with Turbopack
npm run build

# Start production server
npm start

# Linting
npm run lint

# Database operations (Prisma)
npx prisma generate          # Generate Prisma client
npx prisma migrate dev       # Apply database migrations
npx prisma studio           # Open database browser
npx prisma db push          # Push schema changes to database

# Data migration script
npx tsx scripts/migrate-data.ts    # Migrate products and create admin user
```

## Architecture

### App Router Structure with i18n
- **Root Layout** (`src/app/layout.tsx`): Minimal wrapper, delegates to locale layout
- **Locale Layout** (`src/app/[locale]/layout.tsx`): NextIntlClientProvider, Header/Footer, metadata generation
- **Homepage** (`src/app/[locale]/page.tsx`): Component composition (Hero → ProductGrid → About → Contact)
- **Dynamic Routes** (`src/app/[locale]/produits/[id]/page.tsx`): Static generation for all motorcycle models × all locales
- **Admin System** (`src/app/admin/*`): Protected admin dashboard with authentication, product management, analytics
- **Admin Login** (`src/app/admin-login/page.tsx`): JWT-based authentication endpoint
- **API Routes**: Contact form (`api/contact`), Admin operations (`api/admin/*`), Motorcycle CRUD (`api/motorcycles`)
- **SEO Integration**: Sitemap generation (`sitemap.ts`) and robots.txt (`robots.txt/route.ts`)

### Data Architecture
- **Database** (`prisma/schema.prisma`): SQLite with Motorcycle and Admin models, managed via Prisma ORM
- **Product Data** (`src/data/products.ts`): 8 motorcycle models with complete specifications, contact info, helper functions
- **TypeScript Types** (`src/types/index.ts`): Motorcycle interface (19 fields), ContactFormData, ContactInfo
- **Static Assets**: Each product has folder in `/public/{productId}/` with PNG image and PDF spec sheet
- **Translation Files** (`messages/fr.json`, `messages/en.json`): Complete UI translations for both locales
- **Contact Info**: Centralized in products.ts with bilingual support
- **Authentication** (`src/lib/auth.ts`): JWT token management, password hashing, request authentication

### Component Organization
- **Layout Components**: Header (fixed nav + mobile menu), Footer, AdminHeader, AdminSidebar
- **Page Sections**: Hero, ProductGrid, AboutSection, ContactSection  
- **Product Components**: ProductCard (with hover animations), ProductPageContent
- **Admin Components**: ProductForm (create/edit), FileUpload (image/PDF handling), Dashboard widgets
- **Utility Components**: WhatsAppButton (direct integration), ContactModal, Modal

### Key Implementation Patterns
- **Static Generation**: All pages pre-built with `generateStaticParams()` for locale × product combinations
- **Dynamic Metadata**: SEO-optimized metadata per product page with locale awareness
- **Internationalization**: Middleware-based routing with `localePrefix: 'always'` (/fr/, /en/)
- **Form Validation**: Zod schema validation with React Hook Form
- **Animation System**: Framer Motion with consistent 0.3s/0.8s timing
- **Image Strategy**: Next.js Image with responsive sizing and product-folder organization
- **Mobile-First**: Responsive breakpoints with hamburger menu at 768px

## Brand Guidelines

### Color System (Tailwind Config)
- **QASKI Brand**: 
  - Primary Red: `#ea000f` (qaski-red-primary)
  - Secondary Red: `#ff6b35` (qaski-red-secondary)
  - Dark Gray: `#1a1a1a` (qaski-gray-dark)
  - Medium Gray: `#2c2c2c` (qaski-gray-medium)
- **KARTA Brand**:
  - Blue: `#0000bc` (karta-blue)
  - Red: `#ff233f` (karta-red)

### Typography & Animations
- **Font Stack**: Inter → system-ui → sans-serif
- **Standard Animations**: 0.3s interactions, 0.8s page load
- **Hover Effects**: translateY(-10px) + scale(1.02) for cards

## Data Management

### Product Structure
Each motorcycle has 19 standardized fields including technical specs (engine, power, torque, dimensions) and commercial info (containerQty, bore). Product IDs match folder names in `/public` for image/PDF organization.

### Contact Integration
- **WhatsApp**: Direct links with pre-filled messages for products
- **Email Form**: Simulated submission with success feedback (ready for backend)
- **Contact Info**: Centralized in products.ts for consistency

## Key Development Notes

### Path Aliases
- `@/*` maps to `src/*` (configured in tsconfig.json)
- Use absolute imports for all components and utilities

### Internationalization Setup
- **Routing**: Middleware intercepts all routes, adds locale prefix
- **Translation Access**: Use `useTranslations()` hook in client components
- **Server Components**: Use `getTranslations()` for server-side translations
- **Locale Switch**: LanguageSwitcher component handles locale changes
- **Default Locale**: French (fr) with fallback to English (en)

### Static Export Ready
- Next.js config optimized for static hosting
- All pages pre-generated at build time (locales × products = static pages)
- Image optimization configured for production

### SEO & Performance
- Bilingual support (fr-CI, en-US) with proper locale metadata
- Open Graph and Twitter Card metadata per locale
- Core Web Vitals optimized with proper image sizing
- Semantic HTML with accessibility considerations
- Sitemap includes all locale/product combinations

### Email Configuration
- **SMTP Integration**: Contact form uses Nodemailer with Microsoft Graph API support
- **Environment Setup**: Copy `.env.example` to `.env.local` for local development
- **Email Endpoint**: `/api/contact` handles form submissions with Zod validation
- **Configuration Guide**: See `SMTP_SETUP.md` for detailed provider-specific setup (Gmail, Outlook, OVH, Gandi)
- **Email Format**: Branded HTML emails with visitor details and product interest

## Admin System Architecture

### Database Setup
- **SQLite Database**: Local development with `DATABASE_URL` in environment
- **Prisma Client**: Auto-generated client for type-safe database operations
- **Models**: `Motorcycle` (19 fields matching data structure), `Admin` (username/email/password)
- **Migration**: Use `scripts/migrate-data.ts` to seed database with existing product data

### Authentication Flow
- **JWT Tokens**: 7-day expiration, stored in localStorage for admin sessions
- **Password Security**: bcrypt hashing with 12 salt rounds
- **Route Protection**: `AdminLayout` checks token validity, redirects to `/admin-login`
- **API Security**: Bearer token validation in admin API routes
- **Default Admin**: Created via migration script (username: admin, password: admin123)

### Admin Routes Structure
```
/admin-login          → JWT authentication
/admin/
├── dashboard         → Analytics overview
├── produits         → Product management CRUD
│   ├── nouveau      → Create new product
│   └── [id]/edit    → Edit existing product
└── analytics        → Business metrics dashboard
```

### Development Workflow
1. **Database Setup**: `npx prisma generate` → `npx prisma db push`
2. **Seed Data**: `npx tsx scripts/migrate-data.ts` (creates motorcycles + admin)
3. **Admin Access**: Login at `/admin-login` with default credentials
4. **Environment**: Set `JWT_SECRET`, `DATABASE_URL`, `ADMIN_*` variables