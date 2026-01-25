"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface ChildProfile {
  id: string
  name: string
  age: number
  dateOfBirth: string
}

interface AssessmentResult {
  id: string
  type: string
  score: number
  maxScore: number
  riskLevel: "low" | "medium" | "high"
  completedAt: string
  details: Record<string, any>
}

interface MoodEntry {
  date: string
  mood: "excited" | "happy" | "calm" | "okay" | "sad" | "anxious"
}

interface AppContextType {
  childProfile: ChildProfile | null
  setChildProfile: (profile: ChildProfile | null) => void
  assessmentResults: AssessmentResult[]
  addAssessmentResult: (result: AssessmentResult) => void
  moodEntries: MoodEntry[]
  addMoodEntry: (entry: MoodEntry) => void
  sessionsCompleted: number
  incrementSessions: () => void
  copingSkillsUsed: string[]
  addCopingSkill: (skill: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [childProfile, setChildProfile] = useState<ChildProfile | null>({
    id: "1",
    name: "Alex",
    age: 5,
    dateOfBirth: "2021-03-15",
  })

  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([])
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    { date: "2026-01-09", mood: "okay" },
    { date: "2026-01-10", mood: "happy" },
    { date: "2026-01-11", mood: "calm" },
    { date: "2026-01-12", mood: "happy" },
    { date: "2026-01-13", mood: "excited" },
    { date: "2026-01-14", mood: "excited" },
    { date: "2026-01-15", mood: "happy" },
  ])
  const [sessionsCompleted, setSessionsCompleted] = useState(12)
  const [copingSkillsUsed, setCopingSkillsUsed] = useState<string[]>([
    "deep breathing",
    "counting to 10",
    "talking about feelings",
    "drawing emotions",
    "physical activity",
  ])

  const addAssessmentResult = (result: AssessmentResult) => {
    setAssessmentResults((prev) => [...prev, result])
  }

  const addMoodEntry = (entry: MoodEntry) => {
    setMoodEntries((prev) => [...prev, entry])
  }

  const incrementSessions = () => {
    setSessionsCompleted((prev) => prev + 1)
  }

  const addCopingSkill = (skill: string) => {
    if (!copingSkillsUsed.includes(skill)) {
      setCopingSkillsUsed((prev) => [...prev, skill])
    }
  }

  return (
    <AppContext.Provider
      value={{
        childProfile,
        setChildProfile,
        assessmentResults,
        addAssessmentResult,
        moodEntries,
        addMoodEntry,
        sessionsCompleted,
        incrementSessions,
        copingSkillsUsed,
        addCopingSkill,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
