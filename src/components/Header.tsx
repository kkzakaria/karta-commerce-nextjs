'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('Navigation');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/#products', label: t('products') },
    { href: '/#about', label: t('about') },
    { href: '/#contact', label: t('contact') },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-gray-100 text-gray-800 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo + Brand Name */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity space-x-3">
            <Image
              src="/logo_kcg.png"
              alt="KARTA COMMERCE GENERAL - Globe Logo"
              width={40}
              height={40}
              priority
              className="h-10 w-10"
            />
            <div className="hidden sm:block">
              <div className="text-xl font-bold">
                <span style={{color: '#0000bc'}}>KARTA</span>{' '}
                <span style={{color: '#ff233f'}}>COMMERCE</span>{' '}
                <span style={{color: '#ff233f'}}>GENERAL</span>
              </div>
              <div className="text-xs text-gray-600 -mt-1">La qualité aux meilleurs prix</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-white hover:bg-blue-600 px-3 py-2 text-sm font-bold transition-all duration-200 rounded-md" style={{color: '#0000bc'}}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="ml-8">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500" style={{color: '#0000bc'}}
              aria-expanded="false"
            >
              <span className="sr-only">{t('openMainMenu')}</span>
              <div className="flex flex-col space-y-1">
                <motion.span
                  animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  className="block w-6 h-0.5 bg-current"
                />
                <motion.span
                  animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="block w-6 h-0.5 bg-current"
                />
                <motion.span
                  animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  className="block w-6 h-0.5 bg-current"
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={isMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-white border-t border-gray-200"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-700 hover:text-white hover:bg-blue-600 block px-3 py-2 text-base font-bold transition-all duration-200 rounded-md" style={{color: '#0000bc'}}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="px-3 py-2">
            <LanguageSwitcher />
          </div>
        </div>
      </motion.div>
    </header>
  );
}