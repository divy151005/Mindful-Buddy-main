import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import type { DevelopmentScreeningResult } from '@/lib/data-store';

// Screening types
export type ScreeningType = 'ASQ' | 'PEDS' | 'ASQ-SE' | 'M-CHAT-R' | 'custom';

// Age ranges for screenings
export const AGE_RANGES = [
  { months: 2, label: '2 months' },
  { months: 4, label: '4 months' },
  { months: 6, label: '6 months' },
  { months: 9, label: '9 months' },
  { months: 12, label: '12 months' },
  { months: 18, label: '18 months' },
  { months: 24, label: '24 months' },
  { months: 30, label: '30 months' },
  { months: 36, label: '3 years' },
  { months: 48, label: '4 years' },
  { months: 60, label: '5 years' },
];

// ASQ domain questions configuration (simplified)
const ASQ_DOMAINS = ['communication', 'grossMotor', 'fineMotor', 'problemSolving', 'personalSocial'];
const ASQ_CUTOFFS: Record<number, Record<string, number>> = {
  2: { communication: 10, grossMotor: 20, fineMotor: 10, problemSolving: 10, personalSocial: 10 },
  4: { communication: 15, grossMotor: 25, fineMotor: 15, problemSolving: 15, personalSocial: 15 },
  6: { communication: 20, grossMotor: 30, fineMotor: 20, problemSolving: 20, personalSocial: 20 },
  9: { communication: 25, grossMotor: 35, fineMotor: 25, problemSolving: 25, personalSocial: 25 },
  12: { communication: 30, grossMotor: 40, fineMotor: 30, problemSolving: 30, personalSocial: 30 },
  18: { communication: 35, grossMotor: 45, fineMotor: 35, problemSolving: 35, personalSocial: 35 },
  24: { communication: 40, grossMotor: 50, fineMotor: 40, problemSolving: 40, personalSocial: 40 },
  30: { communication: 45, grossMotor: 55, fineMotor: 45, problemSolving: 45, personalSocial: 45 },
  36: { communication: 50, grossMotor: 60, fineMotor: 50, problemSolving: 50, personalSocial: 50 },
  48: { communication: 55, grossMotor: 65, fineMotor: 55, problemSolving: 55, personalSocial: 55 },
  60: { communication: 60, grossMotor: 70, fineMotor: 60, problemSolving: 60, personalSocial: 60 },
};

// PEDS response paths
const PEDS_CONCERNS = [
  'global/cognitive',
  'global/language',
  'global/motor',
  'global/social-emotional',
  'behavior',
  'parenting concerns',
  'school',
];

// Calculate ASQ scores
function calculateASQScores(
  responses: Record<string, number>,
  ageMonths: number
): {
  domainScores: Record<string, number>;
  overallScore: number;
  concerns: string[];
  strengths: string[];
} {
  const cutoffs = ASQ_CUTOFFS[Math.min(ageMonths, 60)] || ASQ_CUTOFFS[36];
  const domainScores: Record<string, number> = {};
  let totalScore = 0;
  const concerns: string[] = [];
  const strengths: string[] = [];

  ASQ_DOMAINS.forEach(domain => {
    const score = responses[domain] || 0;
    domainScores[domain] = score;
    totalScore += score;

    if (score < cutoffs[domain]) {
      concerns.push(`${domain.replace(/([A-Z])/g, ' $1').trim()} needs attention (${score}/${cutoffs[domain]})`);
    } else {
      strengths.push(`${domain.replace(/([A-Z])/g, ' $1').trim()} on track`);
    }
  });

  return {
    domainScores,
    overallScore: totalScore,
    concerns,
    strengths,
  };
}

