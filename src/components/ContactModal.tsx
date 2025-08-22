'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import Modal from './Modal';
import { motorcycles } from '@/data/products';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

type ContactFormData = {
  name: string;
  email: string;
  phone?: string;
  product?: string;
  message: string;
};

export default function ContactModal({ isOpen, onClose, productName }: ContactModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const t = useTranslations('Contact');
  const tModels = useTranslations('ProductModels');

  // Create dynamic schema with translated error messages
  const contactSchema = z.object({
    name: z.string().min(2, t('form.nameRequired')),
    email: z.string().email(t('form.emailInvalid')),
    phone: z.string().optional(),
    product: z.string().optional(),
    message: z.string().min(10, t('form.messageRequired'))
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      product: productName || ''
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Clear previous error
      setSubmitError(null);
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: t('form.unknownError') }));
        throw new Error(errorData.error || t('form.sendError'));
      }

      const result = await response.json();
      console.log('Email envoyé avec succès:', result);
      
      setSubmitSuccess(true);
      reset();
      
      // Reset success message and close modal after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
      }, 5000);
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      const errorMessage = error instanceof Error ? error.message : t('form.sendError');
      setSubmitError(errorMessage);
      
      // Clear error after 8 seconds
      setTimeout(() => setSubmitError(null), 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t('modal.title')}${productName ? ` - ${productName}` : ''}`}
    >
      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6"
        >
          {t('form.success')}
        </motion.div>
      )}

      {submitError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6"
        >
          {submitError}
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            {t('form.name')}
          </label>
          <input
            {...register('name')}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            placeholder={t('form.namePlaceholder')}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            {t('form.email')}
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            placeholder={t('form.emailPlaceholder')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            {t('form.phone')}
          </label>
          <input
            {...register('phone')}
            type="tel"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
            placeholder={t('form.phonePlaceholder')}
          />
        </div>

        <div>
          <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-2">
            {t('form.product')}
          </label>
          <select
            {...register('product')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
          >
            <option value="">{t('form.selectProduct')}</option>
            {motorcycles.map((motorcycle) => (
              <option key={motorcycle.id} value={motorcycle.id}>
                {motorcycle.name} - {tModels(motorcycle.id.toLowerCase())} 
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            {t('form.message')}
          </label>
          <textarea
            {...register('message')}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-vertical"
            placeholder={t('form.messagePlaceholder')}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 px-6 rounded-lg hover:from-red-700 hover:to-red-600 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {t('form.sending')}
            </span>
          ) : (
            t('form.submit')
          )}
        </button>
      </form>
    </Modal>
  );
}