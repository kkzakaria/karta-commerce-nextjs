'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  UserIcon,
  LockClosedIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

interface UserDropdownProps {
  username?: string;
}

export default function UserDropdown({ username = 'Admin' }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    router.push('/admin-login');
  };

  const menuItems = [
    {
      href: '/admin/profile',
      label: 'Mon Profil',
      icon: UserIcon,
      onClick: () => setIsOpen(false)
    },
    {
      href: '/admin/profile',
      label: 'Changer mot de passe',
      icon: LockClosedIcon,
      onClick: () => setIsOpen(false)
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 md:px-3 md:py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation"
      >
        <div className="w-8 h-8 md:w-8 md:h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold text-white">
            {username.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-medium hidden md:block">{username}</span>
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''} hidden md:block`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 md:w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{username}</p>
                <p className="text-xs text-gray-500">Administrateur</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={item.onClick}
                  className="flex items-center space-x-3 px-4 py-3 md:py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation"
                >
                  <Icon className="h-5 w-5 md:h-4 md:w-4 text-gray-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Separator */}
            <div className="border-t border-gray-100 my-1"></div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 md:py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left touch-manipulation"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 md:h-4 md:w-4 text-red-500" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}