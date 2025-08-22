'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Motorcycle } from '@/types';

interface ProductCardProps {
  motorcycle: Motorcycle;
}

export default function ProductCard({ motorcycle }: ProductCardProps) {
  const t = useTranslations('Products');

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Product Image */}
      <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        <Image
          src={`/${motorcycle.id}/${motorcycle.id}.png`}
          alt={`${motorcycle.name} - ${motorcycle.subtitle}`}
          fill
          className="object-contain object-center p-4"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          {t('premium')}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{motorcycle.name}</h3>
        <p className="text-gray-600 mb-4">{motorcycle.subtitle}</p>

        {/* Specifications List */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">{t('power')}</span>
            <span className="text-sm font-bold text-gray-900">{motorcycle.power}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">{t('maxSpeed')}</span>
            <span className="text-sm font-bold text-gray-900">{motorcycle.maxSpeed}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">{t('consumption')}</span>
            <span className="text-sm font-bold text-gray-900">{motorcycle.fuelConsumption}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-700">{t('weight')}</span>
            <span className="text-sm font-bold text-gray-900">{motorcycle.weight}</span>
          </div>
        </div>

        {/* View Details Button */}
        <Link
          href={`/produits/${motorcycle.id}`}
          className="w-full block text-center bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 px-6 rounded-xl hover:from-red-700 hover:to-red-600 transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          {t('viewDetails')}
        </Link>
      </div>
    </motion.div>
  );
}