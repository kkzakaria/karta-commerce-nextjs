import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/admin-middleware';

const motorcycleUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  subtitle: z.string().min(1, 'Subtitle is required').optional(),
  engine: z.string().min(1, 'Engine is required').optional(),
  power: z.string().min(1, 'Power is required').optional(),
  torque: z.string().min(1, 'Torque is required').optional(),
  maxSpeed: z.string().min(1, 'Max speed is required').optional(),
  fuelConsumption: z.string().min(1, 'Fuel consumption is required').optional(),
  weight: z.string().min(1, 'Weight is required').optional(),
  maxLoad: z.string().min(1, 'Max load is required').optional(),
  dimensions: z.string().min(1, 'Dimensions is required').optional(),
  wheelbase: z.string().min(1, 'Wheelbase is required').optional(),
  brakeType: z.string().min(1, 'Brake type is required').optional(),
  fuelCapacity: z.string().min(1, 'Fuel capacity is required').optional(),
  starter: z.string().min(1, 'Starter is required').optional(),
  tires: z.string().min(1, 'Tires is required').optional(),
  bore: z.string().min(1, 'Bore is required').optional(),
});

// GET - Get single motorcycle
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  try {
    const { id } = await params;
    
    const motorcycle = await prisma.motorcycle.findUnique({
      where: { id },
    });

    if (!motorcycle) {
      return NextResponse.json(
        { error: 'Motorcycle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ motorcycle });
  } catch (error) {
    console.error('Error fetching motorcycle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update motorcycle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  try {
    const { id } = await params;
    const body = await request.json();
    const data = motorcycleUpdateSchema.parse(body);

    const motorcycle = await prisma.motorcycle.findUnique({
      where: { id },
    });

    if (!motorcycle) {
      return NextResponse.json(
        { error: 'Motorcycle not found' },
        { status: 404 }
      );
    }

    const updatedMotorcycle = await prisma.motorcycle.update({
      where: { id },
      data,
    });

    return NextResponse.json({ motorcycle: updatedMotorcycle });

  } catch (error) {
    console.error('Error updating motorcycle:', error);
    
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
}

// DELETE - Delete motorcycle
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  try {
    const { id } = await params;

    const motorcycle = await prisma.motorcycle.findUnique({
      where: { id },
    });

    if (!motorcycle) {
      return NextResponse.json(
        { error: 'Motorcycle not found' },
        { status: 404 }
      );
    }

    await prisma.motorcycle.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Motorcycle deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting motorcycle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}