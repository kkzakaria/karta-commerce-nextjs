'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function AboutSection() {
  const t = useTranslations('About');

  const aboutCards = [
    {
      icon: '🏆',
      titleKey: 'cards.quality.title',
      descriptionKey: 'cards.quality.description'
    },
    {
      icon: '🔧',
      titleKey: 'cards.service.title',
      descriptionKey: 'cards.service.description'
    },
    {
      icon: '💰',
      titleKey: 'cards.pricing.title',
      descriptionKey: 'cards.pricing.description'
    },
    {
      icon: '🚚',
      titleKey: 'cards.delivery.title',
      descriptionKey: 'cards.delivery.description'
    },
    {
      icon: '🤝',
      titleKey: 'cards.advice.title',
      descriptionKey: 'cards.advice.description'
    },
    {
      icon: '📋',
      titleKey: 'cards.payment.title',
      descriptionKey: 'cards.payment.description'
    }
  ];

  const stats = [
    { number: '5000+', labelKey: 'stats.motorcyclesSold' },
    { number: '10', labelKey: 'stats.yearsExperience' },
    { number: '98%', labelKey: 'stats.satisfiedClients' },
    { number: '24/7', labelKey: 'stats.customerSupport' }
  ];

  const values = [
    {
      icon: '🎯',
      titleKey: 'values.transparency.title',
      descriptionKey: 'values.transparency.description'
    },
    {
      icon: '⚡',
      titleKey: 'values.reactivity.title',
      descriptionKey: 'values.reactivity.description'
    },
    {
      icon: '🌟',
      titleKey: 'values.innovation.title',
      descriptionKey: 'values.innovation.description'
    },
    {
      icon: '🌍',
      titleKey: 'values.localEngagement.title',
      descriptionKey: 'values.localEngagement.description'
    }
  ];

  return (
    <section id="about" className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6 relative inline-block">
            {t('title')}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full"></div>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </motion.div>

        {/* About Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {aboutCards.map((card, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border-t-4 border-red-600"
            >
              <div className="text-5xl mb-6 text-center">{card.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{t(card.titleKey)}</h3>
              <p className="text-gray-600 leading-relaxed">{t(card.descriptionKey)}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 px-8 rounded-2xl mb-16"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-4"
              >
                <div className="text-4xl font-bold text-red-500 mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{t(stat.labelKey)}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-8">{t('values.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-600"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{value.icon}</span>
                  <h4 className="text-lg font-bold text-gray-900">{t(value.titleKey)}</h4>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{t(value.descriptionKey)}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}