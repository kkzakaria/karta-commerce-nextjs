'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Motorcycle {
  id: string;
  name: string;
  subtitle: string;
  engine: string;
  power: string;
  maxSpeed: string;
  weight: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Motorcycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/motorcycles');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des produits');
      }
      const data = await response.json();
      
      // Extract the motorcycles array from the API response
      const motorcycles = data.motorcycles || data;
      
      // Ensure we have an array
      if (Array.isArray(motorcycles)) {
        setProducts(motorcycles);
      } else {
        throw new Error('Format de données invalide');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setProducts([]); // Ensure products is always an array
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        }
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-600">Chargement des produits...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="text-gray-600">Gérez votre catalogue de motos</p>
        </div>
        <button
          onClick={() => router.push('/admin/produits/nouveau')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Ajouter un produit
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {Array.isArray(products) && products.map((product) => (
            <li key={product.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    <Image
                      src={`/${product.id}/${product.id}.png`}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-lg object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/logo_kcg.png';
                      }}
                    />
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {product.name}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <p className="truncate">{product.subtitle}</p>
                    </div>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <span className="mr-4">{product.engine}</span>
                      <span className="mr-4">{product.power}</span>
                      <span>{product.maxSpeed}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => router.push(`/admin/produits/${product.id}`)}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </li>
          ))}
          {Array.isArray(products) && products.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              Aucun produit trouvé
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}