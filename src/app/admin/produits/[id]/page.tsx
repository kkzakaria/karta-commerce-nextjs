'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  subtitle: z.string().min(1, 'Sous-titre requis'),
  engine: z.string().min(1, 'Moteur requis'),
  power: z.string().min(1, 'Puissance requise'),
  torque: z.string().min(1, 'Couple requis'),
  maxSpeed: z.string().min(1, 'Vitesse max requise'),
  fuelConsumption: z.string().min(1, 'Consommation requise'),
  weight: z.string().min(1, 'Poids requis'),
  maxLoad: z.string().min(1, 'Charge max requise'),
  dimensions: z.string().min(1, 'Dimensions requises'),
  wheelbase: z.string().min(1, 'Empattement requis'),
  brakeType: z.string().min(1, 'Type de freins requis'),
  fuelCapacity: z.string().min(1, 'Capacité réservoir requise'),
  starter: z.string().min(1, 'Démarrage requis'),
  tires: z.string().min(1, 'Pneus requis'),
  bore: z.string().min(1, 'Alésage requis'),
});

type ProductForm = z.infer<typeof productSchema>;

interface Motorcycle extends ProductForm {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditProductPage() {
  const t = useTranslations('Admin');
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [error, setError] = useState('');
  const [product, setProduct] = useState<Motorcycle | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Produit non trouvé');
      }

      const data = await response.json();
      setProduct(data);

      // Populate form
      Object.keys(data).forEach((key) => {
        if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
          setValue(key as keyof ProductForm, data[key]);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const onSubmit = async (data: ProductForm) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la mise à jour');
      }

      router.push('/admin/produits');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-600">Chargement du produit...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Produit non trouvé
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier le Produit</h1>
          <p className="text-gray-600">Modifiez les informations de {product.name}</p>
        </div>
        <button
          onClick={() => router.push('/admin/produits')}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Retour à la liste
        </button>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                {...register('name')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Sous-titre</label>
              <input
                {...register('subtitle')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.subtitle && <p className="mt-1 text-sm text-red-600">{errors.subtitle.message}</p>}
            </div>

            {/* Engine */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Moteur</label>
              <input
                {...register('engine')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.engine && <p className="mt-1 text-sm text-red-600">{errors.engine.message}</p>}
            </div>

            {/* Power */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Puissance</label>
              <input
                {...register('power')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.power && <p className="mt-1 text-sm text-red-600">{errors.power.message}</p>}
            </div>

            {/* Continue with all other fields... */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Couple</label>
              <input
                {...register('torque')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.torque && <p className="mt-1 text-sm text-red-600">{errors.torque.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Vitesse max</label>
              <input
                {...register('maxSpeed')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.maxSpeed && <p className="mt-1 text-sm text-red-600">{errors.maxSpeed.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Consommation</label>
              <input
                {...register('fuelConsumption')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.fuelConsumption && <p className="mt-1 text-sm text-red-600">{errors.fuelConsumption.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Poids</label>
              <input
                {...register('weight')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>}
            </div>

            {/* Add remaining fields following the same pattern */}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/produits')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}