'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  CubeIcon,
  PlusCircleIcon,
  ChartBarIcon,
  UserGroupIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      href: '/admin/dashboard',
      label: 'Tableau de bord',
      icon: HomeIcon
    },
    {
      href: '/admin/produits',
      label: 'Produits',
      icon: CubeIcon
    },
    {
      href: '/admin/produits/nouveau',
      label: 'Ajouter un produit',
      icon: PlusCircleIcon
    },
    {
      href: '/admin/referrals',
      label: 'Référenceurs',
      icon: UserGroupIcon
    },
    {
      href: '/admin/analytics',
      label: 'Analyses',
      icon: ChartBarIcon
    },
    {
      href: '/admin/profile',
      label: 'Mon Profil',
      icon: UserIcon
    }
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside className={`
      fixed md:relative top-0 left-0 z-50 w-64 bg-gray-900 text-white min-h-screen
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="p-6">
        {/* Mobile close button */}
        <div className="flex justify-between items-center mb-6 md:block">
          <h2 className="text-lg font-semibold text-gray-300">
            Menu
          </h2>
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
            aria-label="Fermer le menu"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">A</span>
            </div>
            <div>
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-gray-400">Administrateur</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}