import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import type { ProgressAnalytics } from '@/lib/data-store';

// Skill areas
export type SkillArea = 'cognitive' | 'social' | 'emotional' | 'motor' | 'developmental';

// Calculate overall progress for a child
function calculateOverallProgress(
  childId: string,
  periodDays: number = 30
): ProgressAnalytics {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - periodDays);

  // Get all relevant data
  const assessments = dataStore.getAssessmentResults(childId);
  const games = dataStore.getIQGameResults(childId);
  const screenings = dataStore.getDevelopmentScreenings(childId);
  const progressTracks = dataStore.getProgressTracking(childId);

  // Filter to period
  const periodAssessments = assessments.filter(
    a => new Date(a.completedAt) >= startDate && new Date(a.completedAt) <= endDate
  );
  const periodGames = games.filter(
    g => new Date(g.completedAt) >= startDate && new Date(g.completedAt) <= endDate
  );
  const periodScreenings = screenings.filter(
    s => new Date(s.completedAt) >= startDate && new Date(s.completedAt) <= endDate
  );

  // Calculate skill progress
  const skillProgress = {
    cognitive: calculateAreaProgress(progressTracks, 'cognitive'),
    social: calculateAreaProgress(progressTracks, 'social'),
    emotional: calculateAreaProgress(progressTracks, 'emotional'),
    motor: calculateAreaProgress(progressTracks, 'motor'),
  };

  // Calculate total score improvement
  const gamesWithScores = periodGames.map(g => ({
    score: (g.score / g.maxScore) * 100,
    date: new Date(g.completedAt),
  }));

  let totalScoreImprovement = 0;
  if (gamesWithScores.length >= 2) {
    const sortedGames = gamesWithScores.sort((a, b) => a.date.getTime() - b.date.getTime());
    const firstScore = sortedGames[0].score;
    const lastScore = sortedGames[sortedGames.length - 1].score;
    totalScoreImprovement = Math.round(lastScore - firstScore);
  }

  // Calculate risk level changes
  const riskLevelChanges = calculateRiskLevelChanges(periodAssessments, periodScreenings);

  // Generate recommendations
  const recommendations = generateRecommendations(skillProgress, riskLevelChanges);

  return {
    id: `analytics_${Date.now()}`,
    childId,
    periodStart: startDate.toISOString(),
    periodEnd: endDate.toISOString(),
    assessmentsCompleted: periodAssessments.length + periodScreenings.length,
    gamesPlayed: periodGames.length,
    totalScoreImprovement,
    skillProgress,
    riskLevelChanges,
    recommendations,
    generatedAt: new Date().toISOString(),
  };
}

// Calculate progress for a specific area
function calculateAreaProgress(
  progressTracks: ReturnType<typeof dataStore.getProgressTracking>,
  area: string
): number {
  const areaTracks = progressTracks.filter(p => p.area === area);
  
  if (areaTracks.length === 0) return 50;

  const totalProgress = areaTracks.reduce((sum, track) => {
    if (track.currentScore !== undefined && track.targetScore !== undefined) {
      const progress = track.targetScore > track.currentScore
        ? (track.currentScore / track.targetScore) * 100
        : 100;
      return sum + progress;
    }
    return sum + 50;
  }, 0);

  return Math.round(totalProgress / areaTracks.length);
}

// Calculate risk level changes
function calculateRiskLevelChanges(
  assessments: ReturnType<typeof dataStore.getAssessmentResults>,
  screenings: ReturnType<typeof dataStore.getDevelopmentScreenings>
): { assessmentType: string; previousLevel: string; currentLevel: string }[] {
  const changes: { assessmentType: string; previousLevel: string; currentLevel: string }[] = [];

  Object.entries(assessments.reduce((acc, a) => {
    if (!acc[a.type] || new Date(a.completedAt) > new Date(acc[a.type].completedAt)) {
      acc[a.type] = a;
    }
    return acc;
  }, {} as Record<string, typeof assessments[0]>)).forEach(([type, assessment]) => {
    changes.push({
      assessmentType: type,
      previousLevel: 'unknown',
      currentLevel: assessment.riskLevel,
    });
  });

  return changes;
}

// Generate recommendations based on progress
function generateRecommendations(
  skillProgress: { cognitive: number; social: number; emotional: number; motor: number },
  riskLevelChanges: { assessmentType: string; previousLevel: string; currentLevel: string }[]
): string[] {
  const recommendations: string[] = [];

  const lowestArea = Object.entries(skillProgress)
    .sort(([, a], [, b]) => a - b)[0];

  if (lowestArea[1] < 50) {
    const areaRecommendations: Record<string, string[]> = {
      cognitive: ['Try IQ games for pattern recognition', 'Practice memory games daily'],
      social: ['Practice social stories', 'Role-play social scenarios'],
      emotional: ['Practice breathing exercises', 'Use emotion cards'],
      motor: ['Include fine motor activities', 'Practice gross motor activities'],
    };
    recommendations.push(...areaRecommendations[lowestArea[0]]);
  }

  const highRiskAreas = riskLevelChanges.filter(c => c.currentLevel === 'high');
  highRiskAreas.forEach(area => {
    recommendations.push(`Consider professional evaluation for ${area.assessmentType}`);
  });

  return recommendations;
}

// GET /api/progress - Get progress analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');
    const periodDays = parseInt(searchParams.get('period') || '30');
    const generate = searchParams.get('generate') === 'true';

    if (childId && generate) {
      const analytics = calculateOverallProgress(childId, periodDays);
      const savedAnalytics = dataStore.createProgressAnalytics(analytics);
      return NextResponse.json(savedAnalytics);
    }

    if (childId) {
      let analytics = dataStore.getProgressAnalytics(childId);
      
      if (analytics.length === 0) {
        const newAnalytics = calculateOverallProgress(childId, periodDays);
        analytics = [dataStore.createProgressAnalytics(newAnalytics)];
      }

      const progress = dataStore.calculateProgressForChild(childId, periodDays);
      const progressTracks = dataStore.getProgressTracking(childId);

      return NextResponse.json({
        analytics,
        currentProgress: progress,
        skillAreas: progressTracks,
      });
    }

    return NextResponse.json(dataStore.getProgressAnalytics());
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

// POST /api/progress - Update progress tracking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { childId, area, skill, currentScore, targetScore } = body;

    if (!childId || !area || !skill || currentScore === undefined) {
      return NextResponse.json({
        error: 'childId, area, skill, and currentScore are required',
      }, { status: 400 });
    }

    const existing = dataStore.getProgressTracking(childId)
      .find(p => p.area === area && p.skill === skill);

    let result;
    if (existing) {
      result = dataStore.updateProgressTrack(existing.id, {
        currentScore,
        targetScore: targetScore || existing.targetScore,
        lastAssessed: new Date().toISOString(),
      });
    } else {
      result = dataStore.createProgressTrack({
        childId,
        area,
        skill,
        currentScore,
        targetScore: targetScore || Math.min(100, currentScore + 10),
        lastAssessed: new Date().toISOString(),
      });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}

