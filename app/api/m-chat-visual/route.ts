import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import type { MCHATVisualGameSession } from '@/lib/data-store';

// M-CHAT Visual Game Types
export type MCHATVisualGameType = 
  | 'eye-tracking'
  | 'social-attention'
  | 'facial-recognition'
  | 'object-tracking'
  | 'joint-attention'
  | 'social-smile';

// Critical M-CHAT items that indicate high autism risk
const CRITICAL_ITEMS = [
  'pointing-to-share-interest',
  'joint-attention',
  'eye-contact',
  'social-smile',
  'responding-to-name',
];

// Social attention stimuli configuration
const STIMULI_CONFIG: Record<MCHATVisualGameType, {
  description: string;
  targetAreas: number;
  maxScore: number;
  riskThreshold: number;
  criticalItem: boolean;
}> = {
  'eye-tracking': {
    description: 'Tracking moving objects with eyes',
    targetAreas: 5,
    maxScore: 100,
    riskThreshold: 60,
    criticalItem: false,
  },
  'social-attention': {
    description: 'Attention to social vs non-social stimuli',
    targetAreas: 5,
    maxScore: 100,
    riskThreshold: 70,
    criticalItem: true,
  },
  'facial-recognition': {
    description: 'Recognition of facial expressions',
    targetAreas: 6,
    maxScore: 100,
    riskThreshold: 65,
    criticalItem: false,
  },
  'object-tracking': {
    description: 'Following object movements',
    targetAreas: 4,
    maxScore: 100,
    riskThreshold: 60,
    criticalItem: false,
  },
  'joint-attention': {
    description: 'Following pointing and sharing attention',
    targetAreas: 5,
    maxScore: 100,
    riskThreshold: 75,
    criticalItem: true,
  },
  'social-smile': {
    description: 'Smiling response to social interactions',
    targetAreas: 3,
    maxScore: 100,
    riskThreshold: 80,
    criticalItem: true,
  },
};

// Calculate visual attention metrics
function calculateVisualMetrics(
  responses: Array<{
    targetArea: string;
    dwellTime: number;
    fixationCount: number;
    reactionTime: number;
    correct: boolean;
  }>,
  gameType: MCHATVisualGameType
): {
  overallScore: number;
  dwellTime: number;
  fixationPoints: number;
  responseAccuracy: number;
  reactionTime: number;
  riskIndicators: string[];
} {
  const config = STIMULI_CONFIG[gameType];
  
  let totalScore = 0;
  let totalDwellTime = 0;
  let totalFixation = 0;
  let correctResponses = 0;
  let totalReactionTime = 0;
  const riskIndicators: string[] = [];

  responses.forEach(response => {
    // Score based on correctness and engagement
    const correctnessScore = response.correct ? 100 : 0;
    const engagementScore = Math.min(100, (response.dwellTime / 2000) * 100);
    const responseScore = (correctnessScore + engagementScore) / 2;
    
    totalScore += responseScore;
    totalDwellTime += response.dwellTime;
    totalFixation += response.fixationCount;
    totalReactionTime += response.reactionTime;
    
    if (response.correct) {
      correctResponses++;
    }

    // Check for risk indicators
    if (response.dwellTime < 500) {
      riskIndicators.push(`Short attention duration on ${response.targetArea}`);
    }
    if (response.fixationCount < 2) {
      riskIndicators.push(`Limited fixation on ${response.targetArea}`);
    }
    if (!response.correct) {
      riskIndicators.push(`Incorrect response to ${response.targetArea}`);
    }
  });

  const avgDwellTime = responses.length > 0 ? totalDwellTime / responses.length : 0;
  const avgFixation = responses.length > 0 ? totalFixation / responses.length : 0;
  const avgReactionTime = responses.length > 0 ? totalReactionTime / responses.length : 0;
  const accuracy = (correctResponses / responses.length) * 100 || 0;

  const overallScore = Math.round(totalScore / responses.length) || 0;

  return {
    overallScore,
    dwellTime: Math.round(avgDwellTime),
    fixationPoints: Math.round(avgFixation),
    responseAccuracy: Math.round(accuracy),
    reactionTime: Math.round(avgReactionTime),
    riskIndicators,
  };
}

