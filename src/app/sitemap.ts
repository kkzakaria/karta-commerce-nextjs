import { MetadataRoute } from 'next';
import { motorcycles } from '@/data/products';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://karta-commerce.ci';

  // Static routes for each locale
  const staticRoutes = routing.locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
      alternates: {
        languages: {
          fr: `${baseUrl}/fr`,
          en: `${baseUrl}/en`,
        }
      }
    },
  ]);

  // Product routes for each locale
  const productRoutes = routing.locales.flatMap((locale) =>
    motorcycles.map((motorcycle) => ({
      url: `${baseUrl}/${locale}/produits/${motorcycle.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          fr: `${baseUrl}/fr/produits/${motorcycle.id}`,
          en: `${baseUrl}/en/produits/${motorcycle.id}`,
        }
      }
    }))
  );

  return [...staticRoutes, ...productRoutes];
}