import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/admin-middleware';

const motorcycleSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  engine: z.string().min(1, 'Engine is required'),
  power: z.string().min(1, 'Power is required'),
  torque: z.string().min(1, 'Torque is required'),
  maxSpeed: z.string().min(1, 'Max speed is required'),
  fuelConsumption: z.string().min(1, 'Fuel consumption is required'),
  weight: z.string().min(1, 'Weight is required'),
  maxLoad: z.string().min(1, 'Max load is required'),
  dimensions: z.string().min(1, 'Dimensions is required'),
  wheelbase: z.string().min(1, 'Wheelbase is required'),
  brakeType: z.string().min(1, 'Brake type is required'),
  fuelCapacity: z.string().min(1, 'Fuel capacity is required'),
  starter: z.string().min(1, 'Starter is required'),
  tires: z.string().min(1, 'Tires is required'),
  containerQty: z.string().min(1, 'Container quantity is required'),
  bore: z.string().min(1, 'Bore is required'),
});

// GET - List all motorcycles
export const GET = withAuth(async () => {
  try {
    const motorcycles = await prisma.motorcycle.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ motorcycles });
  } catch (error) {
    console.error('Error fetching motorcycles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// POST - Create new motorcycle
export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const data = motorcycleSchema.parse(body);

    // Check if motorcycle with this ID already exists
    const existing = await prisma.motorcycle.findUnique({
      where: { id: data.id },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Motorcycle with this ID already exists' },
        { status: 409 }
      );
    }

    const motorcycle = await prisma.motorcycle.create({
      data,
    });

    return NextResponse.json({ motorcycle }, { status: 201 });

  } catch (error) {
    console.error('Error creating motorcycle:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});