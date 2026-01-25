import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import type { IQGameResult } from '@/lib/data-store';

// IQ Game Types
export type IQGameType = 
  | 'pattern-recognition'
  | 'shape-matching'
  | 'sequence-memory'
  | 'spatial-reasoning'
  | 'visual-puzzles'
  | 'logical-reasoning';

export type CognitiveDomain = 
  | 'fluid-reasoning'
  | 'crystallized-knowledge'
  | 'visual-spatial'
  | 'working-memory'
  | 'processing-speed';

export type Difficulty = 'easy' | 'medium' | 'hard';

// Game configuration for each type
const GAME_CONFIG: Record<IQGameType, {
  cognitiveDomain: CognitiveDomain;
  maxScore: number;
  questions: number;
  timeLimit: number; // seconds
  difficultyLevels: {
    easy: { scoreMultiplier: number; timeBonus: number };
    medium: { scoreMultiplier: number; timeBonus: number };
    hard: { scoreMultiplier: number; timeBonus: number };
  };
}> = {
  'pattern-recognition': {
    cognitiveDomain: 'fluid-reasoning',
    maxScore: 100,
    questions: 10,
    timeLimit: 60,
    difficultyLevels: {
      easy: { scoreMultiplier: 1.0, timeBonus: 30 },
      medium: { scoreMultiplier: 1.5, timeBonus: 15 },
      hard: { scoreMultiplier: 2.0, timeBonus: 0 },
    },
  },
  'shape-matching': {
    cognitiveDomain: 'visual-spatial',
    maxScore: 100,
    questions: 8,
    timeLimit: 45,
    difficultyLevels: {
      easy: { scoreMultiplier: 1.0, timeBonus: 20 },
      medium: { scoreMultiplier: 1.5, timeBonus: 10 },
      hard: { scoreMultiplier: 2.0, timeBonus: 0 },
    },
  },
  'sequence-memory': {
    cognitiveDomain: 'working-memory',
    maxScore: 100,
    questions: 12,
    timeLimit: 90,
    difficultyLevels: {
      easy: { scoreMultiplier: 1.0, timeBonus: 30 },
      medium: { scoreMultiplier: 1.5, timeBonus: 15 },
      hard: { scoreMultiplier: 2.0, timeBonus: 0 },
    },
  },
  'spatial-reasoning': {
    cognitiveDomain: 'visual-spatial',
    maxScore: 100,
    questions: 8,
    timeLimit: 75,
    difficultyLevels: {
      easy: { scoreMultiplier: 1.0, timeBonus: 25 },
      medium: { scoreMultiplier: 1.5, timeBonus: 10 },
      hard: { scoreMultiplier: 2.0, timeBonus: 0 },
    },
  },
  'visual-puzzles': {
    cognitiveDomain: 'fluid-reasoning',
    maxScore: 100,
    questions: 10,
    timeLimit: 120,
    difficultyLevels: {
      easy: { scoreMultiplier: 1.0, timeBonus: 40 },
      medium: { scoreMultiplier: 1.5, timeBonus: 20 },
      hard: { scoreMultiplier: 2.0, timeBonus: 0 },
    },
  },
  'logical-reasoning': {
    cognitiveDomain: 'fluid-reasoning',
    maxScore: 100,
    questions: 10,
    timeLimit: 90,
    difficultyLevels: {
      easy: { scoreMultiplier: 1.0, timeBonus: 30 },
      medium: { scoreMultiplier: 1.5, timeBonus: 15 },
      hard: { scoreMultiplier: 2.0, timeBonus: 0 },
    },
  },
};

// Age-based IQ norms (simplified percentiles by age)
const AGE_NORMS: Record<number, { mean: number; sd: number }> = {
  3: { mean: 85, sd: 15 },
  4: { mean: 90, sd: 15 },
  5: { mean: 95, sd: 15 },
  6: { mean: 100, sd: 15 },
  7: { mean: 100, sd: 15 },
  8: { mean: 100, sd: 15 },
  9: { mean: 100, sd: 15 },
  10: { mean: 100, sd: 15 },
  11: { mean: 100, sd: 15 },
  12: { mean: 100, sd: 15 },
};

// Calculate age-adjusted score
function calculateAgeAdjustedScore(rawScore: number, age: number): number {
  const norms = AGE_NORMS[Math.min(Math.max(age, 3), 12)] || { mean: 100, sd: 15 };
  const zScore = (rawScore - 50) / 15; // Normalize from 0-100 to z-score
  return Math.round(norms.mean + zScore * norms.sd);
}

// Calculate percentile estimate
function calculatePercentile(score: number): number {
  const zScore = (score - 100) / 15;
  // Approximation of cumulative normal distribution
  const percentile = (1 / (1 + Math.exp(-1.7 * zScore))) * 100;
  return Math.round(Math.min(Math.max(percentile, 1), 99));
}

