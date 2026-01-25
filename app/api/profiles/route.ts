import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';

// GET /api/profiles - Get all child profiles
export async function GET() {
  try {
    const profiles = dataStore.getChildProfiles();
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  }
}

// POST /api/profiles - Create a new child profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, age, dateOfBirth, gender, parentName, parentEmail } = body;

    if (!name || !age || !dateOfBirth) {
      return NextResponse.json({ error: 'Name, age, and date of birth are required' }, { status: 400 });
    }

    const profile = dataStore.createChildProfile({
      name,
      age,
      dateOfBirth,
      gender,
      parentName,
      parentEmail,
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }
}
