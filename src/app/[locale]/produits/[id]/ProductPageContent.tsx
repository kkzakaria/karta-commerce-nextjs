'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Motorcycle } from '@/types';
import WhatsAppButton from '@/components/WhatsAppButton';
import ContactModal from '@/components/ContactModal';

interface ProductPageContentProps {
  motorcycle: Motorcycle;
}

export default function ProductPageContent({ motorcycle }: ProductPageContentProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const t = useTranslations('Products');
  const nav = useTranslations('Navigation');

  const specifications = [
    {
      title: `🔧 ${t('technicalSpecs')}`,
      specs: [
        { label: t('engine'), value: motorcycle.engine },
        { label: t('bore'), value: motorcycle.bore },
        { label: t('power'), value: motorcycle.power },
        { label: t('torque'), value: motorcycle.torque },
      ]
    },
    {
      title: '🏍️ Performance',
      specs: [
        { label: t('maxSpeed'), value: motorcycle.maxSpeed },
        { label: t('consumption'), value: motorcycle.fuelConsumption },
        { label: t('starter'), value: motorcycle.starter },
        { label: t('fuelCapacity'), value: motorcycle.fuelCapacity },
      ]
    },
    {
      title: `📏 ${t('dimensions')} & ${t('weight')}`,
      specs: [
        { label: t('dimensions'), value: motorcycle.dimensions },
        { label: t('wheelbase'), value: motorcycle.wheelbase },
        { label: t('weight'), value: motorcycle.weight },
        { label: t('maxLoad'), value: motorcycle.maxLoad },
      ]
    },
    {
      title: '🛞 Équipements',
      specs: [
        { label: t('brakeType'), value: motorcycle.brakeType },
        { label: t('tires'), value: motorcycle.tires },
        { label: t('containerQty'), value: motorcycle.containerQty },
      ]
    }
  ];

  return (
    <>
      {/* Product Header */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{motorcycle.name}</h1>
          <p className="text-xl text-gray-300">{motorcycle.subtitle}</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-red-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-red-600 hover:text-red-700">
              {nav('home')}
            </Link>
            <span className="text-gray-500">{'>'}</span>
            <Link href="/#products" className="text-red-600 hover:text-red-700">
              {nav('products')}
            </Link>
            <span className="text-gray-500">{'>'}</span>
            <span className="text-gray-700">{motorcycle.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Product Gallery */}
          <div className="bg-white rounded-2xl shadow-lg mb-12 overflow-hidden">
            <div className="relative h-96 bg-gradient-to-br from-gray-50 to-gray-100">
              <Image
                src={`/${motorcycle.id}/${motorcycle.id}.png`}
                alt={`${motorcycle.name} - ${motorcycle.subtitle}`}
                fill
                className="object-contain object-center p-8"
                priority
                sizes="(max-width: 768px) 100vw, 80vw"
              />
              <div className="absolute top-6 right-6 bg-gray-800 text-white px-4 py-2 rounded-full text-sm shadow-lg">
                📸 Photo Officielle
              </div>
            </div>
            
            {/* PDF Download Section */}
            <div className="p-6 bg-gray-50 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{t('specifications')}</h4>
                  <p className="text-sm text-gray-600">Téléchargez la documentation complète</p>
                </div>
                <Link
                  href={`/${motorcycle.id}/${motorcycle.id}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                >
                  📄 Télécharger PDF
                </Link>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {specifications.map((section, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-red-600">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  {section.title}
                </h3>
                <div className="space-y-4">
                  {section.specs.map((spec, specIndex) => (
                    <div key={specIndex} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium text-gray-700">{spec.label}:</span>
                      <span className="font-bold text-gray-900 text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4 md:space-y-0 md:space-x-6 md:flex md:justify-center">
            <WhatsAppButton productName={motorcycle.name} />
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="inline-block bg-transparent border-2 border-red-600 text-red-600 font-bold py-4 px-8 rounded-full hover:bg-red-600 hover:text-white transform hover:-translate-y-1 transition-all duration-300"
            >
              📧 {t('contactForQuote')}
            </button>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/#products"
              className="inline-block bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-full hover:bg-gray-200 transition-colors"
            >
              ← {t('backToProducts')}
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        productName={motorcycle.name}
      />
    </>
  );
}