// Determine strengths and areas for growth
function determineCognitiveProfile(gameResults: IQGameResult[]): {
  strengths: string[];
  areasForGrowth: string[];
} {
  const domainScores: Record<CognitiveDomain, number[]> = {
    'fluid-reasoning': [],
    'crystallized-knowledge': [],
    'visual-spatial': [],
    'working-memory': [],
    'processing-speed': [],
  };

  gameResults.forEach(result => {
    const scorePercent = (result.score / result.maxScore) * 100;
    domainScores[result.cognitiveDomain].push(scorePercent);
  });

  const domainAverages: Record<string, number> = {};
  Object.entries(domainScores).forEach(([domain, scores]) => {
    domainAverages[domain] = scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0;
  });

  const strengths: string[] = [];
  const areasForGrowth: string[] = [];

  const domainLabels: Record<CognitiveDomain, string> = {
    'fluid-reasoning': 'Problem-solving and logical reasoning',
    'crystallized-knowledge': 'Knowledge and vocabulary',
    'visual-spatial': 'Visual and spatial skills',
    'working-memory': 'Memory and attention',
    'processing-speed': 'Processing speed',
  };

  Object.entries(domainAverages).forEach(([domain, avg]) => {
    if (avg >= 70) {
      strengths.push(domainLabels[domain as CognitiveDomain]);
    } else if (avg < 50) {
      areasForGrowth.push(domainLabels[domain as CognitiveDomain]);
    }
  });

  return { strengths, areasForGrowth };
}

// GET /api/iq-tests - Get IQ game results
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');
    const gameType = searchParams.get('gameType');
    const cognitiveDomain = searchParams.get('cognitiveDomain');

    let results = dataStore.getIQGameResults(childId || undefined);

    if (gameType) {
      results = results.filter(r => r.gameType === gameType);
    }

    if (cognitiveDomain) {
      results = results.filter(r => r.cognitiveDomain === cognitiveDomain);
    }

    // Get child's profile for age adjustment
    if (childId) {
      const profile = dataStore.getChildProfile(childId);
      if (profile) {
        // Add age-adjusted scores if not present
        results = results.map(r => ({
          ...r,
          ageAdjustedScore: r.ageAdjustedScore || calculateAgeAdjustedScore(
            (r.score / r.maxScore) * 100,
            profile.age
          ),
        }));
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching IQ test results:', error);
    return NextResponse.json({ error: 'Failed to fetch IQ test results' }, { status: 500 });
  }
}

// POST /api/iq-tests - Create IQ game result
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      childId,
      gameType,
      difficulty,
      level,
      stimuliData,
      responseData,
      metrics,
      cognitiveDomain,
    } = body;

    if (!childId || !gameType || !difficulty || !metrics) {
      return NextResponse.json({
        error: 'childId, gameType, difficulty, and metrics are required',
      }, { status: 400 });
    }

    const config = GAME_CONFIG[gameType as IQGameType];
    if (!config) {
      return NextResponse.json({ error: 'Invalid game type' }, { status: 400 });
    }

    // Calculate score
    const accuracyScore = metrics.accuracy * 100;
    const difficultyConfig = config.difficultyLevels[difficulty as keyof typeof config.difficultyLevels];
    const speedBonus = Math.max(0, (difficultyConfig.timeBonus - 
      (metrics.reactionTime - 1000) / 100) * 0.1);
    const hintsPenalty = metrics.hintsUsed * 5;
    
    const rawScore = Math.max(0, Math.min(100,
      accuracyScore * difficultyConfig.scoreMultiplier - hintsPenalty + speedBonus
    ));

    const score = Math.round(rawScore);
    const percentile = calculatePercentile(score);

    // Get child's age for age adjustment
    const profile = dataStore.getChildProfile(childId);
    const age = profile?.age || 6;
    const ageAdjustedScore = calculateAgeAdjustedScore(score, age);

    // Get previous results for cognitive profile
    const previousResults = dataStore.getIQGameResults(childId);
    const { strengths, areasForGrowth } = determineCognitiveProfile([
      ...previousResults,
      { ...body, score, maxScore: config.maxScore } as IQGameResult,
    ]);

    const result = dataStore.createIQGameResult({
      childId,
      gameType,
      difficulty,
      level: level || 1,
      stimuliData: stimuliData || {},
      responseData: responseData || {},
      metrics,
      cognitiveDomain: cognitiveDomain || config.cognitiveDomain,
      score,
      maxScore: config.maxScore,
      percentileEstimate: percentile,
      ageAdjustedScore,
      strengths,
      areasForGrowth,
      completedAt: new Date().toISOString(),
    });

    // Update progress tracking
    const existingProgress = dataStore.getProgressTracking(childId)
      .find(p => p.area === 'cognitive' && p.skill === gameType);

    if (existingProgress) {
      dataStore.updateProgressTrack(existingProgress.id, {
        currentScore: score,
        lastAssessed: new Date().toISOString(),
      });
    } else {
      dataStore.createProgressTrack({
        childId,
        area: 'cognitive',
        skill: gameType,
        baselineScore: score,
        currentScore: score,
        targetScore: Math.min(100, score + 10),
        lastAssessed: new Date().toISOString(),
      });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating IQ test result:', error);
    return NextResponse.json({ error: 'Failed to create IQ test result' }, { status: 500 });
  }
}

// GET /api/iq-tests/config - Get available game configurations
export async function GET_CONFIG() {
  try {
    const games = Object.entries(GAME_CONFIG).map(([type, config]) => ({
      type,
      cognitiveDomain: config.cognitiveDomain,
      maxScore: config.maxScore,
      questions: config.questions,
      timeLimit: config.timeLimit,
      difficultyLevels: Object.keys(config.difficultyLevels),
    }));

    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching IQ test config:', error);
    return NextResponse.json({ error: 'Failed to fetch IQ test configuration' }, { status: 500 });
  }
}

