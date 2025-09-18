'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bars3Icon } from '@heroicons/react/24/outline';
import UserDropdown from '@/components/admin/UserDropdown';

interface AdminHeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button + Logo + Admin Title */}
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu - Mobile Only */}
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Ouvrir le menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <Image
              src="/logo_kcg.png"
              alt="KARTA COMMERCE GENERAL"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                <span style={{color: '#0000bc'}}>KARTA</span>{' '}
                <span style={{color: '#ff233f'}}>COMMERCE</span>{' '}
                <span className="text-gray-600">- Administration</span>
              </h1>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/admin/dashboard"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Tableau de bord
            </Link>
            <Link
              href="/admin/produits"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Produits
            </Link>
          </nav>

          {/* Right Side - User Menu */}
          <div className="flex items-center space-x-4">
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}