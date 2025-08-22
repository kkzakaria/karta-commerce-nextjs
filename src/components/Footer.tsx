'use client';

import { useTranslations } from 'next-intl';
import { contactInfo } from '@/data/products';

export default function Footer() {
  const t = useTranslations('Footer');
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-red-500 text-xl font-bold mb-4">QASKI</h3>
            <p className="text-gray-300 leading-relaxed">
              {t('description')}
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-red-500 text-xl font-bold mb-4">{t('contact')}</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>{contactInfo.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>{contactInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📧</span>
                <span>{contactInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🕐</span>
                <span>{contactInfo.hours}</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-red-500 text-xl font-bold mb-4">{t('services')}</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• {t('servicesList.newSales')}</li>
              <li>• {t('servicesList.financing')}</li>
              <li>• {t('servicesList.afterSales')}</li>
              <li>• {t('servicesList.spareParts')}</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2025 QASKI. {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}