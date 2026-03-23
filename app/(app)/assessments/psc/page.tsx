"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle, ClipboardCheck, Sparkles } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useApp } from "@/components/providers/app-provider"
import { cn } from "@/lib/utils"

const pscQuestions = [
  "Complains of aches and pains",
  "Spends more time alone",
  "Tires easily, has little energy",
  "Fidgety, unable to sit still",
  "Has trouble with a teacher",
  "Less interested in school",
  "Acts as if driven by a motor",
  "Daydreams too much",
  "Distracted easily",
  "Is afraid of new situations",
  "Feels sad, unhappy",
  "Is irritable, angry",
  "Feels hopeless",
  "Has trouble concentrating",
  "Less interested in friends",
  "Fights with other children",
  "Absent from school",
  "School grades dropping",
  "Is down on self",
  "Visits the doctor with nothing wrong",
  "Has trouble sleeping",
  "Worries a lot",
  "Wants to be with you more than before",
  "Feels like they are bad",
  "Takes unnecessary risks",
  "Gets hurt frequently",
  "Seems to be having less fun",
  "Acts younger than children their age",
  "Does not listen to rules",
  "Does not show feelings",
  "Does not understand other people's feelings",
  "Teases others",
  "Blames others for their troubles",
  "Takes things that do not belong to them",
  "Refuses to share",
]

type Answer = 0 | 1 | 2 | null

const answerOptions = [
  { value: 0, label: "Never", helper: "Not seen or very rare" },
  { value: 1, label: "Sometimes", helper: "Shows up occasionally" },
  { value: 2, label: "Often", helper: "Shows up regularly" },
]

const resultStyles = {
  low: {
    icon: CheckCircle,
    title: "Low Concern",
    textColor: "text-emerald-700",
    card: "border-emerald-200 bg-emerald-50/80",
  },
  medium: {
    icon: AlertTriangle,
    title: "Medium Concern",
    textColor: "text-amber-700",
    card: "border-amber-200 bg-amber-50/80",
  },
  high: {
    icon: AlertTriangle,
    title: "High Concern",
    textColor: "text-rose-700",
    card: "border-rose-200 bg-rose-50/80",
  },
} as const

