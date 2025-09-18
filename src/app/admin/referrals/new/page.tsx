'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewReferrerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    commission: 10
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdReferrer, setCreatedReferrer] = useState<any>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('admin-token');
      if (!token) {
        router.push('/admin-login');
        return;
      }

      const response = await fetch('/api/referrals/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la création');
      }

      const data = await response.json();
      setCreatedReferrer(data.referrer);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copié dans le presse-papier!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (createdReferrer) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-green-800 mb-4">
            ✅ Référenceur créé avec succès!
          </h2>

          <div className="space-y-4 bg-white rounded p-4">
            <div>
              <label className="text-sm text-gray-500">Nom</label>
              <p className="font-semibold">{createdReferrer.name}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-semibold">{createdReferrer.email}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Code de référencement</label>
              <div className="flex items-center space-x-2">
                <code className="bg-gray-100 px-3 py-2 rounded font-mono text-lg">
                  {createdReferrer.code}
                </code>
                <button
                  onClick={() => copyToClipboard(createdReferrer.code)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  📋 Copier
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500">Lien de référencement</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={createdReferrer.referralLink}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-50 border rounded"
                />
                <button
                  onClick={() => copyToClipboard(createdReferrer.referralLink)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  🔗 Copier
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <Link
              href="/admin/referrals"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Voir tous les référenceurs
            </Link>
            <button
              onClick={() => {
                setCreatedReferrer(null);
                setFormData({ name: '', email: '', phone: '', commission: 10 });
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Créer un autre
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nouveau Référenceur</h1>
        <Link
          href="/admin/referrals"
          className="text-gray-600 hover:text-gray-900"
        >
          ← Retour
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
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
              value={formData.commission}
              onChange={(e) => setFormData({ ...formData, commission: Number(e.target.value) })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2 border"
            />
            <p className="mt-1 text-sm text-gray-500">
              Pourcentage de commission sur les ventes générées
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer le référenceur'}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Information</h3>
          <p className="text-sm text-blue-700">
            Un code unique sera généré automatiquement pour ce référenceur.
            Il pourra l'utiliser pour générer des liens de tracking vers votre site.
          </p>
        </div>
      </div>
    </div>
  );
}