// Simple JSON-based data store for development
// Can be replaced with SQL database later

import fs from 'fs';
import path from 'path';

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  dateOfBirth: string;
  gender?: string;
  parentName?: string;
  parentEmail?: string;
  createdAt: string;
  updatedAt: string;
}

interface AssessmentResult {
  id: string;
  childId: string;
  type: string;
  score: number;
  maxScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  answers?: any[];
  details?: Record<string, any>;
  completedAt: string;
  createdAt: string;
}

interface GameResult {
  id: string;
  childId: string;
  gameType: string;
  score: number;
  maxScore: number;
  level?: number;
  timeSpent?: number;
  observations?: string[];
  completedAt: string;
  createdAt: string;
}

interface MoodEntry {
  id: string;
  childId: string;
  mood: 'excited' | 'happy' | 'calm' | 'okay' | 'sad' | 'anxious';
  notes?: string;
  date: string;
  createdAt: string;
}

interface Session {
  id: string;
  childId: string;
  type: string;
  duration?: number;
  notes?: string;
  completedAt: string;
  createdAt: string;
}

interface CopingSkill {
  id: string;
  childId: string;
  skill: string;
  category?: string;
  effectiveness?: number;
  lastUsed?: string;
  createdAt: string;
}

interface IQTestResult {
  id: string;
  childId: string;
  testType: string;
  score: number;
  percentile?: number;
  ageEquivalent?: string;
  subScores?: Record<string, number>;
  completedAt: string;
  createdAt: string;
}

interface MCHATResult {
  id: string;
  assessmentId: string;
  visualTestResults?: Record<string, any>;
  criticalFailed: number;
  followUpNeeded: boolean;
  followUpDate?: string;
  createdAt: string;
}

interface ProgressTrack {
  id: string;
  childId: string;
  area: string;
  skill: string;
  baselineScore?: number;
  currentScore?: number;
  targetScore?: number;
  lastAssessed: string;
  nextAssessment?: string;
  createdAt: string;
  updatedAt: string;
}

interface MCHATVisualGameSession {
  id: string;
  assessmentId: string;
  childId: string;
  gameType: string; // 'eye-tracking', 'social-attention', 'facial-recognition', 'object-tracking'
  stimuliData: Record<string, any>; // Visual stimuli information
  responseData: Record<string, any>; // Child's responses
  metrics: {
    dwellTime: number; // Time spent on target areas
    fixationPoints: number; // Number of fixation points
    saccadeMetrics?: {
      count: number;
      avgDuration: number;
      avgAmplitude: number;
    };
    responseAccuracy: number;
    reactionTime: number;
  };
  score: number;
  maxScore: number;
  riskIndicators: string[];
  completedAt: string;
  createdAt: string;
}

interface ConversationalSession {
  id: string;
  childId: string;
  sessionType: 'triage' | 'check-in' | 'breathing' | 'grounding';
  messages: ChatMessage[];
  context: SessionContext;
  currentRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  escalationNeeded: boolean;
  topicsDiscussed: string[];
  copingSkillsOffered: string[];
  parentNotified: boolean;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  intent?: string;
  sentiment?: 'positive' | 'neutral' | 'concerning' | 'alert';
  flagged?: boolean;
}

interface SessionContext {
  moodState: string;
  primaryConcern?: string;
  recentEvents?: string[];
  copingResources?: string[];
  supportNetwork?: string[];
}

interface ParentTeacherFeedback {
  id: string;
  childId: string;
  feedbackType: 'parent' | 'teacher' | 'therapist';
  informantName: string;
  informantRelation: string;
  concerns: string[];
  observations: string[];
  behavioralIndicators: string[];
  socialInteractions: string;
  academicPerformance?: string;
  emotionalState: string;
  recommendedActions: string[];
  submittedAt: string;
  createdAt: string;
}

