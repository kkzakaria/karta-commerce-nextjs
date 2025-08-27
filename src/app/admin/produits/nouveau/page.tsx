'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const productSchema = z.object({
  id: z.string().min(1, 'ID requis'),
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

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductForm) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la création');
      }

      router.push('/admin/produits');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de création');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ajouter un Produit</h1>
          <p className="text-gray-600">Créez une nouvelle moto dans le catalogue</p>
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
            {/* ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700">ID Produit</label>
              <input
                {...register('id')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="qs125-8"
              />
              {errors.id && <p className="mt-1 text-sm text-red-600">{errors.id.message}</p>}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                {...register('name')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="QS125-8 Moto Sportive"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            {/* Subtitle */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Sous-titre</label>
              <input
                {...register('subtitle')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Moto sportive haute performance"
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
                placeholder="125cc 4 temps"
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
                placeholder="7.5 kW"
              />
              {errors.power && <p className="mt-1 text-sm text-red-600">{errors.power.message}</p>}
            </div>

            {/* Torque */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Couple</label>
              <input
                {...register('torque')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="8.5 N⋅m"
              />
              {errors.torque && <p className="mt-1 text-sm text-red-600">{errors.torque.message}</p>}
            </div>

            {/* Max Speed */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Vitesse max</label>
              <input
                {...register('maxSpeed')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="95 km/h"
              />
              {errors.maxSpeed && <p className="mt-1 text-sm text-red-600">{errors.maxSpeed.message}</p>}
            </div>

            {/* Fuel Consumption */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Consommation</label>
              <input
                {...register('fuelConsumption')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="2.1L/100km"
              />
              {errors.fuelConsumption && <p className="mt-1 text-sm text-red-600">{errors.fuelConsumption.message}</p>}
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Poids</label>
              <input
                {...register('weight')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="118 kg"
              />
              {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>}
            </div>

            {/* Max Load */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Charge max</label>
              <input
                {...register('maxLoad')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="150 kg"
              />
              {errors.maxLoad && <p className="mt-1 text-sm text-red-600">{errors.maxLoad.message}</p>}
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Dimensions</label>
              <input
                {...register('dimensions')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="1980×725×1080 mm"
              />
              {errors.dimensions && <p className="mt-1 text-sm text-red-600">{errors.dimensions.message}</p>}
            </div>

            {/* Wheelbase */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Empattement</label>
              <input
                {...register('wheelbase')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="1320 mm"
              />
              {errors.wheelbase && <p className="mt-1 text-sm text-red-600">{errors.wheelbase.message}</p>}
            </div>

            {/* Brake Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Type de freins</label>
              <input
                {...register('brakeType')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Disque avant/arrière"
              />
              {errors.brakeType && <p className="mt-1 text-sm text-red-600">{errors.brakeType.message}</p>}
            </div>

            {/* Fuel Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Capacité réservoir</label>
              <input
                {...register('fuelCapacity')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="12L"
              />
              {errors.fuelCapacity && <p className="mt-1 text-sm text-red-600">{errors.fuelCapacity.message}</p>}
            </div>

            {/* Starter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Démarrage</label>
              <input
                {...register('starter')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Électrique + Kick"
              />
              {errors.starter && <p className="mt-1 text-sm text-red-600">{errors.starter.message}</p>}
            </div>

            {/* Tires */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Pneus</label>
              <input
                {...register('tires')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="AV: 90/90-17, AR: 110/90-17"
              />
              {errors.tires && <p className="mt-1 text-sm text-red-600">{errors.tires.message}</p>}
            </div>

            {/* Bore */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Alésage</label>
              <input
                {...register('bore')}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="52.4×54.5 mm"
              />
              {errors.bore && <p className="mt-1 text-sm text-red-600">{errors.bore.message}</p>}
            </div>
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
              {isLoading ? 'Création...' : 'Créer le produit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}