'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Motorcycle } from '@/types';

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
  brakeType: z.string().min(1, 'Type de frein requis'),
  fuelCapacity: z.string().min(1, 'Capacité réservoir requise'),
  starter: z.string().min(1, 'Démarrage requis'),
  tires: z.string().min(1, 'Pneus requis'),
  containerQty: z.string().min(1, 'Quantité container requise'),
  bore: z.string().min(1, 'Alésage requis'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Motorcycle;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading: boolean;
}

export default function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="id" className="block text-sm font-medium text-gray-700">
            ID du produit
          </label>
          <input
            {...register('id')}
            type="text"
            disabled={!!initialData}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-qaski-red-primary focus:ring-qaski-red-primary disabled:bg-gray-100"
          />
          {errors.id && <p className="mt-1 text-sm text-red-600">{errors.id.message}</p>}
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nom
          </label>
          <input
            {...register('name')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-qaski-red-primary focus:ring-qaski-red-primary"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
            Sous-titre
          </label>
          <input
            {...register('subtitle')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-qaski-red-primary focus:ring-qaski-red-primary"
          />
          {errors.subtitle && <p className="mt-1 text-sm text-red-600">{errors.subtitle.message}</p>}
        </div>

        <div>
          <label htmlFor="engine" className="block text-sm font-medium text-gray-700">
            Moteur
          </label>
          <input
            {...register('engine')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-qaski-red-primary focus:ring-qaski-red-primary"
          />
          {errors.engine && <p className="mt-1 text-sm text-red-600">{errors.engine.message}</p>}
        </div>

        <div>
          <label htmlFor="power" className="block text-sm font-medium text-gray-700">
            Puissance
          </label>
          <input
            {...register('power')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-qaski-red-primary focus:ring-qaski-red-primary"
          />
          {errors.power && <p className="mt-1 text-sm text-red-600">{errors.power.message}</p>}
        </div>

        <div>
          <label htmlFor="torque" className="block text-sm font-medium text-gray-700">
            Couple
          </label>
          <input
            {...register('torque')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-qaski-red-primary focus:ring-qaski-red-primary"
          />
          {errors.torque && <p className="mt-1 text-sm text-red-600">{errors.torque.message}</p>}
        </div>

        <div>
          <label htmlFor="maxSpeed" className="block text-sm font-medium text-gray-700">
            Vitesse maximale
          </label>
          <input
            {...register('maxSpeed')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-qaski-red-primary focus:ring-qaski-red-primary"
          />
          {errors.maxSpeed && <p className="mt-1 text-sm text-red-600">{errors.maxSpeed.message}</p>}
        </div>

        <div>
          <label htmlFor="fuelConsumption" className="block text-sm font-medium text-gray-700">
            Consommation
          </label>
          <input
            {...register('fuelConsumption')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-qaski-red-primary focus:ring-qaski-red-primary"
          />
          {errors.fuelConsumption && <p className="mt-1 text-sm text-red-600">{errors.fuelConsumption.message}</p>}
        </div>

        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
            Poids
          </label>
          <input
            {...register('weight')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-qaski-red-primary focus:ring-qaski-red-primary"
          />
          {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>}
        </div>

        <div>
          <label htmlFor="maxLoad" className="block text-sm font-medium text-gray-700">
            Charge maximale
          </label>
          <input
            {...register('maxLoad')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-qaski-red-primary focus:ring-qaski-red-primary"
          />
          {errors.maxLoad && <p className="mt-1 text-sm text-red-600">{errors.maxLoad.message}</p>}
        </div>

        <div>
          <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">
            Dimensions
          </label>
          <input
            {...register('dimensions')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-qaski-red-primary focus:ring-qaski-red-primary"
          />
          {errors.dimensions && <p className="mt-1 text-sm text-red-600">{errors.dimensions.message}</p>}
        </div>

        <div>
          <label htmlFor="wheelbase" className="block text-sm font-medium text-gray-700">
            Empattement
          </label>
          <input
            {...register('wheelbase')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-qaski-red-primary focus:ring-qaski-red-primary"
          />
          {errors.wheelbase && <p className="mt-1 text-sm text-red-600">{errors.wheelbase.message}</p>}
        </div>

        <div>
          <label htmlFor="brakeType" className="block text-sm font-medium text-gray-700">
            Type de frein
          </label>
          <input
            {...register('brakeType')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-qaski-red-primary focus:ring-qaski-red-primary"
          />
          {errors.brakeType && <p className="mt-1 text-sm text-red-600">{errors.brakeType.message}</p>}
        </div>

        <div>
          <label htmlFor="fuelCapacity" className="block text-sm font-medium text-gray-700">
            Capacité réservoir
          </label>
          <input
            {...register('fuelCapacity')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-qaski-red-primary focus:ring-qaski-red-primary"
          />
          {errors.fuelCapacity && <p className="mt-1 text-sm text-red-600">{errors.fuelCapacity.message}</p>}
        </div>

        <div>
          <label htmlFor="starter" className="block text-sm font-medium text-gray-700">
            Démarrage
          </label>
          <input
            {...register('starter')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-qaski-red-primary focus:ring-qaski-red-primary"
          />
          {errors.starter && <p className="mt-1 text-sm text-red-600">{errors.starter.message}</p>}
        </div>

        <div>
          <label htmlFor="tires" className="block text-sm font-medium text-gray-700">
            Pneus
          </label>
          <input
            {...register('tires')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-qaski-red-primary focus:ring-qaski-red-primary"
          />
          {errors.tires && <p className="mt-1 text-sm text-red-600">{errors.tires.message}</p>}
        </div>

        <div>
          <label htmlFor="containerQty" className="block text-sm font-medium text-gray-700">
            Quantité container
          </label>
          <input
            {...register('containerQty')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-qaski-red-primary focus:ring-qaski-red-primary"
          />
          {errors.containerQty && <p className="mt-1 text-sm text-red-600">{errors.containerQty.message}</p>}
        </div>

        <div>
          <label htmlFor="bore" className="block text-sm font-medium text-gray-700">
            Alésage
          </label>
          <input
            {...register('bore')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-qaski-red-primary focus:ring-qaski-red-primary"
          />
          {errors.bore && <p className="mt-1 text-sm text-red-600">{errors.bore.message}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-qaski-red-primary focus:ring-offset-2"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-qaski-red-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-qaski-red-primary focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}