'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ReferrerStats {
  id: string;
  name: string;
  email: string;
  phone?: string;
  code: string;
  status: string;
  commission: number;
  totalEarnings: number;
  createdAt: string;
  stats: {
    visits: number;
    contacts: number;
    conversions: number;
    totalRevenue: number;
    conversionRate: string;
  };
  referralLink: string;
}

export default function ReferralsPage() {
  const [referrers, setReferrers] = useState<ReferrerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchReferrers();
  }, [fetchReferrers]);

  const fetchReferrers = useCallback(async () => {
    try {
      const token = localStorage.getItem('admin-token');
      if (!token) {
        router.push('/admin-login');
        return;
      }

      const response = await fetch('/api/referrals/list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin-login');
          return;
        }
        throw new Error('Failed to fetch referrers');
      }

      const data = await response.json();
      setReferrers(data.referrers);
    } catch (error) {
      console.error('Error fetching referrers:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const copyToClipboard = async (text: string, code: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Référenceurs</h1>
          <p className="text-gray-600">Gérez vos partenaires référenceurs</p>
        </div>
        <Link
          href="/admin/referrals/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          + Nouveau Référenceur
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Référenceurs</div>
          <div className="text-2xl font-bold text-gray-900">{referrers.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Actifs</div>
          <div className="text-2xl font-bold text-green-600">
            {referrers.filter(r => r.status === 'active').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Visites</div>
          <div className="text-2xl font-bold text-blue-600">
            {referrers.reduce((sum, r) => sum + r.stats.visits, 0)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Conversions</div>
          <div className="text-2xl font-bold text-purple-600">
            {referrers.reduce((sum, r) => sum + r.stats.conversions, 0)}
          </div>
        </div>
      </div>

      {/* Referrers Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Référenceur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code & Lien
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statistiques
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {referrers.map((referrer) => (
              <tr key={referrer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{referrer.name}</div>
                    <div className="text-sm text-gray-500">{referrer.email}</div>
                    {referrer.phone && (
                      <div className="text-sm text-gray-400">{referrer.phone}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">{referrer.code}</code>
                      <button
                        onClick={() => copyToClipboard(referrer.code, referrer.code)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {copiedCode === referrer.code ? '✓' : '📋'}
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={referrer.referralLink}
                        readOnly
                        className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border-0 w-full"
                      />
                      <button
                        onClick={() => copyToClipboard(referrer.referralLink, `link_${referrer.code}`)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {copiedCode === `link_${referrer.code}` ? '✓' : '🔗'}
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div>👁️ {referrer.stats.visits} visites</div>
                    <div>📧 {referrer.stats.contacts} contacts</div>
                    <div>✅ {referrer.stats.conversions} conversions</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div>💰 {referrer.stats.totalRevenue.toLocaleString()} FCFA</div>
                    <div>📈 {referrer.stats.conversionRate}% conversion</div>
                    <div>💸 {referrer.commission}% commission</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(referrer.status)}`}>
                    {referrer.status === 'active' ? 'Actif' :
                     referrer.status === 'inactive' ? 'Inactif' : 'Suspendu'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/admin/referrals/${referrer.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Détails
                  </Link>
                  <button className="text-gray-600 hover:text-gray-900">
                    Éditer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {referrers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucun référenceur trouvé. Créez-en un nouveau pour commencer.
          </div>
        )}
      </div>
    </div>
  );
}