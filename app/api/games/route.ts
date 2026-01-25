import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

// GET /api/games - Get game results, optionally filtered by childId or gameType
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');
    const gameType = searchParams.get('gameType');

    let results = dataStore.getGameResults(childId || undefined);

    if (gameType) {
      results = results.filter(r => r.gameType === gameType);
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}

// POST /api/games - Create a new game result
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { childId, gameType, score, maxScore, level, timeSpent, observations } = body;

    if (!childId || !gameType || score === undefined || !maxScore) {
      return NextResponse.json({
        error: 'childId, gameType, score, and maxScore are required'
      }, { status: 400 });
    }

    const result = dataStore.createGameResult({
      childId,
      gameType,
      score,
      maxScore,
      level,
      timeSpent,
      observations,
      completedAt: new Date().toISOString(),
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating game result:', error);
    return NextResponse.json({ error: 'Failed to create game result' }, { status: 500 });
  }
}