// Determine M-CHAT risk level based on visual assessment
function determineMCHATRiskLevel(
  gameResults: Array<{ gameType: string; score: number; maxScore: number }>,
  criticalFailures: number
): {
  riskLevel: 'low' | 'medium' | 'high';
  followUpNeeded: boolean;
  recommendations: string[];
} {
  const totalScore = gameResults.reduce((sum, r) => sum + (r.score / r.maxScore) * 100, 0);
  const avgScore = gameResults.length > 0 ? totalScore / gameResults.length : 0;

  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  let followUpNeeded = false;
  const recommendations: string[] = [];

  if (criticalFailures >= 2 || avgScore < 50) {
    riskLevel = 'high';
    followUpNeeded = true;
    recommendations.push('Immediate professional evaluation recommended');
    recommendations.push('Consider comprehensive autism assessment');
  } else if (criticalFailures === 1 || avgScore < 70) {
    riskLevel = 'medium';
    followUpNeeded = true;
    recommendations.push('Follow-up assessment recommended within 1-2 months');
    recommendations.push('Monitor social communication development');
  } else {
    riskLevel = 'low';
    recommendations.push('Continue routine developmental monitoring');
    recommendations.push('Re-screen at next well-child visit');
  }

  // Check for specific concerns
  const criticalGames = gameResults.filter(r => 
    STIMULI_CONFIG[r.gameType as MCHATVisualGameType]?.criticalItem
  );
  
  criticalGames.forEach(game => {
    const scorePercent = (game.score / game.maxScore) * 100;
    if (scorePercent < 60) {
      recommendations.push(`Attention needed to ${STIMULI_CONFIG[game.gameType as MCHATVisualGameType]?.description || game.gameType}`);
    }
  });

  return { riskLevel, followUpNeeded, recommendations };
}

// GET /api/m-chat-visual - Get M-CHAT visual game results
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');
    const assessmentId = searchParams.get('assessmentId');
    const gameType = searchParams.get('gameType');

    let results = dataStore.getMCHATVisualSessions(childId || undefined);

    if (assessmentId) {
      results = results.filter(r => r.assessmentId === assessmentId);
    }

    if (gameType) {
      results = results.filter(r => r.gameType === gameType);
    }

    // Calculate summary if childId provided
    if (childId) {
      const criticalFailures = results.filter(r => r.riskIndicators.length > 3).length;
      const gameResults = results.map(r => ({
        gameType: r.gameType,
        score: r.score,
        maxScore: r.maxScore,
      }));
      
      const summary = determineMCHATRiskLevel(gameResults, criticalFailures);
      return NextResponse.json({ results, summary });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching M-CHAT visual results:', error);
    return NextResponse.json({ error: 'Failed to fetch M-CHAT visual results' }, { status: 500 });
  }
}

