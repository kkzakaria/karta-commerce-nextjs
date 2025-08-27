import { prisma } from '@/lib/db';
import { Motorcycle } from '@/types';

// Cache for better performance
let cachedMotorcycles: Motorcycle[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getMotorcycles(): Promise<Motorcycle[]> {
  const now = Date.now();
  
  // Return cached data if still fresh
  if (cachedMotorcycles && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedMotorcycles;
  }

  try {
    // Fetch from database
    const motorcyclesFromDb = await prisma.motorcycle.findMany({
      orderBy: { name: 'asc' },
    });

    // Convert Prisma types to our Motorcycle interface
    cachedMotorcycles = motorcyclesFromDb.map(bike => ({
      id: bike.id,
      name: bike.name,
      subtitle: bike.subtitle,
      engine: bike.engine,
      power: bike.power,
      torque: bike.torque,
      maxSpeed: bike.maxSpeed,
      fuelConsumption: bike.fuelConsumption,
      weight: bike.weight,
      maxLoad: bike.maxLoad,
      dimensions: bike.dimensions,
      wheelbase: bike.wheelbase,
      brakeType: bike.brakeType,
      fuelCapacity: bike.fuelCapacity,
      starter: bike.starter,
      tires: bike.tires,
      containerQty: bike.containerQty,
      bore: bike.bore,
    }));

    cacheTimestamp = now;
    return cachedMotorcycles;

  } catch (error) {
    console.error('Error fetching motorcycles from database:', error);
    
    // Fallback to static data if database fails
    const { motorcycles } = await import('./products');
    return motorcycles;
  }
}

export async function getMotorcycleById(id: string): Promise<Motorcycle | undefined> {
  try {
    const motorcycle = await prisma.motorcycle.findUnique({
      where: { id },
    });

    if (!motorcycle) return undefined;

    return {
      id: motorcycle.id,
      name: motorcycle.name,
      subtitle: motorcycle.subtitle,
      engine: motorcycle.engine,
      power: motorcycle.power,
      torque: motorcycle.torque,
      maxSpeed: motorcycle.maxSpeed,
      fuelConsumption: motorcycle.fuelConsumption,
      weight: motorcycle.weight,
      maxLoad: motorcycle.maxLoad,
      dimensions: motorcycle.dimensions,
      wheelbase: motorcycle.wheelbase,
      brakeType: motorcycle.brakeType,
      fuelCapacity: motorcycle.fuelCapacity,
      starter: motorcycle.starter,
      tires: motorcycle.tires,
      containerQty: motorcycle.containerQty,
      bore: motorcycle.bore,
    };

  } catch (error) {
    console.error('Error fetching motorcycle from database:', error);
    
    // Fallback to static data
    const { getMotorcycleById: getStaticMotorcycle } = await import('./products');
    return getStaticMotorcycle(id);
  }
}

// Function to invalidate cache (call this after admin updates)
export function invalidateCache(): void {
  cachedMotorcycles = null;
  cacheTimestamp = 0;
}

// Re-export contact info (unchanged)
export { contactInfo } from './products';