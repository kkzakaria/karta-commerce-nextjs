'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { contactInfo } from '@/data/products';

interface WhatsAppButtonProps {
  productName?: string;
  className?: string;
}

export default function WhatsAppButton({ productName, className = '' }: WhatsAppButtonProps) {
  const t = useTranslations('Contact.whatsapp');

  const handleWhatsAppClick = () => {
    const baseMessage = productName 
      ? t('messageWithProduct', { productName })
      : t('messageDefault');
    
    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(baseMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleWhatsAppClick}
      className={`
        bg-gradient-to-r from-green-500 to-green-600 text-white font-bold 
        py-4 px-8 rounded-full shadow-lg hover:shadow-green-500/25 
        transition-all duration-300 flex items-center gap-4 text-lg
        ${className}
      `}
    >
      <span className="text-2xl">💬</span>
      {productName ? t('buttonWithProduct') : t('button')}
    </motion.button>
  );
}