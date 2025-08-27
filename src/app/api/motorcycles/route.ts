import { NextResponse } from 'next/server';
import { getMotorcycles } from '@/data/products-db';

export async function GET() {
  try {
    const motorcycles = await getMotorcycles();
    return NextResponse.json({ motorcycles });
  } catch (error) {
    console.error('Error fetching motorcycles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch motorcycles' },
      { status: 500 }
    );
  }
}