export default function PSCPage() {
  const { addAssessmentResult } = useApp()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>(new Array(pscQuestions.length).fill(null))
  const [isComplete, setIsComplete] = useState(false)
  const [result, setResult] = useState<{
    totalScore: number
    attentionScore: number
    internalizingScore: number
    externalizingScore: number
    riskLevel: "low" | "medium" | "high"
  } | null>(null)

  const progress = ((currentQuestion + 1) / pscQuestions.length) * 100

  function handleAnswer(answer: Answer) {
    const next = [...answers]
    next[currentQuestion] = answer
    setAnswers(next)
  }

  function handleNext() {
    if (currentQuestion < pscQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      calculateResults()
    }
  }

  function handlePrevious() {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  function calculateResults() {
    const totalScore = answers.reduce<number>((sum, answer) => sum + (answer ?? 0), 0)
    const attentionItems = [3, 6, 7, 8, 13]
    const internalizingItems = [10, 12, 18, 21, 26]
    const externalizingItems = [15, 28, 30, 31, 32, 33, 34]

    const attentionScore = attentionItems.reduce<number>((sum, index) => sum + (answers[index] ?? 0), 0)
    const internalizingScore = internalizingItems.reduce<number>((sum, index) => sum + (answers[index] ?? 0), 0)
    const externalizingScore = externalizingItems.reduce<number>((sum, index) => sum + (answers[index] ?? 0), 0)

    const riskLevel: "low" | "medium" | "high" = totalScore >= 28 ? "high" : totalScore >= 20 ? "medium" : "low"

    const resultData = {
      totalScore,
      attentionScore,
      internalizingScore,
      externalizingScore,
      riskLevel,
    }

    setResult(resultData)
    setIsComplete(true)

    addAssessmentResult({
      id: Date.now().toString(),
      type: "PSC",
      score: totalScore,
      maxScore: 70,
      riskLevel,
      completedAt: new Date().toISOString(),
      details: {
        answers,
        attentionScore,
        internalizingScore,
        externalizingScore,
      },
    })
  }

  if (isComplete && result) {
    const style = resultStyles[result.riskLevel]
    const Icon = style.icon

    return (
      <div className="space-y-6 fade-in-up">
        <section className={cn("rounded-[2rem] border shadow-sm", style.card)}>
          <div className="space-y-5 px-6 py-7 md:px-8">
            <div className="flex items-center gap-4">
              <Link href="/assessments">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">PSC Result</p>
                <h1 className="text-2xl font-bold text-foreground">Pediatric Symptom Checklist Summary</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Icon className={cn("h-6 w-6", style.textColor)} />
              <p className={cn("text-lg font-semibold", style.textColor)}>{style.title}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <ResultMetric label="Total Score" value={String(result.totalScore)} helper="Cutoff: 28" />
              <ResultMetric label="Attention" value={String(result.attentionScore)} helper="Cutoff: 7" />
              <ResultMetric label="Internalizing" value={String(result.internalizingScore)} helper="Cutoff: 5" />
              <ResultMetric label="Externalizing" value={String(result.externalizingScore)} helper="Cutoff: 7" />
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border border-border/60 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Clinical Interpretation</CardTitle>
              <CardDescription>How to think about the screening outcome in practical terms.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                The Pediatric Symptom Checklist is a screening tool used to identify children who may benefit from deeper emotional or behavioral evaluation.
              </p>
              <p>
                A higher score does not confirm a diagnosis. It signals that conversation with a pediatrician, counselor, or psychologist may be helpful.
              </p>
              <p>
                For the best picture, combine this result with observations from home, school, and recent behavior changes.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-slate-50/80 shadow-sm">
            <CardHeader>
              <CardTitle>Recommended Next Step</CardTitle>
              <CardDescription>Suggested action based on the total PSC score.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {result.riskLevel === "low" ? (
                <>
                  <p>Continue general monitoring and repeat the screen if new concerns appear.</p>
                  <p>Use daily check-ins with school and caregivers to notice any changes over time.</p>
                </>
              ) : null}
              {result.riskLevel === "medium" ? (
                <>
                  <p>Discuss the result with your child's pediatrician and share examples of behaviors that stood out.</p>
                  <p>Consider more targeted follow-up in the areas of attention, mood, or behavior depending on daily impact.</p>
                </>
              ) : null}
              {result.riskLevel === "high" ? (
                <>
                  <p>Arrange a professional mental health or developmental evaluation soon to understand the concerns more clearly.</p>
                  <p>Bring notes from home and school to help the clinician connect the screening with real-world patterns.</p>
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <Button asChild className="rounded-full px-5 shadow-sm">
          <Link href="/assessments">Back to Assessments</Link>
        </Button>
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
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                PSC-35 Screening
              </span>
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Pediatric Symptom Checklist</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Rate how often each concern applies to your child. This screening helps identify emotional and behavioral patterns that may need closer attention.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <QuickInfo label="Questions" value="35" />
            <QuickInfo label="Time" value="5-7 min" />
            <QuickInfo label="Use" value="Behavioral overview" />
          </div>
        </div>
      </section>

      <Card className="border border-border/60 bg-white/90 shadow-sm">
        <CardHeader className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Question {currentQuestion + 1} of {pscQuestions.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="rounded-2xl border border-border/70 bg-slate-50/80 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">
                <ClipboardCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Current Prompt</p>
                <CardTitle className="text-xl leading-tight text-foreground">My child...</CardTitle>
                <CardDescription className="text-base font-medium text-foreground">{pscQuestions[currentQuestion]}</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-3">
            {answerOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "flex items-center justify-between rounded-2xl border px-4 py-4 text-left transition-all",
                  answers[currentQuestion] === option.value
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background hover:border-primary/30 hover:bg-slate-50",
                )}
                onClick={() => handleAnswer(option.value as Answer)}
              >
                <div>
                  <p className="font-semibold">{option.label}</p>
                  <p className={cn("text-sm", answers[currentQuestion] === option.value ? "text-primary-foreground/85" : "text-muted-foreground")}>
                    {option.helper}
                  </p>
                </div>
                <div
                  className={cn(
                    "h-5 w-5 rounded-full border-2",
                    answers[currentQuestion] === option.value
                      ? "border-primary-foreground bg-primary-foreground"
                      : "border-border",
                  )}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handlePrevious} disabled={currentQuestion === 0}>
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button onClick={handleNext} disabled={answers[currentQuestion] === null}>
              {currentQuestion === pscQuestions.length - 1 ? "See Result" : "Next Question"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function QuickInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-3 text-lg font-semibold text-foreground">{value}</p>
    </div>
  )
}

function ResultMetric({
  label,
  value,
  helper,
}: {
  label: string
  value: string
  helper: string
}) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-4 text-center shadow-sm">
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{helper}</p>
    </div>
  )
}
