'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface ReferrerData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  code: string;
  status: string;
  commission: number;
  totalEarnings: number;
  createdAt: string;
}

export default function EditReferrerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    commission: 10,
    status: 'active'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [referrer, setReferrer] = useState<ReferrerData | null>(null);

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
      setFormData({
        name: data.referrer.name,
        email: data.referrer.email,
        phone: data.referrer.phone || '',
        commission: data.referrer.commission,
        status: data.referrer.status
      });
    } catch (error) {
      console.error('Error fetching referrer:', error);
      setError('Erreur lors du chargement du référenceur');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('admin-token');
      if (!token) {
        router.push('/admin-login');
        return;
      }

      const response = await fetch(`/api/referrals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }

      // Redirect to referrer details page
      router.push(`/admin/referrals/${id}`);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (error && !referrer) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
          <Link
            href="/admin/referrals"
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  if (!referrer) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-8">
          <div className="text-gray-500">Référenceur non trouvé</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Éditer le Référenceur</h1>
        <div className="flex space-x-3">
          <Link
            href={`/admin/referrals/${id}`}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Retour aux détails
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        {/* Referrer Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">📋 Informations actuelles</h3>
          <div className="text-sm text-gray-600">
            <p><strong>Code:</strong> <code className="bg-white px-2 py-1 rounded">{referrer.code}</code></p>
            <p><strong>Créé le:</strong> {new Date(referrer.createdAt).toLocaleDateString('fr-FR')}</p>
            <p><strong>Gains totaux:</strong> {referrer.totalEarnings.toLocaleString()} FCFA</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nom complet *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
              placeholder="Jean Dupont"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
              placeholder="jean@example.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Téléphone
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
              placeholder="+225 07 00 00 00 00"
            />
          </div>

          <div>
            <label htmlFor="commission" className="block text-sm font-medium text-gray-700">
              Commission (%)
            </label>
            <input
              type="number"
              id="commission"
              min="0"
              max="100"
              step="0.1"
              value={formData.commission}
              onChange={(e) => setFormData({ ...formData, commission: Number(e.target.value) })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
            />
            <p className="mt-1 text-sm text-gray-500">
              Pourcentage de commission sur les ventes générées
            </p>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Statut
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="suspended">Suspendu</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Seuls les référenceurs actifs peuvent générer des commissions
            </p>
          </div>

          <div className="pt-4 flex space-x-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
            </button>
            <Link
              href={`/admin/referrals/${id}`}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Annuler
            </Link>
          </div>
        </form>

        <div className="mt-6 p-4 bg-amber-50 rounded-lg">
          <h3 className="font-semibold text-amber-900 mb-2">⚠️ Attention</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Le code de référencement ne peut pas être modifié pour des raisons de sécurité</li>
            <li>• La modification de l&apos;email nécessite une validation de l&apos;unicité</li>
            <li>• Le changement de statut affecte immédiatement l&apos;attribution des commissions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}