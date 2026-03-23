"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bot,
  CalendarClock,
  CheckCircle2,
  Download,
  Eye,
  HeartHandshake,
  MessageCircle,
  PhoneCall,
  Send,
  ShieldAlert,
  Stethoscope,
  UserPlus,
} from "lucide-react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  AnswerType,
  buildAiExplanation,
  buildBehavioralInsights,
  buildNextSteps,
  buildParentGuidance,
  computeFollowUpRisk,
  computeInitialMchatResult,
  getRelevantFollowUpQuestions,
  mchatQuestions,
} from "@/lib/mchat"

type ChildProfile = {
  id: string
  name: string
  age: number
  dateOfBirth: string
  parentEmail?: string
}

type Doctor = {
  id: string
  name: string
  specialization: string
  rating: number
  experienceYears: number
  languages: string[]
  modes: Array<"chat" | "appointment">
  bio: string
  nextAvailable: string
}

type AssessmentRecord = {
  id: string
  childId: string
  type: string
  score: number
  maxScore: number
  riskLevel: "low" | "medium" | "high"
  completedAt: string
  details?: Record<string, any>
}

type ConsultationRequest = {
  id: string
  doctorId: string
  mode: "chat" | "appointment"
  status: string
  createdAt: string
}

type FinalResult = {
  score: number
  maxScore: number
  criticalFailed: number
  initialRiskLevel: "low" | "medium" | "high"
  finalRiskLevel: "low" | "medium" | "high"
  followUpTriggered: boolean
  followUpScore: number
  failedQuestionIds: number[]
  aiExplanation: string
  behavioralInsights: ReturnType<typeof buildBehavioralInsights>
  nextSteps: string[]
  parentGuidance: string[]
}

const visualTests: Record<
  string,
  {
    title: string
    instructions: string
    image: string
    interaction: string
  }
> = {
  "joint-attention": {
    title: "Joint Attention Prompt",
    instructions: "Point at something interesting and notice whether your child follows your point.",
    image: "/colorful-butterfly-in-garden.jpg",
    interaction: "A shared look toward the same object can be a helpful social-communication sign.",
  },
  "pretend-play": {
    title: "Pretend Play Prompt",
    instructions: "Offer a toy cup or toy phone and see whether your child uses it in pretend play.",
    image: "/child-toy-tea-cup-colorful.jpg",
    interaction: "Pretend actions can show early symbolic and social play skills.",
  },
  "finger-movement": {
    title: "Repetitive Movement Prompt",
    instructions: "Think about recent play and whether unusual finger movements near the eyes happen repeatedly.",
    image: "/child-hands-colorful-illustration.jpg",
    interaction: "Repeated sensory-looking movements can be worth noting in the screening report.",
  },
  pointing: {
    title: "Requesting Prompt",
    instructions: "Place a favorite item out of reach and notice whether your child points to ask for help.",
    image: "/colorful-toys-on-shelf-child-reaching.jpg",
    interaction: "Pointing to request is a useful early communication signal.",
  },
  "pointing-interest": {
    title: "Sharing Interest Prompt",
    instructions: "Show your child something exciting and see whether they point just to share the moment with you.",
    image: "/airplane-in-blue-sky-child-pointing.jpg",
    interaction: "Sharing interest is different from asking for help and is important in M-CHAT screening.",
  },
  showing: {
    title: "Showing Objects Prompt",
    instructions: "Think about whether your child brings you things simply to show them to you.",
    image: "/child-showing-drawing-to-parent.jpg",
    interaction: "This helps us understand social sharing behaviors.",
  },
  "social-smile": {
    title: "Social Smile Prompt",
    instructions: "Smile warmly at your child and notice whether they smile back at you.",
    image: "/happy-parent-and-child-smiling-faces.jpg",
    interaction: "Back-and-forth smiles support social engagement.",
  },
  "eye-contact": {
    title: "Eye Contact Prompt",
    instructions: "During play or dressing, notice whether your child makes brief eye contact.",
    image: "/parent-child-eye-contact-interaction.jpg",
    interaction: "Short, comfortable eye contact counts too.",
  },
  imitation: {
    title: "Imitation Prompt",
    instructions: "Try clapping or waving and see whether your child copies the action.",
    image: "/parent-child-waving-clapping-game.jpg",
    interaction: "Imitation is another helpful social-learning skill.",
  },
  "gaze-following": {
    title: "Gaze Following Prompt",
    instructions: "Turn your head toward something interesting and see whether your child looks the same way.",
    image: "/parent-looking-at-colorful-bird-child-following-ga.jpg",
    interaction: "Following another person's gaze supports shared attention.",
  },
  "social-referencing": {
    title: "Social Referencing Prompt",
    instructions: "When something new happens, notice whether your child checks your face to read your reaction.",
    image: "/surprised-parent-face-child-looking.jpg",
    interaction: "This can show how your child uses your emotions as guidance.",
  },
}