// POST /api/m-chat-visual - Create M-CHAT visual game result
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      assessmentId,
      childId,
      gameType,
      stimuliData,
      responseData,
      metrics,
    } = body;

    if (!assessmentId || !childId || !gameType || !responseData?.responses) {
      return NextResponse.json({
        error: 'assessmentId, childId, gameType, and responseData.responses are required',
      }, { status: 400 });
    }

    const config = STIMULI_CONFIG[gameType as MCHATVisualGameType];
    if (!config) {
      return NextResponse.json({ error: 'Invalid game type' }, { status: 400 });
    }

    // Calculate visual metrics
    const visualMetrics = calculateVisualMetrics(responseData.responses, gameType as MCHATVisualGameType);

    // Determine if this is a critical failure
    const isCriticalFailure = config.criticalItem && visualMetrics.overallScore < config.riskThreshold;
    const riskIndicators = isCriticalFailure 
      ? [...visualMetrics.riskIndicators, `Critical item failed: ${gameType}`]
      : visualMetrics.riskIndicators;

    // Check for follow-up criteria
    const allResults = dataStore.getMCHATVisualSessions(childId);
    const criticalFailures = allResults.filter(r => r.riskIndicators.length > 3).length + (isCriticalFailure ? 1 : 0);
    
    let followUpNeeded = criticalFailures >= 2;
    if (followUpNeeded) {
      // Create or update M-CHAT assessment result
      const mchatResult = dataStore.createMCHATResult({
        assessmentId,
        visualTestResults: {
          gameType,
          score: visualMetrics.overallScore,
          metrics: visualMetrics,
        },
        criticalFailed: criticalFailures,
        followUpNeeded,
        followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      });
    }

    const result = dataStore.createMCHATVisualSession({
      assessmentId,
      childId,
      gameType,
      stimuliData: stimuliData || {},
      responseData,
      metrics: {
        dwellTime: visualMetrics.dwellTime,
        fixationPoints: visualMetrics.fixationPoints,
        responseAccuracy: visualMetrics.responseAccuracy,
        reactionTime: visualMetrics.reactionTime,
      },
      score: visualMetrics.overallScore,
      maxScore: config.maxScore,
      riskIndicators,
      completedAt: new Date().toISOString(),
    });

    // Update progress tracking
    dataStore.createProgressTrack({
      childId,
      area: 'social',
      skill: `mchat-${gameType}`,
      currentScore: visualMetrics.overallScore,
      lastAssessed: new Date().toISOString(),
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating M-CHAT visual result:', error);
    return NextResponse.json({ error: 'Failed to create M-CHAT visual result' }, { status: 500 });
  }
}

// GET /api/m-chat-visual/config - Get available game configurations
export async function GET_CONFIG() {
  try {
    const games = Object.entries(STIMULI_CONFIG).map(([type, config]) => ({
      type,
      ...config,
    }));

    return NextResponse.json({
      games,
      criticalItems: CRITICAL_ITEMS,
      followUpCriteria: {
        highRisk: '2+ critical item failures or <50% overall score',
        mediumRisk: '1 critical item failure or <70% overall score',
        lowRisk: 'All critical items passed with >70% overall score',
      },
    });
  } catch (error) {
    console.error('Error fetching M-CHAT visual config:', error);
    return NextResponse.json({ error: 'Failed to fetch M-CHAT visual configuration' }, { status: 500 });
  }
}

// POST /api/m-chat-visual/complete - Complete M-CHAT assessment and get recommendations
export async function POST_COMPLETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { childId, assessmentId, gameResults } = body;

    if (!childId || !gameResults || !Array.isArray(gameResults)) {
      return NextResponse.json({
        error: 'childId and gameResults array are required',
      }, { status: 400 });
    }

    // Calculate overall assessment
    const criticalFailures = gameResults.filter(r => {
      const config = STIMULI_CONFIG[r.gameType as MCHATVisualGameType];
      return config?.criticalItem && (r.score / r.maxScore) * 100 < config.riskThreshold;
    }).length;

    const assessment = determineMCHATRiskLevel(gameResults, criticalFailures);

    // Create comprehensive M-CHAT result
    const result = dataStore.createMCHATResult({
      assessmentId: assessmentId || `mchat_${Date.now()}`,
      visualTestResults: { gameResults },
      criticalFailed: criticalFailures,
      followUpNeeded: assessment.followUpNeeded,
      followUpDate: assessment.followUpNeeded 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
    });

    return NextResponse.json({
      result,
      assessment,
      gameResults,
    }, { status: 201 });
  } catch (error) {
    console.error('Error completing M-CHAT assessment:', error);
    return NextResponse.json({ error: 'Failed to complete M-CHAT assessment' }, { status: 500 });
  }
}