// Calculate PEDS risk level
function calculatePEDSResult(
  responses: Record<string, 'yes' | 'no'>,
  parentalConcerns: string[]
): {
  riskLevel: 'low' | 'moderate' | 'high';
  followUpRecommended: boolean;
  followUpReasons: string[];
} {
  let yesCount = 0;
  const concerns: string[] = [];

  Object.entries(responses).forEach(([item, answer]) => {
    if (answer === 'yes') {
      yesCount++;
      if (PEDS_CONCERNS.includes(item)) {
        concerns.push(`Concern in ${item}`);
      }
    }
  });

  // Check parental concerns
  if (parentalConcerns.length > 0) {
    yesCount += Math.min(parentalConcerns.length, 2);
    concerns.push('Parental concerns identified');
  }

  if (yesCount >= 3) {
    return {
      riskLevel: 'high',
      followUpRecommended: true,
      followUpReasons: concerns.length > 0 ? concerns : ['Multiple risk factors identified'],
    };
  } else if (yesCount >= 1) {
    return {
      riskLevel: 'moderate',
      followUpRecommended: true,
      followUpReasons: concerns.length > 0 ? concerns : ['Some developmental concerns'],
    };
  }

  return {
    riskLevel: 'low',
    followUpRecommended: false,
    followUpReasons: [],
  };
}

// Determine overall risk level
function determineOverallRisk(
  screeningType: ScreeningType,
  scores: { 
    domainScores?: Record<string, number>; 
    overallScore?: number; 
    concerns?: string[]; 
    strengths?: string[];
    riskLevel?: string 
  },
  ageMonths: number
): {
  riskLevel: 'low' | 'moderate' | 'high';
  followUpRecommended: boolean;
  followUpReasons: string[];
  strengths: string[];
  areasForSupport: string[];
} {
  const concerns: string[] = scores.concerns || [];
  const strengths: string[] = scores.strengths || [];
  let riskLevel: 'low' | 'moderate' | 'high' = 'low';
  let followUpRecommended = false;

  if (screeningType === 'PEDS') {
    if (scores.riskLevel === 'high') {
      riskLevel = 'high';
      followUpRecommended = true;
    } else if (scores.riskLevel === 'moderate') {
      riskLevel = 'moderate';
      followUpRecommended = true;
    }
  } else {
    // ASQ and other screenings
    if (concerns.length >= 3) {
      riskLevel = 'high';
      followUpRecommended = true;
    } else if (concerns.length >= 1) {
      riskLevel = 'moderate';
      followUpRecommended = true;
    }
  }

  return {
    riskLevel,
    followUpRecommended,
    followUpReasons: concerns,
    strengths,
    areasForSupport: concerns,
  };
}

// GET /api/development-screening - Get screening results
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');
    const screeningType = searchParams.get('screeningType');

    let results = dataStore.getDevelopmentScreenings(childId || undefined);

    if (screeningType) {
      results = results.filter(r => r.screeningType === screeningType);
    }

    // Get child's profile for age information
    if (childId) {
      const profile = dataStore.getChildProfile(childId);
      if (profile) {
        results = results.map(r => ({
          ...r,
          ageRange: r.ageRange || `${profile.age} years`,
        }));
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching development screenings:', error);
    return NextResponse.json({ error: 'Failed to fetch development screenings' }, { status: 500 });
  }
}

