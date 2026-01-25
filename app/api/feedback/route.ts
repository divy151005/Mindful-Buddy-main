import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import type { ParentTeacherFeedback } from '@/lib/data-store';

// Feedback types
export type FeedbackType = 'parent' | 'teacher' | 'therapist';

// Common behavioral indicators
const BEHAVIORAL_INDICATORS = {
  attention: [
    'Difficulty sustaining attention',
    'Easily distracted',
    'Fails to complete tasks',
    'Does not seem to listen',
  ],
  hyperactivity: [
    'Fidgets or squirms',
    'Leaves seat inappropriately',
    'Runs or climbs excessively',
    'Difficulty playing quietly',
  ],
  impulsivity: [
    'Blurts out answers',
    'Difficulty waiting turn',
    'Interrupts others',
    'Acts without thinking',
  ],
  social: [
    'Difficulty making friends',
    'Prefers solitary activities',
    'Misinterprets social cues',
    'Unaware of social norms',
  ],
  emotional: [
    'Mood swings',
    'Easily frustrated',
    'Excessive worry',
    'Difficulty regulating emotions',
  ],
  anxiety: [
    'Excessive worry',
    'Restlessness',
    'Physical complaints',
    'Fear of new situations',
  ],
  depression: [
    'Persistent sadness',
    'Loss of interest',
    'Fatigue',
    'Feelings of worthlessness',
  ],
  aggression: [
    'Physical aggression',
    'Verbal aggression',
    'Destroys property',
    'Argumentative',
  ],
};

// Social interaction levels
const SOCIAL_INTERACTION_LEVELS = [
  'Appropriate for age',
  'Mildly limited',
  'Moderately limited',
  'Severely limited',
  'Avoids all social contact',
];

// Emotional state options
const EMOTIONAL_STATES = [
  'Stable and regulated',
  'Generally stable',
  'Occasional difficulties',
  'Frequent difficulties',
  'Emotionally dysregulated',
];

// GET /api/feedback - Get feedback entries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');
    const feedbackType = searchParams.get('feedbackType') as FeedbackType | null;

    let results = dataStore.getParentTeacherFeedback(childId || undefined);

    if (feedbackType) {
      results = results.filter(f => f.feedbackType === feedbackType);
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}

// POST /api/feedback - Create feedback entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      childId,
      feedbackType,
      informantName,
      informantRelation,
      concerns,
      observations,
      behavioralIndicators,
      socialInteractions,
      academicPerformance,
      emotionalState,
      recommendedActions,
    } = body;

    if (!childId || !feedbackType || !informantName || !informantRelation) {
      return NextResponse.json({
        error: 'childId, feedbackType, informantName, and informantRelation are required',
      }, { status: 400 });
    }

    const feedback = dataStore.createParentTeacherFeedback({
      childId,
      feedbackType,
      informantName,
      informantRelation,
      concerns: concerns || [],
      observations: observations || [],
      behavioralIndicators: behavioralIndicators || [],
      socialInteractions: socialInteractions || 'Appropriate for age',
      academicPerformance,
      emotionalState: emotionalState || 'Generally stable',
      recommendedActions: recommendedActions || [],
      submittedAt: new Date().toISOString(),
    });

    // Update progress tracking if concerns identified
    if (concerns && concerns.length > 0) {
      dataStore.createProgressTrack({
        childId,
        area: 'social',
        skill: `feedback-${feedbackType}`,
        currentScore: Math.max(0, 100 - concerns.length * 20),
        lastAssessed: new Date().toISOString(),
      });
    }

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json({ error: 'Failed to create feedback' }, { status: 500 });
  }
}

// GET /api/feedback/config - Get feedback form configuration
export async function GET_CONFIG() {
  try {
    return NextResponse.json({
      feedbackTypes: [
        {
          type: 'parent',
          label: 'Parent Feedback',
          description: 'Feedback from parents or guardians about child behavior at home',
        },
        {
          type: 'teacher',
          label: 'Teacher Feedback',
          description: 'Feedback from teachers about child behavior in school',
        },
        {
          type: 'therapist',
          label: 'Therapist Feedback',
          description: 'Feedback from mental health professionals',
        },
      ],
      behavioralIndicators: BEHAVIORAL_INDICATORS,
      socialInteractionLevels: SOCIAL_INTERACTION_LEVELS,
      emotionalStates: EMOTIONAL_STATES,
      assessmentAreas: [
        'Cognitive Development',
        'Social-Emotional Development',
        'Communication',
        'Motor Skills',
        'Adaptive Behavior',
        'Academic Performance',
        'Behavior',
      ],
    });
  } catch (error) {
    console.error('Error fetching feedback config:', error);
    return NextResponse.json({ error: 'Failed to fetch feedback configuration' }, { status: 500 });
  }
}