interface NeuropsychologicalResult {
  id: string;
  childId: string;
  testType: 'attention' | 'memory' | 'executive-function' | 'language' | 'visual-motor' | 'comprehensive';
  testName: string;
  subTests: NeuropsychSubTest[];
  overallScore: number;
  percentileRank: number;
  classification: 'average' | 'above-average' | 'below-average' | 'impaired';
  strengths: string[];
  concerns: string[];
  recommendations: string[];
  assessorName?: string;
  assessorCredentials?: string;
  completedAt: string;
  createdAt: string;
}

interface NeuropsychSubTest {
  name: string;
  rawScore: number;
  scaledScore: number;
  percentile: number;
  description: string;
}

interface DevelopmentScreeningResult {
  id: string;
  childId: string;
  screeningType: 'ASQ' | 'PEDS' | 'ASQ-SE' | 'M-CHAT-R' | 'custom';
  ageRange: string;
  domainScores: Record<string, number>;
  overallScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  followUpRecommended: boolean;
  followUpReasons: string[];
  strengths: string[];
  areasForSupport: string[];
  completedAt: string;
  createdAt: string;
}

interface PsychiatricEvaluationSummary {
  id: string;
  childId: string;
  evaluationDate: string;
  evaluatorName: string;
  evaluatorCredentials: string;
  presentingProblem: string;
  developmentalHistory: string;
  familyHistory: string;
  socialHistory: string;
  educationalHistory: string;
  mentalStatusExam: {
    appearance: string;
    behavior: string;
    mood: string;
    affect: string;
    thoughtProcess: string;
    thoughtContent: string;
    perception: string;
    cognition: string;
    insight: string;
    judgment: string;
  };
  diagnosticImpressions: Array<{
    disorder: string;
    dsmCode?: string;
    severity: 'mild' | 'moderate' | 'severe';
    confidence: 'definitive' | 'probable' | 'possible';
  }>;
  functionalImpairment: string;
  treatmentRecommendations: string[];
  medicationRecommendations?: string;
  therapyRecommendations: string[];
  followUpPlan: string;
  riskAssessment: {
    selfHarm: 'none' | 'low' | 'moderate' | 'high';
    harmToOthers: 'none' | 'low' | 'moderate' | 'high';
    elopement: 'none' | 'low' | 'moderate' | 'high';
  };
  createdAt: string;
}

interface IQGameResult {
  id: string;
  childId: string;
  gameType: 'pattern-recognition' | 'shape-matching' | 'sequence-memory' | 'spatial-reasoning' | 'visual-puzzles' | 'logical-reasoning';
  difficulty: 'easy' | 'medium' | 'hard';
  level: number;
  stimuliData: Record<string, any>;
  responseData: Record<string, any>;
  metrics: {
    accuracy: number;
    reactionTime: number;
    attempts: number;
    hintsUsed: number;
  };
  cognitiveDomain: 'fluid-reasoning' | 'crystallized-knowledge' | 'visual-spatial' | 'working-memory' | 'processing-speed';
  score: number;
  maxScore: number;
  percentileEstimate: number;
  ageAdjustedScore: number;
  strengths: string[];
  areasForGrowth: string[];
  completedAt: string;
  createdAt: string;
}

interface ProgressAnalytics {
  id: string;
  childId: string;
  periodStart: string;
  periodEnd: string;
  assessmentsCompleted: number;
  gamesPlayed: number;
  totalScoreImprovement: number;
  skillProgress: {
    cognitive: number;
    social: number;
    emotional: number;
    motor: number;
  };
  riskLevelChanges: {
    assessmentType: string;
    previousLevel: string;
    currentLevel: string;
  }[];
  recommendations: string[];
  generatedAt: string;
}

