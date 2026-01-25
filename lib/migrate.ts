import { db } from './db';
import { sql } from 'drizzle-orm';

async function migrate() {
  try {
    // Create tables
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS child_profiles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        date_of_birth TEXT NOT NULL,
        gender TEXT,
        parent_name TEXT,
        parent_email TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS assessment_results (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        type TEXT NOT NULL,
        score INTEGER NOT NULL,
        max_score INTEGER NOT NULL,
        risk_level TEXT NOT NULL,
        answers TEXT,
        details TEXT,
        completed_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (child_id) REFERENCES child_profiles(id)
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS game_results (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        game_type TEXT NOT NULL,
        score INTEGER NOT NULL,
        max_score INTEGER NOT NULL,
        level INTEGER,
        time_spent INTEGER,
        observations TEXT,
        completed_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (child_id) REFERENCES child_profiles(id)
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS mood_entries (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        mood TEXT NOT NULL,
        notes TEXT,
        date TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (child_id) REFERENCES child_profiles(id)
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        type TEXT NOT NULL,
        duration INTEGER,
        notes TEXT,
        completed_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (child_id) REFERENCES child_profiles(id)
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS coping_skills (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        skill TEXT NOT NULL,
        category TEXT,
        effectiveness INTEGER,
        last_used TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (child_id) REFERENCES child_profiles(id)
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS iq_test_results (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        test_type TEXT NOT NULL,
        score INTEGER NOT NULL,
        percentile INTEGER,
        age_equivalent TEXT,
        sub_scores TEXT,
        completed_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (child_id) REFERENCES child_profiles(id)
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS mchat_results (
        id TEXT PRIMARY KEY,
        assessment_id TEXT NOT NULL,
        visual_test_results TEXT,
        critical_failed INTEGER NOT NULL,
        follow_up_needed INTEGER NOT NULL,
        follow_up_date TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (assessment_id) REFERENCES assessment_results(id)
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS progress_tracking (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        area TEXT NOT NULL,
        skill TEXT NOT NULL,
        baseline_score INTEGER,
        current_score INTEGER,
        target_score INTEGER,
        last_assessed TEXT NOT NULL,
        next_assessment TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (child_id) REFERENCES child_profiles(id)
      )
    `);

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrate().catch(console.error);
}

export { migrate };