// POST /api/development-screening - Create screening result
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      childId,
      screeningType,
      ageMonths,
      responses,
      parentalConcerns,
    } = body;

    if (!childId || !screeningType || !responses) {
      return NextResponse.json({
        error: 'childId, screeningType, and responses are required',
      }, { status: 400 });
    }

    // Get age from profile if not provided
    const profile = dataStore.getChildProfile(childId);
    const effectiveAgeMonths = ageMonths || (profile?.age ? profile.age * 12 : 36);
    const ageRangeLabel = AGE_RANGES.find(r => r.months >= effectiveAgeMonths)?.label || '3 years';

    let domainScores: Record<string, number>;
    let overallScore: number;
    let concerns: string[];
    let strengths: string[];
    let pedsRiskLevel: string | undefined;

    // Calculate scores based on screening type
    if (screeningType === 'ASQ' || screeningType === 'ASQ-SE') {
      const asqResult = calculateASQScores(responses, effectiveAgeMonths);
      domainScores = asqResult.domainScores;
      overallScore = asqResult.overallScore;
      concerns = asqResult.concerns;
      strengths = asqResult.strengths;
    } else if (screeningType === 'PEDS') {
      const pedsResult = calculatePEDSResult(responses, parentalConcerns || []);
      domainScores = {};
      overallScore = 0;
      concerns = pedsResult.followUpReasons;
      strengths = [];
      pedsRiskLevel = pedsResult.riskLevel;
    } else {
      // Custom screening
      domainScores = responses as Record<string, number>;
      overallScore = Object.values(responses).reduce<number>((a, b) => a + (typeof b === 'number' ? b : 0), 0);
      concerns = Object.entries(responses)
        .filter(([_, score]) => typeof score === 'number' && (score as number) < 50)
        .map(([domain]) => `${domain} needs attention`);
      strengths = Object.entries(responses)
        .filter(([_, score]) => typeof score === 'number' && (score as number) >= 70)
        .map(([domain]) => `${domain} on track`);
    }

    const assessment = determineOverallRisk(screeningType, {
      domainScores,
      overallScore,
      concerns,
      strengths,
      riskLevel: pedsRiskLevel,
    }, effectiveAgeMonths);

    const result = dataStore.createDevelopmentScreening({
      childId,
      screeningType,
      ageRange: ageRangeLabel,
      domainScores,
      overallScore,
      riskLevel: assessment.riskLevel,
      followUpRecommended: assessment.followUpRecommended,
      followUpReasons: assessment.followUpReasons,
      strengths: assessment.strengths,
      areasForSupport: assessment.areasForSupport,
      completedAt: new Date().toISOString(),
    });

    // Update progress tracking for each domain
    if (screeningType === 'ASQ') {
      Object.entries(domainScores).forEach(([domain, score]) => {
        const existingProgress = dataStore.getProgressTracking(childId)
          .find(p => p.area === 'developmental' && p.skill === domain);

        if (existingProgress) {
          dataStore.updateProgressTrack(existingProgress.id, {
            currentScore: score,
            lastAssessed: new Date().toISOString(),
          });
        } else {
          dataStore.createProgressTrack({
            childId,
            area: 'developmental',
            skill: domain,
            currentScore: score,
            lastAssessed: new Date().toISOString(),
          });
        }
      });
    }

    return NextResponse.json({ result, assessment }, { status: 201 });
  } catch (error) {
    console.error('Error creating development screening:', error);
    return NextResponse.json({ error: 'Failed to create development screening' }, { status: 500 });
  }
}

// GET /api/development-screening/config - Get screening configurations
export async function GET_CONFIG() {
  try {
    return NextResponse.json({
      screeningTypes: [
        {
          type: 'ASQ',
          name: 'Ages & Stages Questionnaire',
          description: 'Parent-completed developmental screening tool',
          domains: ASQ_DOMAINS,
          ageRanges: AGE_RANGES,
        },
        {
          type: 'ASQ-SE',
          name: 'ASQ: Social-Emotional',
          description: 'Social-emotional development screening',
          domains: ['selfRegulation', 'compliance', 'adaptiveFunctioning', 'autonomy', 'affect', 'peerInteraction', 'parentChild'],
          ageRanges: AGE_RANGES,
        },
        {
          type: 'PEDS',
          name: 'Parents\' Evaluation of Developmental Status',
          description: 'Evidence-based developmental screening',
          concerns: PEDS_CONCERNS,
          ageRanges: AGE_RANGES,
        },
        {
          type: 'M-CHAT-R',
          name: 'Modified Checklist for Autism in Toddlers, Revised',
          description: 'Autism spectrum disorder screening',
          domains: ['jointAttention', 'pointing', 'eyeContact', 'socialSmile', 'responsiveness', 'socialInteraction'],
          ageRanges: [{ months: 16, label: '16-30 months' }, { months: 24, label: '24 months' }, { months: 30, label: '30 months' }],
        },
      ],
      riskLevels: {
        low: {
          description: 'Development appears typical',
          followUp: 'Continue routine developmental monitoring',
          interval: 'Next well-child visit',
        },
        moderate: {
          description: 'Some developmental concerns identified',
          followUp: 'Follow-up screening recommended',
          interval: '1-2 months',
        },
        high: {
          description: 'Significant developmental concerns',
          followUp: 'Comprehensive evaluation recommended',
          interval: 'Immediate referral',
        },
      },
    });
  } catch (error) {
    console.error('Error fetching screening config:', error);
    return NextResponse.json({ error: 'Failed to fetch screening configuration' }, { status: 500 });
  }
}

