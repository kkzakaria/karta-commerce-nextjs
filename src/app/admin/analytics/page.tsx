'use client';

import { useState } from 'react';

interface AnalyticsData {
  totalProducts: number;
  totalViews: number;
  totalContacts: number;
  totalOrders: number;
  popularProducts: Array<{
    id: string;
    name: string;
    views: number;
    contacts: number;
  }>;
  monthlyStats: Array<{
    month: string;
    views: number;
    contacts: number;
    orders: number;
  }>;
}

export default function AnalyticsPage() {
  const [data] = useState<AnalyticsData>({
    totalProducts: 8,
    totalViews: 2450,
    totalContacts: 89,
    totalOrders: 34,
    popularProducts: [
      { id: 'qs125-8', name: 'QS125-8 Moto Sportive', views: 456, contacts: 23 },
      { id: 'dfk-qs150zh', name: 'DFK QS150ZH Tricycle', views: 389, contacts: 19 },
      { id: 'qs125-30', name: 'QS125-30 Moto Moderne', views: 312, contacts: 15 },
      { id: 'qs150zh-175', name: 'QS150ZH-175 Premium', views: 298, contacts: 14 },
    ],
    monthlyStats: [
      { month: 'Jan', views: 1200, contacts: 45, orders: 12 },
      { month: 'Fév', views: 1450, contacts: 52, orders: 18 },
      { month: 'Mar', views: 1680, contacts: 61, orders: 23 },
      { month: 'Avr', views: 1890, contacts: 67, orders: 26 },
      { month: 'Mai', views: 2100, contacts: 73, orders: 29 },
      { month: 'Jun', views: 2450, contacts: 89, orders: 34 },
    ]
  });


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Analyses et statistiques de votre site</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📊</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Vues Totales
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {data.totalViews.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500"> vs mois dernier</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📧</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Contacts
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {data.totalContacts}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">+22%</span>
              <span className="text-gray-500"> vs mois dernier</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🛒</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Commandes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {data.totalOrders}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">+17%</span>
              <span className="text-gray-500"> vs mois dernier</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">%</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Taux Conversion
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {((data.totalContacts / data.totalViews) * 100).toFixed(1)}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">+2.1%</span>
              <span className="text-gray-500"> vs mois dernier</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Products */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Produits Populaires</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {data.popularProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.contacts} contacts</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {product.views} vues
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Évolution Mensuelle</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {data.monthlyStats.map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-16 text-sm font-medium text-gray-900">
                      {month.month}
                    </div>
                    <div className="ml-4 flex space-x-4 text-sm text-gray-500">
                      <span>👁️ {month.views}</span>
                      <span>📧 {month.contacts}</span>
                      <span>🛒 {month.orders}</span>
                    </div>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(month.views / 2500) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Analyse Détaillée</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {Math.round((data.totalContacts / data.totalViews) * 100 * 10) / 10}%
              </div>
              <div className="text-sm text-gray-500 mt-1">Taux d&apos;engagement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.round((data.totalOrders / data.totalContacts) * 100)}%
              </div>
              <div className="text-sm text-gray-500 mt-1">Conversion contact → commande</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(data.totalViews / data.totalProducts)}
              </div>
              <div className="text-sm text-gray-500 mt-1">Vues moyennes par produit</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}