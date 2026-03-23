import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');
    return NextResponse.json(dataStore.getConsultationRequests(childId || undefined));
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return NextResponse.json({ error: 'Failed to fetch consultations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { childId, assessmentId, doctorId, mode, parentNote, preferredDate, reportSnapshot } = body;

    if (!childId || !assessmentId || !doctorId || !mode || !reportSnapshot) {
      return NextResponse.json(
        { error: 'childId, assessmentId, doctorId, mode, and reportSnapshot are required' },
        { status: 400 },
      );
    }

    const result = dataStore.createConsultationRequest({
      childId,
      assessmentId,
      doctorId,
      mode,
      parentNote,
      preferredDate,
      reportSnapshot,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating consultation request:', error);
    return NextResponse.json({ error: 'Failed to create consultation request' }, { status: 500 });
  }
}