const riskStyles = {
  low: {
    card: "border-emerald-200 bg-emerald-50/70",
    badge: "bg-emerald-100 text-emerald-700",
    icon: "text-emerald-600",
    title: "Low Risk",
  },
  medium: {
    card: "border-amber-200 bg-amber-50/80",
    badge: "bg-amber-100 text-amber-800",
    icon: "text-amber-600",
    title: "Medium Risk",
  },
  high: {
    card: "border-rose-200 bg-rose-50/80",
    badge: "bg-rose-100 text-rose-700",
    icon: "text-rose-600",
    title: "High Risk",
  },
} as const

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))

export default function MChatPage() {
  const [profiles, setProfiles] = useState<ChildProfile[]>([])
  const [selectedChildId, setSelectedChildId] = useState("")
  const [newProfile, setNewProfile] = useState({
    name: "",
    age: "",
    dateOfBirth: "",
    parentEmail: "",
  })
  const [history, setHistory] = useState<AssessmentRecord[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerType[]>(new Array(mchatQuestions.length).fill(null))
  const [showVisualPrompt, setShowVisualPrompt] = useState(false)
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, AnswerType>>({})
  const [followUpStep, setFollowUpStep] = useState(false)
  const [result, setResult] = useState<FinalResult | null>(null)
  const [savedAssessmentId, setSavedAssessmentId] = useState("")
  const [consultMode, setConsultMode] = useState<"chat" | "appointment">("chat")
  const [selectedDoctorId, setSelectedDoctorId] = useState("")
  const [consultNote, setConsultNote] = useState("")
  const [appointmentDate, setAppointmentDate] = useState("")
  const [consultStatus, setConsultStatus] = useState("")

  const selectedChild = useMemo(
    () => profiles.find((profile) => profile.id === selectedChildId) ?? null,
    [profiles, selectedChildId],
  )

  const currentQuestion = mchatQuestions[questionIndex]
  const progress = ((questionIndex + 1) / mchatQuestions.length) * 100
  const initialComputation = useMemo(() => computeInitialMchatResult(answers), [answers])
  const followUpItems = useMemo(
    () => getRelevantFollowUpQuestions(initialComputation.failedQuestionIds),
    [initialComputation.failedQuestionIds],
  )

  useEffect(() => {
    void loadInitialData()
  }, [])

  useEffect(() => {
    if (!selectedChildId) {
      setHistory([])
      setConsultations([])
      return
    }

    void loadChildData(selectedChildId)
  }, [selectedChildId])

  async function loadInitialData() {
    setLoading(true)
    try {
      const [profilesRes, doctorsRes] = await Promise.all([fetch("/api/profiles"), fetch("/api/doctors")])
      const profilesData = (await profilesRes.json()) as ChildProfile[]
      const doctorsData = (await doctorsRes.json()) as Doctor[]
      setProfiles(profilesData)
      setDoctors(doctorsData)
      if (profilesData.length > 0) {
        setSelectedChildId(profilesData[0].id)
      }
      if (doctorsData.length > 0) {
        setSelectedDoctorId(doctorsData[0].id)
      }
    } finally {
      setLoading(false)
    }
  }

  async function loadChildData(childId: string) {
    const [historyRes, consultRes] = await Promise.all([
      fetch(`/api/assessments?childId=${childId}`),
      fetch(`/api/consultations?childId=${childId}`),
    ])

    const historyData = ((await historyRes.json()) as AssessmentRecord[])
      .filter((item) => item.type === "M-CHAT")
      .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())

    const consultationData = (await consultRes.json()) as ConsultationRequest[]
    setHistory(historyData)
    setConsultations(consultationData)
  }

  async function handleCreateProfile() {
    if (!newProfile.name || !newProfile.age || !newProfile.dateOfBirth) {
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProfile.name,
          age: Number(newProfile.age),
          dateOfBirth: newProfile.dateOfBirth,
          parentEmail: newProfile.parentEmail || undefined,
        }),
      })

      const created = (await response.json()) as ChildProfile
      setProfiles((prev) => [...prev, created])
      setSelectedChildId(created.id)
      setNewProfile({ name: "", age: "", dateOfBirth: "", parentEmail: "" })
    } finally {
      setSubmitting(false)
    }
  }

  function handleAnswer(answer: AnswerType) {
    setAnswers((prev) => {
      const next = [...prev]
      next[questionIndex] = answer
      return next
    })
  }

  function handleNextQuestion() {
    if (questionIndex < mchatQuestions.length - 1) {
      setQuestionIndex((prev) => prev + 1)
      setShowVisualPrompt(false)
      return
    }

    if (initialComputation.needsFollowUp) {
      setFollowUpStep(true)
      return
    }

    void finalizeAssessment({
      followUpTriggered: false,
      followUpScore: 0,
      finalRiskLevel: initialComputation.riskLevel,
    })
  }

  async function finalizeAssessment(options: {
    followUpTriggered: boolean
    followUpScore: number
    finalRiskLevel: "low" | "medium" | "high"
  }) {
    if (!selectedChild) {
      return
    }

    setSubmitting(true)
    const behavioralInsights = buildBehavioralInsights(initialComputation.failedQuestionIds)
    const aiExplanation = buildAiExplanation(options.finalRiskLevel, selectedChild.name, options.followUpTriggered)
    const nextSteps = buildNextSteps(options.finalRiskLevel)
    const parentGuidance = buildParentGuidance(options.finalRiskLevel)

    const finalReport: FinalResult = {
      score: initialComputation.score,
      maxScore: mchatQuestions.length,
      criticalFailed: initialComputation.criticalFailed,
      initialRiskLevel: initialComputation.riskLevel,
      finalRiskLevel: options.finalRiskLevel,
      followUpTriggered: options.followUpTriggered,
      followUpScore: options.followUpScore,
      failedQuestionIds: initialComputation.failedQuestionIds,
      aiExplanation,
      behavioralInsights,
      nextSteps,
      parentGuidance,
    }

    try {
      const assessmentResponse = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: selectedChild.id,
          type: "M-CHAT",
          score: initialComputation.score,
          maxScore: mchatQuestions.length,
          riskLevel: options.finalRiskLevel,
          answers,
          details: {
            childName: selectedChild.name,
            childAge: selectedChild.age,
            criticalFailed: initialComputation.criticalFailed,
            initialRiskLevel: initialComputation.riskLevel,
            finalRiskLevel: options.finalRiskLevel,
            failedQuestionIds: initialComputation.failedQuestionIds,
            followUpTriggered: options.followUpTriggered,
            followUpScore: options.followUpScore,
            followUpAnswers,
            behavioralInsights,
            aiExplanation,
            nextSteps,
            parentGuidance,
            reminderDate: buildReminderDate(),
          },
        }),
      })

      const saved = (await assessmentResponse.json()) as AssessmentRecord
      setSavedAssessmentId(saved.id)
      setFollowUpStep(false)
      setResult(finalReport)
      await loadChildData(selectedChild.id)
    } finally {
      setSubmitting(false)
    }
  }

  function handleFollowUpSubmit() {
    const followUpResult = computeFollowUpRisk(followUpAnswers, followUpItems)
    void finalizeAssessment({
      followUpTriggered: true,
      followUpScore: followUpResult.score,
      finalRiskLevel: followUpResult.riskLevel,
    })
  }

  function buildReminderDate() {
    const reminder = new Date()
    reminder.setDate(reminder.getDate() + 30)
    return reminder.toISOString()
  }

  async function handleConsultSubmit() {
    if (!selectedChildId || !savedAssessmentId || !selectedDoctorId || !result) {
      return
    }

    setSubmitting(true)
    setConsultStatus("")
    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: selectedChildId,
          assessmentId: savedAssessmentId,
          doctorId: selectedDoctorId,
          mode: consultMode,
          parentNote: consultNote || undefined,
          preferredDate: consultMode === "appointment" ? appointmentDate || undefined : undefined,
          reportSnapshot: {
            childName: selectedChild?.name,
            score: result.score,
            riskLevel: result.finalRiskLevel,
            aiExplanation: result.aiExplanation,
          },
        }),
      })

      const created = (await response.json()) as ConsultationRequest
      setConsultations((prev) => [...prev, created])
      setConsultStatus(
        consultMode === "chat"
          ? "Chat request sent. A specialist can review the screening summary and continue the conversation."
          : "Appointment request sent. The doctor now has the assessment snapshot and preferred date.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  function handlePrintReport() {
    if (!selectedChild || !result) {
      return
    }

    const reportWindow = window.open("", "_blank", "width=900,height=700")
    if (!reportWindow) {
      return
    }

    const answerRows = mchatQuestions
      .map(
        (question, index) =>
          `<tr><td style="padding:8px;border:1px solid #ddd;">${question.id}. ${question.question}</td><td style="padding:8px;border:1px solid #ddd;">${answers[index] ?? "Not answered"}</td></tr>`,
      )
      .join("")

    reportWindow.document.write(`
      <html>
        <head>
          <title>M-CHAT Report</title>
        </head>
        <body style="font-family: Arial, sans-serif; padding: 24px; color: #111827;">
          <h1>M-CHAT Screening Report</h1>
          <p><strong>Child:</strong> ${selectedChild.name}</p>
          <p><strong>Age:</strong> ${selectedChild.age}</p>
          <p><strong>Completed:</strong> ${formatDate(new Date().toISOString())}</p>
          <p><strong>Risk Level:</strong> ${result.finalRiskLevel}</p>
          <p><strong>Score:</strong> ${result.score}/${result.maxScore}</p>
          <p><strong>AI Explanation:</strong> ${result.aiExplanation}</p>
          <p><strong>Disclaimer:</strong> This screening supports discussion only and is not a diagnosis.</p>
          <h2>Responses</h2>
          <table style="width:100%; border-collapse:collapse;">${answerRows}</table>
        </body>
      </html>
    `)
    reportWindow.document.close()
    reportWindow.focus()
    reportWindow.print()
  }

  const historyChartData = history.map((item) => ({
    date: formatDate(item.completedAt),
    score: item.score,
  }))

  const previousResult =
    history.length > 1 && history[history.length - 1]?.id === savedAssessmentId
      ? history[history.length - 2]
      : history.length > 0
        ? history[history.length - 1]
        : null
  const trendText =
    previousResult && result
      ? result.score < previousResult.score
        ? "Improving compared with the previous M-CHAT screen."
        : result.score > previousResult.score
          ? "More concerns were flagged than in the previous screen."
          : "Risk pattern is stable compared with the previous screen."
      : "This will become more useful after multiple screenings."

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading M-CHAT screening workspace...</div>
  }

  if (followUpStep) {
    const allAnswered = followUpItems.every((item) => followUpAnswers[item.id] !== undefined && followUpAnswers[item.id] !== null)

    return (
      <div className="space-y-6 fade-in-up">
        <section className="rounded-[2rem] border border-border/60 bg-gradient-to-br from-slate-50 via-white to-sky-50 shadow-sm">
          <div className="grid gap-6 px-6 py-7 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Link href="/assessments">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <span className="inline-flex rounded-full border border-primary/15 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm">
                  Follow-Up Interview
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">M-CHAT follow-up clarification</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Medium or high initial scores trigger extra questions to clarify behaviors before the final triage result is shown.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Why this matters</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Follow-up questions reduce false positives and make the final report easier for a pediatrician or specialist to review.
              </p>
            </div>
          </div>
        </section>

        <Card className="border border-border/60 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Follow-Up Questions</CardTitle>
            <CardDescription>
              These questions help reduce false positives and make the result easier for a doctor to review.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {followUpItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-border p-4">
                <p className="font-medium text-foreground">{item.prompt}</p>
                <div className="mt-3 flex gap-3">
                  <Button
                    variant={followUpAnswers[item.id] === "yes" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setFollowUpAnswers((prev) => ({ ...prev, [item.id]: "yes" }))}
                  >
                    Yes
                  </Button>
                  <Button
                    variant={followUpAnswers[item.id] === "no" ? "default" : "outline"}
                    className={cn("flex-1", followUpAnswers[item.id] === "no" && "bg-destructive text-white hover:bg-destructive/90")}
                    onClick={() => setFollowUpAnswers((prev) => ({ ...prev, [item.id]: "no" }))}
                  >
                    No
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setFollowUpStep(false)}>
                Back to Questions
              </Button>
              <Button onClick={handleFollowUpSubmit} disabled={!allAnswered || submitting}>
                {submitting ? "Finalizing..." : "Finalize Result"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (result) {
    const riskStyle = riskStyles[result.finalRiskLevel]
    const selectedDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId)

    return (
      <div className="space-y-6 fade-in-up">
        <section className="rounded-[2rem] border border-border/60 bg-gradient-to-br from-slate-50 via-white to-sky-50 shadow-sm">
          <div className="grid gap-6 px-6 py-7 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Link href="/assessments">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <span className="inline-flex rounded-full border border-primary/15 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm">
                  Screening Outcome
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">M-CHAT result and support plan</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Parent-friendly interpretation, next steps, behavioral insights, and consultation routing in one place.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button variant="outline" className="rounded-full bg-white/80" onClick={handlePrintReport}>
                <Download className="h-4 w-4" />
                Download / Print PDF
              </Button>
            </div>
          </div>
        </section>

        <Card className={cn("border shadow-sm", riskStyle.card)}>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className={cn("h-5 w-5", riskStyle.icon)} />
                  {riskStyle.title}
                </CardTitle>
                <CardDescription>
                  Initial screen: {result.initialRiskLevel}. Final triage: {result.finalRiskLevel}
                  {result.followUpTriggered ? ` after follow-up score ${result.followUpScore}.` : "."}
                </CardDescription>
              </div>
              <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", riskStyle.badge)}>
                Not a diagnosis
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard label="Items Failed" value={`${result.score}/${result.maxScore}`} />
              <MetricCard label="Critical Items Failed" value={String(result.criticalFailed)} />
              <MetricCard label="Retake Reminder" value={formatDate(buildReminderDate())} />
            </div>

            <div className="rounded-xl border border-white/60 bg-white/70 p-4">
              <div className="flex gap-3">
                <Bot className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">AI-Based Interpretation</p>
                  <p className="mt-1 text-sm text-muted-foreground">{result.aiExplanation}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background/90 p-4 text-sm text-muted-foreground">
              This screening can be used without login or diagnosis paperwork. It helps you organize concerns, not replace a clinician.
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Risk-Based Triage</CardTitle>
              <CardDescription>Recommended next steps based on the current screening pattern.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.nextSteps.map((step) => (
                <div key={step} className="flex gap-3 rounded-xl bg-muted/50 p-3">
                  <ArrowRight className="mt-0.5 h-4 w-4 text-primary" />
                  <p className="text-sm text-muted-foreground">{step}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Behavioral Insights</CardTitle>
              <CardDescription>The screening flagged these behavior areas most often.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.behavioralInsights.length > 0 ? (
                result.behavioralInsights.map((item) => (
                  <div key={item.key} className="rounded-xl border border-border p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{item.label}</p>
                      <span className="text-sm text-muted-foreground">{item.count} triggers</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.min(item.count * 25, 100)}%` }} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No strong concern areas were triggered on this screen.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Parent Guidance Module</CardTitle>
              <CardDescription>Simple activities you can start at home while observing progress.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.parentGuidance.map((tip) => (
                <div key={tip} className="flex gap-3 rounded-xl bg-muted/40 p-3">
                  <HeartHandshake className="mt-0.5 h-4 w-4 text-primary" />
                  <p className="text-sm text-muted-foreground">{tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>Previous M-CHAT scores for this child and the current trend.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-56 rounded-xl bg-muted/30 p-2">
                {historyChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historyChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    This is the first saved M-CHAT result for this child.
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{trendText}</p>
              <div className="space-y-2">
                {history.slice(-4).map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
                    <span className="text-foreground">{formatDate(item.completedAt)}</span>
                    <span className="text-muted-foreground">Score {item.score}</span>
                    <span className={cn("rounded-full px-2 py-1 text-xs font-medium", riskStyles[item.riskLevel].badge)}>
                      {item.riskLevel}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              Doctor Consultation
            </CardTitle>
            <CardDescription>
              Flow: choose consultation mode, pick a specialist, attach the report, and send the request.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              <FlowCard icon={MessageCircle} title="1. Chat" text="Use a basic async chat request when you need quick advice on the screening." />
              <FlowCard icon={CalendarClock} title="2. Book" text="Choose an appointment when you want a fuller developmental review." />
              <FlowCard icon={Send} title="3. Share Report" text="The doctor receives score, risk level, and AI summary with your note." />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Button variant={consultMode === "chat" ? "default" : "outline"} onClick={() => setConsultMode("chat")}>
                    <MessageCircle className="h-4 w-4" />
                    Chat Option
                  </Button>
                  <Button
                    variant={consultMode === "appointment" ? "default" : "outline"}
                    onClick={() => setConsultMode("appointment")}
                  >
                    <CalendarClock className="h-4 w-4" />
                    Appointment
                  </Button>
                </div>

                <label className="block space-y-2 text-sm">
                  <span className="font-medium text-foreground">Choose a specialist</span>
                  <select
                    className="border-input h-10 w-full rounded-md border bg-background px-3 text-sm"
                    value={selectedDoctorId}
                    onChange={(event) => setSelectedDoctorId(event.target.value)}
                  >
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} • {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </label>

                {consultMode === "appointment" && (
                  <label className="block space-y-2 text-sm">
                    <span className="font-medium text-foreground">Preferred appointment date</span>
                    <Input type="datetime-local" value={appointmentDate} onChange={(event) => setAppointmentDate(event.target.value)} />
                  </label>
                )}

                <label className="block space-y-2 text-sm">
                  <span className="font-medium text-foreground">Message for the doctor</span>
                  <textarea
                    className="border-input min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    placeholder="Share your biggest concerns, recent behaviors, or what kind of support you want."
                    value={consultNote}
                    onChange={(event) => setConsultNote(event.target.value)}
                  />
                </label>

                <div className="rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">
                  Report payload to doctor: child name, latest score, risk level, AI explanation, and your note.
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleConsultSubmit} disabled={submitting}>
                    <Send className="h-4 w-4" />
                    Consult a Specialist
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/doctors">Open Doctor Directory</Link>
                  </Button>
                </div>

                {consultStatus ? <p className="text-sm text-primary">{consultStatus}</p> : null}
              </div>

              <Card className="border border-border bg-muted/30 shadow-none">
                <CardHeader>
                  <CardTitle className="text-base">Selected Doctor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {selectedDoctor ? (
                    <>
                      <div>
                        <p className="font-semibold text-foreground">{selectedDoctor.name}</p>
                        <p className="text-muted-foreground">{selectedDoctor.specialization}</p>
                      </div>
                      <p className="text-muted-foreground">{selectedDoctor.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-background px-2 py-1">Rating {selectedDoctor.rating}</span>
                        <span className="rounded-full bg-background px-2 py-1">{selectedDoctor.experienceYears} yrs exp</span>
                        <span className="rounded-full bg-background px-2 py-1">Next {formatDate(selectedDoctor.nextAvailable)}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">Choose a doctor to preview their details.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {consultations.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Recent consultation requests</p>
                {consultations.slice(-3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
                    <span className="text-foreground">{item.mode}</span>
                    <span className="text-muted-foreground">{formatDate(item.createdAt)}</span>
                    <span className="rounded-full bg-muted px-2 py-1">{item.status}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {result.finalRiskLevel === "high" ? (
          <Card className="border-rose-200 bg-rose-50/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rose-700">
                <ShieldAlert className="h-5 w-5" />
                Emergency Help
              </CardTitle>
              <CardDescription>
                If you feel your child is unsafe or you need urgent mental health support, use immediate help resources.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-rose-800">
                Call or text 988 in the United States for urgent mental health support, or call local emergency services if there is immediate danger.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="destructive">
                  <a href="tel:988">
                    <PhoneCall className="h-4 w-4" />
                    Get Help Now
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="https://988lifeline.org/" target="_blank" rel="noreferrer">
                    Open 988 Lifeline
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    )
  }

  return (
    <div className="space-y-6 fade-in-up">
      <section className="rounded-[2rem] border border-border/60 bg-gradient-to-br from-slate-50 via-white to-sky-50 shadow-sm">
        <div className="grid gap-6 px-6 py-7 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Link href="/assessments">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <span className="inline-flex rounded-full border border-primary/15 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm">
                Autism Screening Workflow
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">M-CHAT screening</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Complete a structured autism screening with child profiles, observation prompts, follow-up clarification, report generation, and doctor consultation support.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <HeroStat label="Questions" value="20" />
            <HeroStat label="Age range" value="16-30 months" />
            <HeroStat label="Includes" value="AI + doctor triage" />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="border border-border/60 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Child Profile
            </CardTitle>
            <CardDescription>Create a profile or continue with an existing child to save screening history.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="block space-y-2 text-sm">
              <span className="font-medium text-foreground">Select child</span>
              <select
                className="border-input h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={selectedChildId}
                onChange={(event) => setSelectedChildId(event.target.value)}
              >
                <option value="">Choose a child profile</option>
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name} • {profile.age} years
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 md:grid-cols-2">
              <Input
                placeholder="Child name"
                value={newProfile.name}
                onChange={(event) => setNewProfile((prev) => ({ ...prev, name: event.target.value }))}
              />
              <Input
                placeholder="Age"
                type="number"
                value={newProfile.age}
                onChange={(event) => setNewProfile((prev) => ({ ...prev, age: event.target.value }))}
              />
              <Input
                type="date"
                value={newProfile.dateOfBirth}
                onChange={(event) => setNewProfile((prev) => ({ ...prev, dateOfBirth: event.target.value }))}
              />
              <Input
                type="email"
                placeholder="Parent email (optional)"
                value={newProfile.parentEmail}
                onChange={(event) => setNewProfile((prev) => ({ ...prev, parentEmail: event.target.value }))}
              />
            </div>

            <Button variant="outline" onClick={handleCreateProfile} disabled={submitting}>
              Create Child Profile
            </Button>
            <p className="text-xs text-muted-foreground">Basic use is available without login. Local data is stored in the app backend.</p>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>Screening Checklist</CardTitle>
            <CardDescription>Answer yes or no based on your child's typical behavior, not their best day.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Question {questionIndex + 1} of {mchatQuestions.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="rounded-2xl border border-border p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-foreground">{currentQuestion.question}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{currentQuestion.description}</p>
                </div>
                {currentQuestion.criticalItem ? (
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                    Critical item
                  </span>
                ) : null}
              </div>

              <div className="mt-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Observation Prompt</p>
                <p className="mt-2 text-sm text-muted-foreground">{currentQuestion.observationPrompt}</p>
              </div>

              {currentQuestion.visualTest ? (
                <div className="mt-4">
                  <Button variant="outline" onClick={() => setShowVisualPrompt((prev) => !prev)}>
                    <Eye className="h-4 w-4" />
                    {showVisualPrompt ? "Hide observation prompt" : "Show observation prompt"}
                  </Button>
                </div>
              ) : null}

              {showVisualPrompt && currentQuestion.testType && visualTests[currentQuestion.testType] ? (
                <VisualPromptCard {...visualTests[currentQuestion.testType]} />
              ) : null}

              <div className="mt-6 flex gap-3">
                <Button
                  variant={answers[questionIndex] === "yes" ? "default" : "outline"}
                  className="h-14 flex-1"
                  onClick={() => handleAnswer("yes")}
                >
                  Yes
                </Button>
                <Button
                  variant={answers[questionIndex] === "no" ? "default" : "outline"}
                  className={cn("h-14 flex-1", answers[questionIndex] === "no" && "bg-destructive text-white hover:bg-destructive/90")}
                  onClick={() => handleAnswer("no")}
                >
                  No
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setQuestionIndex((prev) => Math.max(prev - 1, 0))} disabled={questionIndex === 0}>
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button onClick={handleNextQuestion} disabled={answers[questionIndex] === null || !selectedChildId || submitting}>
                {questionIndex === mchatQuestions.length - 1 ? "Review Result" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border/60 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle>Privacy & Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 text-primary" />
            This screen supports early concern detection and is not a diagnosis.
          </div>
          <div className="flex gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 text-primary" />
            Results should be reviewed with a pediatrician or specialist, especially if medium or high risk is shown.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-3 text-lg font-semibold text-foreground">{value}</p>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/70 bg-white/80 p-4 text-center">
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  )
}

function FlowCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof MessageCircle
  title: string
  text: string
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

function VisualPromptCard({
  title,
  instructions,
  image,
  interaction,
}: {
  title: string
  instructions: string
  image: string
  interaction: string
}) {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-muted/30">
      <img src={image} alt={title} className="h-40 w-full object-cover" />
      <div className="space-y-2 p-4">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{instructions}</p>
        <p className="text-xs text-muted-foreground">{interaction}</p>
      </div>
    </div>
  )
}
