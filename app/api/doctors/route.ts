import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

export async function GET() {
  try {
    return NextResponse.json(dataStore.getDoctors());
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}
