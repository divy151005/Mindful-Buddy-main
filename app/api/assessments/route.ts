import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

// GET /api/assessments - Get assessment results, optionally filtered by childId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');

    const results = dataStore.getAssessmentResults(childId || undefined);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
  }
}

// POST /api/assessments - Create a new assessment result
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { childId, type, score, maxScore, riskLevel, answers, details } = body;

    if (!childId || !type || score === undefined || !maxScore || !riskLevel) {
      return NextResponse.json({
        error: 'childId, type, score, maxScore, and riskLevel are required'
      }, { status: 400 });
    }

    const result = dataStore.createAssessmentResult({
      childId,
      type,
      score,
      maxScore,
      riskLevel,
      answers,
      details,
      completedAt: new Date().toISOString(),
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating assessment:', error);
    return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 });
  }
}
