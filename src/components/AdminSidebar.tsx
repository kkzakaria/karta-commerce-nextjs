'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  CubeIcon, 
  PlusCircleIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

export default function AdminSidebar() {
  const t = useTranslations('Admin');
  const pathname = usePathname();

  const menuItems = [
    {
      href: '/admin/dashboard',
      label: t('navigation.dashboard'),
      icon: HomeIcon
    },
    {
      href: '/admin/produits',
      label: t('navigation.products'),
      icon: CubeIcon
    },
    {
      href: '/admin/produits/nouveau',
      label: t('navigation.addProduct'),
      icon: PlusCircleIcon
    },
    {
      href: '/admin/analytics',
      label: t('navigation.analytics'),
      icon: ChartBarIcon
    }
  ];

  const isActive = (href: string) => {
    // Remove locale prefix for comparison
    const cleanPathname = pathname.replace(/^\/[a-z]{2}\//, '/');
    return cleanPathname === href || cleanPathname.startsWith(href + '/');
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-300 mb-6">
          {t('navigation.menu')}
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
              <p className="text-xs text-gray-400">{t('role.administrator')}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}