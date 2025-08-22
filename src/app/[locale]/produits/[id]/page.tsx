import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getMotorcycleById, motorcycles } from '@/data/products';
import { routing } from '@/i18n/routing';
import ProductPageContent from './ProductPageContent';

interface ProductPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    motorcycles.map((motorcycle) => ({
      locale,
      id: motorcycle.id,
    }))
  );
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const motorcycle = getMotorcycleById(id);
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  if (!motorcycle) {
    return {
      title: locale === 'fr' ? 'Produit non trouvé - KARTA COMMERCE GENERAL' : 'Product not found - KARTA COMMERCE GENERAL',
    };
  }

  const baseTitle = `${motorcycle.name} - ${motorcycle.subtitle} | KARTA COMMERCE GENERAL`;
  const baseDescription = locale === 'fr' 
    ? `Découvrez le ${motorcycle.name}, ${motorcycle.subtitle}. Moteur ${motorcycle.engine}, vitesse max ${motorcycle.maxSpeed}, consommation ${motorcycle.fuelConsumption}. Prix et devis disponible chez KARTA COMMERCE GENERAL.`
    : `Discover the ${motorcycle.name}, ${motorcycle.subtitle}. Engine ${motorcycle.engine}, max speed ${motorcycle.maxSpeed}, consumption ${motorcycle.fuelConsumption}. Price and quote available at KARTA COMMERCE GENERAL.`;

  return {
    title: baseTitle,
    description: baseDescription,
    keywords: `${motorcycle.name}, ${locale === 'fr' ? 'moto' : 'motorcycle'}, ${motorcycle.engine}, ${motorcycle.subtitle}, KARTA COMMERCE GENERAL, Côte d'Ivoire`,
    authors: [{ name: 'KARTA COMMERCE GENERAL' }],
    creator: 'KARTA COMMERCE GENERAL',
    publisher: 'KARTA COMMERCE GENERAL',
    robots: 'index, follow',
    openGraph: {
      title: `${motorcycle.name} - ${motorcycle.subtitle}`,
      description: baseDescription,
      type: 'website',
      locale: locale === 'fr' ? 'fr_CI' : 'en_US',
      siteName: 'KARTA COMMERCE GENERAL',
    },
    twitter: {
      card: 'summary_large_image',
      title: baseTitle,
      description: baseDescription,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const motorcycle = getMotorcycleById(id);

  if (!motorcycle) {
    notFound();
  }

  return <ProductPageContent motorcycle={motorcycle} />;
}