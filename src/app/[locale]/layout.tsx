import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    authors: [{ name: 'KARTA COMMERCE GENERAL' }],
    creator: 'KARTA COMMERCE GENERAL',
    publisher: 'KARTA COMMERCE GENERAL',
    robots: 'index, follow',
    openGraph: {
      type: 'website',
      locale: locale === 'fr' ? 'fr_CI' : 'en_US',
      url: 'https://qaski.ci',
      title: t('title'),
      description: t('description'),
      siteName: 'KARTA COMMERCE GENERAL',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as 'fr' | 'en')) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages({ locale });
  
  // Force messages to be passed to the client with locale context
  const clientMessages = {
    ...messages,
    _locale: locale
  };

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={clientMessages} locale={locale}>
          <Header />
          <main className="pt-20">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}