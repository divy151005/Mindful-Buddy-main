import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Child profiles table
export const childProfiles = sqliteTable('child_profiles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  dateOfBirth: text('date_of_birth').notNull(),
  gender: text('gender'),
  parentName: text('parent_name'),
  parentEmail: text('parent_email'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Assessment results table
export const assessmentResults = sqliteTable('assessment_results', {
  id: text('id').primaryKey(),
  childId: text('child_id').references(() => childProfiles.id).notNull(),
  type: text('type').notNull(), // 'PSC', 'M-CHAT', 'ASQ', etc.
  score: integer('score').notNull(),
  maxScore: integer('max_score').notNull(),
  riskLevel: text('risk_level').notNull(), // 'low', 'medium', 'high'
  answers: text('answers', { mode: 'json' }), // JSON array of answers
  details: text('details', { mode: 'json' }), // Additional assessment details
  completedAt: text('completed_at').notNull(),
  createdAt: text('created_at').notNull(),
});

// Game results table
export const gameResults = sqliteTable('game_results', {
  id: text('id').primaryKey(),
  childId: text('child_id').references(() => childProfiles.id).notNull(),
  gameType: text('game_type').notNull(), // 'number-sequences', 'memory-cards', 'pattern-matching', etc.
  score: integer('score').notNull(),
  maxScore: integer('max_score').notNull(),
  level: integer('level'),
  timeSpent: integer('time_spent'), // in seconds
  observations: text('observations', { mode: 'json' }), // JSON array of observations
  completedAt: text('completed_at').notNull(),
  createdAt: text('created_at').notNull(),
});

// Mood tracking table
export const moodEntries = sqliteTable('mood_entries', {
  id: text('id').primaryKey(),
  childId: text('child_id').references(() => childProfiles.id).notNull(),
  mood: text('mood').notNull(), // 'excited', 'happy', 'calm', 'okay', 'sad', 'anxious'
  notes: text('notes'),
  date: text('date').notNull(),
  createdAt: text('created_at').notNull(),
});

// Sessions table
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  childId: text('child_id').references(() => childProfiles.id).notNull(),
  type: text('type').notNull(), // 'assessment', 'game', 'chat', etc.
  duration: integer('duration'), // in minutes
  notes: text('notes'),
  completedAt: text('completed_at').notNull(),
  createdAt: text('created_at').notNull(),
});

// Coping skills table
export const copingSkills = sqliteTable('coping_skills', {
  id: text('id').primaryKey(),
  childId: text('child_id').references(() => childProfiles.id).notNull(),
  skill: text('skill').notNull(),
  category: text('category'), // 'breathing', 'physical', 'creative', etc.
  effectiveness: integer('effectiveness'), // 1-5 rating
  lastUsed: text('last_used'),
  createdAt: text('created_at').notNull(),
});

// IQ test results table
export const iqTestResults = sqliteTable('iq_test_results', {
  id: text('id').primaryKey(),
  childId: text('child_id').references(() => childProfiles.id).notNull(),
  testType: text('test_type').notNull(), // 'fluid', 'crystallized', 'spatial', etc.
  score: integer('score').notNull(),
  percentile: integer('percentile'),
  ageEquivalent: text('age_equivalent'),
  subScores: text('sub_scores', { mode: 'json' }), // JSON object of sub-test scores
  completedAt: text('completed_at').notNull(),
  createdAt: text('created_at').notNull(),
});

// M-CHAT specific results table
export const mchatResults = sqliteTable('mchat_results', {
  id: text('id').primaryKey(),
  assessmentId: text('assessment_id').references(() => assessmentResults.id).notNull(),
  visualTestResults: text('visual_test_results', { mode: 'json' }), // Results from visual games
  criticalFailed: integer('critical_failed').notNull(),
  followUpNeeded: integer('follow_up_needed', { mode: 'boolean' }).notNull(),
  followUpDate: text('follow_up_date'),
  createdAt: text('created_at').notNull(),
});

// Progress tracking table
export const progressTracking = sqliteTable('progress_tracking', {
  id: text('id').primaryKey(),
  childId: text('child_id').references(() => childProfiles.id).notNull(),
  area: text('area').notNull(), // 'cognitive', 'social', 'emotional', 'motor'
  skill: text('skill').notNull(),
  baselineScore: integer('baseline_score'),
  currentScore: integer('current_score'),
  targetScore: integer('target_score'),
  lastAssessed: text('last_assessed').notNull(),
  nextAssessment: text('next_assessment'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Type exports for TypeScript
export type ChildProfile = typeof childProfiles.$inferSelect;
export type AssessmentResult = typeof assessmentResults.$inferSelect;
export type GameResult = typeof gameResults.$inferSelect;
export type MoodEntry = typeof moodEntries.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type CopingSkill = typeof copingSkills.$inferSelect;
export type IQTestResult = typeof iqTestResults.$inferSelect;
export type MCHATResult = typeof mchatResults.$inferSelect;
export type ProgressTrack = typeof progressTracking.$inferSelect;
