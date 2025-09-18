'use client';

import Image from 'next/image';
import Link from 'next/link';
import UserDropdown from '@/components/admin/UserDropdown';

export default function AdminHeader() {

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Admin Title */}
          <div className="flex items-center space-x-4">
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