'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  CubeIcon, 
  PlusCircleIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

export default function AdminSidebar() {
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
      href: '/admin/analytics',
      label: 'Analyses',
      icon: ChartBarIcon
    }
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-300 mb-6">
          Menu
        </h2>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
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