import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

// GET /api/mood - Get mood entries, optionally filtered by childId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');

    const entries = dataStore.getMoodEntries(childId || undefined);
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching mood entries:', error);
    return NextResponse.json({ error: 'Failed to fetch mood entries' }, { status: 500 });
  }
}

// POST /api/mood - Create a new mood entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { childId, mood, notes, date } = body;

    if (!childId || !mood) {
      return NextResponse.json({ error: 'childId and mood are required' }, { status: 400 });
    }

    const entry = dataStore.createMoodEntry({
      childId,
      mood,
      notes,
      date: date || new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('Error creating mood entry:', error);
    return NextResponse.json({ error: 'Failed to create mood entry' }, { status: 500 });
  }
}
