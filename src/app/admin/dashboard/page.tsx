'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface DashboardStats {
  totalProducts: number;
  totalViews: number;
  totalContacts: number;
  totalOrders: number;
}

export default function AdminDashboardPage() {
  const t = useTranslations('Admin.dashboard');
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 8, // Static for now
    totalViews: 1250,
    totalContacts: 47,
    totalOrders: 23
  });
  const [isLoading, setIsLoading] = useState(false);

  const statCards = [
    {
      title: t('stats.products'),
      value: stats.totalProducts,
      icon: '🏍️',
      color: 'bg-blue-500'
    },
    {
      title: t('stats.views'),
      value: stats.totalViews,
      icon: '👁️',
      color: 'bg-green-500'
    },
    {
      title: t('stats.contacts'),
      value: stats.totalContacts,
      icon: '📧',
      color: 'bg-yellow-500'
    },
    {
      title: t('stats.orders'),
      value: stats.totalOrders,
      icon: '🛒',
      color: 'bg-red-500'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${card.color} text-white rounded-lg p-3 mr-4`}>
                <span className="text-2xl">{card.icon}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">{t('recentActivity.title')}</h2>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500 py-8">
            <p>{t('recentActivity.noActivity')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}