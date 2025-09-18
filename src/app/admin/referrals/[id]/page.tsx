'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface ReferrerDetails {
  id: string;
  name: string;
  email: string;
  phone?: string;
  code: string;
  status: string;
  commission: number;
  totalEarnings: number;
  createdAt: string;
  referralLink: string;
  stats: {
    visits: number;
    contacts: number;
    conversions: number;
    totalRevenue: number;
    conversionRate: string;
    recentVisits: number;
    recentContacts: number;
  };
  visits: Array<{
    id: string;
    page: string;
    ipAddress?: string;
    timestamp: string;
  }>;
  contacts: Array<{
    id: string;
    name: string;
    email: string;
    phone?: string;
    productInterest?: string;
    message: string;
    timestamp: string;
  }>;
  conversions: Array<{
    id: string;
    amount: number;
    product?: string;
    status: string;
    timestamp: string;
  }>;
}

export default function ReferrerDetailsPage() {
  const [referrer, setReferrer] = useState<ReferrerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    fetchReferrer();
  }, [id]);

  // Suppress ESLint warning for fetchReferrer dependency
  // fetchReferrer is stable and doesn't need to be in dependency array

  const fetchReferrer = async () => {
    try {
      const token = localStorage.getItem('admin-token');
      if (!token) {
        router.push('/admin-login');
        return;
      }

      const response = await fetch(`/api/referrals/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin-login');
          return;
        }
        if (response.status === 404) {
          setError('Référenceur non trouvé');
          return;
        }
        throw new Error('Failed to fetch referrer');
      }

      const data = await response.json();
      setReferrer(data.referrer);
    } catch (error) {
      console.error('Error fetching referrer:', error);
      setError('Erreur lors du chargement du référenceur');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(item);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem('admin-token');
      const response = await fetch(`/api/referrals/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete referrer');
      }

      router.push('/admin/referrals');
    } catch (error) {
      console.error('Error deleting referrer:', error);
      setError('Erreur lors de la suppression');
    } finally {
      setDeleting(false);
      setDeleteConfirm(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{error}</div>
        <Link
          href="/admin/referrals"
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Retour à la liste
        </Link>
      </div>
    );
  }

  if (!referrer) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Référenceur non trouvé</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{referrer.name}</h1>
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(referrer.status)}`}>
              {referrer.status === 'active' ? 'Actif' :
               referrer.status === 'inactive' ? 'Inactif' : 'Suspendu'}
            </span>
          </div>
          <div className="text-gray-600">
            <p>📧 {referrer.email}</p>
            {referrer.phone && <p>📱 {referrer.phone}</p>}
            <p>🔗 Code: <code className="bg-gray-100 px-2 py-1 rounded">{referrer.code}</code></p>
            <p>📅 Créé le {formatDate(referrer.createdAt)}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Link
            href={`/admin/referrals/${id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Éditer
          </Link>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Supprimer
          </button>
          <Link
            href="/admin/referrals"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Retour
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500">Commission</div>
          <div className="text-2xl font-bold text-blue-600">{referrer.commission}%</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Gains</div>
          <div className="text-2xl font-bold text-green-600">{referrer.totalEarnings.toLocaleString()} FCFA</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500">Taux Conversion</div>
          <div className="text-2xl font-bold text-purple-600">{referrer.stats.conversionRate}%</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500">Revenus Générés</div>
          <div className="text-2xl font-bold text-indigo-600">{referrer.stats.totalRevenue.toLocaleString()} FCFA</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Visites</h3>
          <div className="text-3xl font-bold text-blue-600">{referrer.stats.visits}</div>
          <div className="text-sm text-gray-500">
            {referrer.stats.recentVisits} ces 30 derniers jours
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Contacts</h3>
          <div className="text-3xl font-bold text-green-600">{referrer.stats.contacts}</div>
          <div className="text-sm text-gray-500">
            {referrer.stats.recentContacts} ces 30 derniers jours
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Conversions</h3>
          <div className="text-3xl font-bold text-purple-600">{referrer.stats.conversions}</div>
          <div className="text-sm text-gray-500">
            Confirmées uniquement
          </div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Lien de Référencement</h3>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={referrer.referralLink}
            readOnly
            className="flex-1 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <button
            onClick={() => copyToClipboard(referrer.referralLink, 'link')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {copiedItem === 'link' ? 'Copié !' : 'Copier'}
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Visits */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Visites Récentes</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {referrer.visits.length === 0 ? (
              <div className="p-6 text-gray-500 text-center">Aucune visite</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {referrer.visits.map((visit) => (
                  <div key={visit.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium">{visit.page}</div>
                        <div className="text-xs text-gray-500">IP: {visit.ipAddress || 'N/A'}</div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDate(visit.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Contacts Récents</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {referrer.contacts.length === 0 ? (
              <div className="p-6 text-gray-500 text-center">Aucun contact</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {referrer.contacts.map((contact) => (
                  <div key={contact.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium">{contact.name}</div>
                        <div className="text-xs text-gray-500">{contact.email}</div>
                        {contact.productInterest && (
                          <div className="text-xs text-blue-600">
                            Intérêt: {contact.productInterest}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDate(contact.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conversions */}
      {referrer.conversions.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Conversions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {referrer.conversions.map((conversion) => (
                  <tr key={conversion.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {Number(conversion.amount).toLocaleString()} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {conversion.product || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(conversion.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Confirmer la suppression
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Êtes-vous sûr de vouloir supprimer le référenceur <strong>{referrer.name}</strong> ?
                  Cette action est irréversible et supprimera également toutes les données associées.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
                >
                  {deleting ? 'Suppression...' : 'Supprimer définitivement'}
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  disabled={deleting}
                  className="mt-3 px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}