interface DataStore {
  childProfiles: ChildProfile[];
  assessmentResults: AssessmentResult[];
  gameResults: GameResult[];
  moodEntries: MoodEntry[];
  sessions: Session[];
  copingSkills: CopingSkill[];
  iqTestResults: IQTestResult[];
  mchatResults: MCHATResult[];
  progressTracking: ProgressTrack[];
  iqGameSessions: IQGameResult[];
  mchatVisualSessions: MCHATVisualGameSession[];
  conversationalSessions: ConversationalSession[];
  parentTeacherFeedback: ParentTeacherFeedback[];
  neuropsychologicalResults: NeuropsychologicalResult[];
  developmentScreenings: DevelopmentScreeningResult[];
  psychiatricEvaluations: PsychiatricEvaluationSummary[];
  progressAnalytics: ProgressAnalytics[];
}

const DATA_FILE = path.join(process.cwd(), 'data.json');

class JSONDataStore {
  private data: DataStore = {
    childProfiles: [],
    assessmentResults: [],
    gameResults: [],
    moodEntries: [],
    sessions: [],
    copingSkills: [],
    iqTestResults: [],
    mchatResults: [],
    progressTracking: [],
    iqGameSessions: [],
    mchatVisualSessions: [],
    conversationalSessions: [],
    parentTeacherFeedback: [],
    neuropsychologicalResults: [],
    developmentScreenings: [],
    psychiatricEvaluations: [],
    progressAnalytics: [],
  };

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        // Initialize with sample data
        this.initializeSampleData();
        this.saveData();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.initializeSampleData();
    }
  }

  private saveData() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  private initializeSampleData() {
    const now = new Date().toISOString();
    this.data.childProfiles = [
      {
        id: 'profile_1',
        name: 'Alex',
        age: 5,
        dateOfBirth: '2021-03-15',
        gender: 'male',
        parentName: 'Parent Name',
        parentEmail: 'parent@example.com',
        createdAt: now,
        updatedAt: now,
      },
    ];

    this.data.moodEntries = [
      { id: 'mood_1', childId: 'profile_1', mood: 'okay', date: '2026-01-09', createdAt: now },
      { id: 'mood_2', childId: 'profile_1', mood: 'happy', date: '2026-01-10', createdAt: now },
      { id: 'mood_3', childId: 'profile_1', mood: 'calm', date: '2026-01-11', createdAt: now },
      { id: 'mood_4', childId: 'profile_1', mood: 'happy', date: '2026-01-12', createdAt: now },
      { id: 'mood_5', childId: 'profile_1', mood: 'excited', date: '2026-01-13', createdAt: now },
      { id: 'mood_6', childId: 'profile_1', mood: 'excited', date: '2026-01-14', createdAt: now },
      { id: 'mood_7', childId: 'profile_1', mood: 'happy', date: '2026-01-15', createdAt: now },
    ];

    this.data.copingSkills = [
      { id: 'skill_1', childId: 'profile_1', skill: 'deep breathing', category: 'breathing', effectiveness: 4, createdAt: now },
      { id: 'skill_2', childId: 'profile_1', skill: 'counting to 10', category: 'cognitive', effectiveness: 5, createdAt: now },
      { id: 'skill_3', childId: 'profile_1', skill: 'talking about feelings', category: 'emotional', effectiveness: 4, createdAt: now },
      { id: 'skill_4', childId: 'profile_1', skill: 'drawing emotions', category: 'creative', effectiveness: 3, createdAt: now },
      { id: 'skill_5', childId: 'profile_1', skill: 'physical activity', category: 'physical', effectiveness: 5, createdAt: now },
    ];

    this.data.sessions = [
      { id: 'session_1', childId: 'profile_1', type: 'assessment', duration: 30, completedAt: now, createdAt: now },
    ];
  }

  // Child Profiles
  getChildProfiles() {
    return this.data.childProfiles;
  }

  getChildProfile(id: string) {
    return this.data.childProfiles.find(p => p.id === id);
  }

  createChildProfile(profile: Omit<ChildProfile, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const newProfile: ChildProfile = {
      ...profile,
      id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.data.childProfiles.push(newProfile);
    this.saveData();
    return newProfile;
  }

  updateChildProfile(id: string, updates: Partial<ChildProfile>) {
    const index = this.data.childProfiles.findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.childProfiles[index] = {
        ...this.data.childProfiles[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.saveData();
      return this.data.childProfiles[index];
    }
    return null;
  }

  // Assessment Results
  getAssessmentResults(childId?: string) {
    if (childId) {
      return this.data.assessmentResults.filter(r => r.childId === childId);
    }
    return this.data.assessmentResults;
  }

  createAssessmentResult(result: Omit<AssessmentResult, 'id' | 'createdAt'>) {
    const now = new Date().toISOString();
    const newResult: AssessmentResult = {
      ...result,
      id: `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
    };
    this.data.assessmentResults.push(newResult);
    this.saveData();
    return newResult;
  }

  // Game Results
  getGameResults(childId?: string) {
    if (childId) {
      return this.data.gameResults.filter(r => r.childId === childId);
    }
    return this.data.gameResults;
  }

  createGameResult(result: Omit<GameResult, 'id' | 'createdAt'>) {
    const now = new Date().toISOString();
    const newResult: GameResult = {
      ...result,
      id: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
    };
    this.data.gameResults.push(newResult);
    this.saveData();
    return newResult;
  }

  // Mood Entries
  getMoodEntries(childId?: string) {
    if (childId) {
      return this.data.moodEntries.filter(e => e.childId === childId);
    }
    return this.data.moodEntries;
  }

  createMoodEntry(entry: Omit<MoodEntry, 'id' | 'createdAt'>) {
    const now = new Date().toISOString();
    const newEntry: MoodEntry = {
      ...entry,
      id: `mood_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
    };
    this.data.moodEntries.push(newEntry);
    this.saveData();
    return newEntry;
  }

  // Sessions
  getSessions(childId?: string) {
    if (childId) {
      return this.data.sessions.filter(s => s.childId === childId);
    }
    return this.data.sessions;
  }

  createSession(session: Omit<Session, 'id' | 'createdAt'>) {
    const now = new Date().toISOString();
    const newSession: Session = {
      ...session,
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
    };
    this.data.sessions.push(newSession);
    this.saveData();
    return newSession;
  }

  incrementSessions(childId: string) {
    const sessions = this.getSessions(childId);
    return sessions.length;
  }

  // Coping Skills
  getCopingSkills(childId?: string) {
    if (childId) {
      return this.data.copingSkills.filter(s => s.childId === childId);
    }
    return this.data.copingSkills;
  }

  addCopingSkill(childId: string, skill: string, category?: string) {
    const existing = this.data.copingSkills.find(s => s.childId === childId && s.skill === skill);
    if (!existing) {
      const now = new Date().toISOString();
      const newSkill: CopingSkill = {
        id: `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        childId,
        skill,
        category,
        createdAt: now,
      };
      this.data.copingSkills.push(newSkill);
      this.saveData();
      return newSkill;
    }
    return existing;
  }

  // IQ Test Results
  getIQTestResults(childId?: string) {
    if (childId) {
      return this.data.iqTestResults.filter(r => r.childId === childId);
    }
    return this.data.iqTestResults;
  }

  createIQTestResult(result: Omit<IQTestResult, 'id' | 'createdAt'>) {
    const now = new Date().toISOString();
    const newResult: IQTestResult = {
      ...result,
      id: `iq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
    };
    this.data.iqTestResults.push(newResult);
    this.saveData();
    return newResult;
  }

  // M-CHAT Results
  getMCHATResults(assessmentId?: string) {
    if (assessmentId) {
      return this.data.mchatResults.filter(r => r.assessmentId === assessmentId);
    }
    return this.data.mchatResults;
  }

  createMCHATResult(result: Omit<MCHATResult, 'id' | 'createdAt'>) {
    const now = new Date().toISOString();
    const newResult: MCHATResult = {
      ...result,
      id: `mchat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
    };
    this.data.mchatResults.push(newResult);
    this.saveData();
    return newResult;
  }

  // Progress Tracking
  getProgressTracking(childId?: string) {
    if (childId) {
      return this.data.progressTracking.filter(p => p.childId === childId);
    }
    return this.data.progressTracking;
  }

  createProgressTrack(track: Omit<ProgressTrack, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const newTrack: ProgressTrack = {
      ...track,
      id: `progress_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    this.data.progressTracking.push(newTrack);
    this.saveData();
    return newTrack;
  }

  updateProgressTrack(id: string, updates: Partial<ProgressTrack>) {
    const index = this.data.progressTracking.findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.progressTracking[index] = {
        ...this.data.progressTracking[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.saveData();
      return this.data.progressTracking[index];
    }
    return null;
  }

  // IQ Game Results
  getIQGameResults(childId?: string) {
    if (childId) {
      return this.data.iqGameSessions.filter(r => r.childId === childId);
    }
    return this.data.iqGameSessions;
  }

  createIQGameResult(result: Omit<IQGameResult, 'id' | 'createdAt'>) {
    const now = new Date().toISOString();
    const newResult: IQGameResult = {
      ...result,
      id: `iqgame_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
    };
    this.data.iqGameSessions.push(newResult);
    this.saveData();
    return newResult;
  }

  // M-CHAT Visual Game Sessions
  getMCHATVisualSessions(childId?: string) {
    if (childId) {
      return this.data.mchatVisualSessions.filter(r => r.childId === childId);
    }
    return this.data.mchatVisualSessions;
  }

  createMCHATVisualSession(result: Omit<MCHATVisualGameSession, 'id' | 'createdAt'>) {
    const now = new Date().toISOString();
    const newResult: MCHATVisualGameSession = {
      ...result,
      id: `mchatvis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
    };
    this.data.mchatVisualSessions.push(newResult);
    this.saveData();
    return newResult;
  }

  // Conversational Sessions
  getConversationalSessions(childId?: string) {
    if (childId) {
      return this.data.conversationalSessions.filter(s => s.childId === childId);
    }
    return this.data.conversationalSessions;
  }

  createConversationalSession(session: Omit<ConversationalSession, 'id' | 'createdAt'>) {
    const now = new Date().toISOString();
    const newSession: ConversationalSession = {
      ...session,
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
    };
    this.data.conversationalSessions.push(newSession);
    this.saveData();
    return newSession;
  }

  updateConversationalSession(id: string, updates: Partial<ConversationalSession>) {
    const index = this.data.conversationalSessions.findIndex(s => s.id === id);
    if (index !== -1) {
      this.data.conversationalSessions[index] = {
        ...this.data.conversationalSessions[index],
        ...updates,
      };
      this.saveData();
      return this.data.conversationalSessions[index];
    }
    return null;
  }

  addMessageToSession(sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) {
    const session = this.data.conversationalSessions.find(s => s.id === sessionId);
    if (session) {
      const newMessage: ChatMessage = {
        ...message,
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
      };
      session.messages.push(newMessage);
      this.saveData();
      return newMessage;
    }
    return null;
  }

  // Parent/Teacher Feedback
  getParentTeacherFeedback(childId?: string) {
    if (childId) {
      return this.data.parentTeacherFeedback.filter(f => f.childId === childId);
    }
    return this.data.parentTeacherFeedback;
  }

  createParentTeacherFeedback(feedback: Omit<ParentTeacherFeedback, 'id' | 'createdAt'>) {
    const now = new Date().toISOString();
    const newFeedback: ParentTeacherFeedback = {
      ...feedback,
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
    };
    this.data.parentTeacherFeedback.push(newFeedback);
    this.saveData();
    return newFeedback;
  }

  // Neuropsychological Results
  getNeuropsychologicalResults(childId?: string) {
    if (childId) {
      return this.data.neuropsychologicalResults.filter(r => r.childId === childId);
    }
    return this.data.neuropsychologicalResults;
  }

  createNeuropsychologicalResult(result: Omit<NeuropsychologicalResult, 'id' | 'createdAt'>) {
    const now = new Date().toISOString();
    const newResult: NeuropsychologicalResult = {
      ...result,
      id: `neuro_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
    };
    this.data.neuropsychologicalResults.push(newResult);
    this.saveData();
    return newResult;
  }

  // Development Screening Results
  getDevelopmentScreenings(childId?: string) {
    if (childId) {
      return this.data.developmentScreenings.filter(r => r.childId === childId);
    }
    return this.data.developmentScreenings;
  }

  createDevelopmentScreening(result: Omit<DevelopmentScreeningResult, 'id' | 'createdAt'>) {
    const now = new Date().toISOString();
    const newResult: DevelopmentScreeningResult = {
      ...result,
      id: `devscreen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
    };
    this.data.developmentScreenings.push(newResult);
    this.saveData();
    return newResult;
  }

  // Psychiatric Evaluation Summaries
  getPsychiatricEvaluations(childId?: string) {
    if (childId) {
      return this.data.psychiatricEvaluations.filter(e => e.childId === childId);
    }
    return this.data.psychiatricEvaluations;
  }

  createPsychiatricEvaluation(evaluation: Omit<PsychiatricEvaluationSummary, 'id' | 'createdAt'>) {
    const now = new Date().toISOString();
    const newEvaluation: PsychiatricEvaluationSummary = {
      ...evaluation,
      id: `psych_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
    };
    this.data.psychiatricEvaluations.push(newEvaluation);
    this.saveData();
    return newEvaluation;
  }

  // Progress Analytics
  getProgressAnalytics(childId?: string) {
    if (childId) {
      return this.data.progressAnalytics.filter(a => a.childId === childId);
    }
    return this.data.progressAnalytics;
  }

  createProgressAnalytics(analytics: Omit<ProgressAnalytics, 'id' | 'generatedAt'>) {
    const now = new Date().toISOString();
    const newAnalytics: ProgressAnalytics = {
      ...analytics,
      id: `analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      generatedAt: now,
    };
    this.data.progressAnalytics.push(newAnalytics);
    this.saveData();
    return newAnalytics;
  }

  // Analytics helper methods
  calculateProgressForChild(childId: string, periodDays: number = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const assessments = this.getAssessmentResults(childId).filter(
      a => new Date(a.completedAt) >= startDate && new Date(a.completedAt) <= endDate
    );
    const games = this.getIQGameResults(childId).filter(
      g => new Date(g.completedAt) >= startDate && new Date(g.completedAt) <= endDate
    );
    const screenings = this.getDevelopmentScreenings(childId).filter(
      s => new Date(s.completedAt) >= startDate && new Date(s.completedAt) <= endDate
    );

    const avgScore = games.length > 0
      ? games.reduce((acc, g) => acc + (g.score / g.maxScore), 0) / games.length
      : 0;

    return {
      assessmentsCompleted: assessments.length + screenings.length,
      gamesPlayed: games.length,
      avgGameScore: Math.round(avgScore * 100),
      periodStart: startDate.toISOString(),
      periodEnd: endDate.toISOString(),
    };
  }
}

// Export singleton instance
export const dataStore = new JSONDataStore();

// Export types
export type {
  ChildProfile,
  AssessmentResult,
  GameResult,
  MoodEntry,
  Session,
  CopingSkill,
  IQTestResult,
  MCHATResult,
  ProgressTrack,
  MCHATVisualGameSession,
  ConversationalSession,
  ChatMessage,
  SessionContext,
  ParentTeacherFeedback,
  NeuropsychologicalResult,
  NeuropsychSubTest,
  DevelopmentScreeningResult,
  PsychiatricEvaluationSummary,
  IQGameResult,
  ProgressAnalytics,
};
