# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QASKI Next.js application - Modern motorcycle dealership website for premium motorcycles in Côte d'Ivoire. Built with Next.js 14+ App Router, TypeScript, Tailwind CSS, and French localization for the local market.

## Technology Stack

- **Framework**: Next.js 15.5.0 with App Router and Turbopack
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom QASKI brand colors
- **Animations**: Framer Motion for smooth transitions
- **Forms**: React Hook Form + Zod validation
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
```

## Architecture

### App Router Structure
- **Root Layout** (`src/app/layout.tsx`): Fixed Header/Footer with global metadata
- **Homepage** (`src/app/page.tsx`): Component composition (Hero → ProductGrid → About → Contact)
- **Dynamic Routes** (`src/app/produits/[id]/page.tsx`): Static generation for all motorcycle models
- **SEO Integration**: Sitemap generation (`sitemap.ts`) and robots.txt (`robots.txt/route.ts`)

### Data Architecture
- **Product Data** (`src/data/products.ts`): 7 motorcycle models with complete specifications
- **TypeScript Types** (`src/types/index.ts`): Motorcycle interface with 19 fields + ContactFormData
- **Static Assets**: Each product has folder in `/public` with PNG image and PDF spec sheet
- **Contact Info**: Centralized contact details with French localization

### Component Organization
- **Layout Components**: Header (fixed nav + mobile menu), Footer
- **Page Sections**: Hero, ProductGrid, AboutSection, ContactSection  
- **Product Components**: ProductCard (with hover animations), ProductPageContent
- **Utility Components**: WhatsAppButton (direct integration), ContactModal, Modal

### Key Implementation Patterns
- **Static Generation**: All product pages pre-built with `generateStaticParams()`
- **Dynamic Metadata**: SEO-optimized metadata per product page
- **Form Validation**: Zod schema validation with React Hook Form
- **Animation System**: Framer Motion with consistent 0.3s/0.8s timing
- **Image Strategy**: Next.js Image with responsive sizing and product-folder organization
- **Mobile-First**: Responsive breakpoints with hamburger menu at 768px

## Brand Guidelines

### Color System (Tailwind Config)
- Primary Red: `#ea000f` (qaski-red-primary)
- Secondary Red: `#ff6b35` (qaski-red-secondary)  
- Dark Gray: `#1a1a1a` (qaski-gray-dark)
- Medium Gray: `#2c2c2c` (qaski-gray-medium)

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

### Static Export Ready
- Next.js config optimized for static hosting
- All pages pre-generated at build time
- Image optimization configured for production

### SEO & Performance
- French localization (fr-CI) throughout
- Open Graph and Twitter Card metadata
- Core Web Vitals optimized with proper image sizing
- Semantic HTML with accessibility considerations