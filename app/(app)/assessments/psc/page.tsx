"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
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

  const handleAnswer = (answer: Answer) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < pscQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateResults = () => {
    const totalScore = answers.reduce((sum, a) => sum + (a || 0), 0)

    // Attention subscale (items 4, 7, 8, 9, 14)
    const attentionItems = [3, 6, 7, 8, 13]
    const attentionScore = attentionItems.reduce((sum, idx) => sum + (answers[idx] || 0), 0)

    // Internalizing subscale (items 11, 13, 19, 22, 27)
    const internalizingItems = [10, 12, 18, 21, 26]
    const internalizingScore = internalizingItems.reduce((sum, idx) => sum + (answers[idx] || 0), 0)

    // Externalizing subscale (items 16, 29, 31, 32, 33, 34, 35)
    const externalizingItems = [15, 28, 30, 31, 32, 33, 34]
    const externalizingScore = externalizingItems.reduce((sum, idx) => sum + (answers[idx] || 0), 0)

    let riskLevel: "low" | "medium" | "high"
    if (totalScore >= 28) {
      riskLevel = "high"
    } else if (totalScore >= 20) {
      riskLevel = "medium"
    } else {
      riskLevel = "low"
    }

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
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/assessments">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">PSC Results</h1>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.riskLevel === "low" && (
                <>
                  <CheckCircle className="h-6 w-6 text-accent" />
                  <span className="text-accent">Low Risk</span>
                </>
              )}
              {result.riskLevel === "medium" && (
                <>
                  <AlertTriangle className="h-6 w-6 text-warning" />
                  <span className="text-warning-foreground">Medium Risk</span>
                </>
              )}
              {result.riskLevel === "high" && (
                <>
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                  <span className="text-destructive">High Risk</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-3xl font-bold text-foreground">{result.totalScore}</p>
                <p className="text-sm text-muted-foreground">Total Score</p>
                <p className="text-xs text-muted-foreground">(Cutoff: 28)</p>
              </div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-3xl font-bold text-foreground">{result.attentionScore}</p>
                <p className="text-sm text-muted-foreground">Attention</p>
                <p className="text-xs text-muted-foreground">(Cutoff: 7)</p>
              </div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-3xl font-bold text-foreground">{result.internalizingScore}</p>
                <p className="text-sm text-muted-foreground">Internalizing</p>
                <p className="text-xs text-muted-foreground">(Cutoff: 5)</p>
              </div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-3xl font-bold text-foreground">{result.externalizingScore}</p>
                <p className="text-sm text-muted-foreground">Externalizing</p>
                <p className="text-xs text-muted-foreground">(Cutoff: 7)</p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">
                <strong>About the PSC:</strong> The Pediatric Symptom Checklist is a screening tool designed to identify
                children with possible psychosocial problems. Scores at or above the cutoff indicate a need for further
                evaluation by a qualified professional.
              </p>
            </div>

            <Button asChild className="w-full">
              <Link href="/assessments">Back to Assessments</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/assessments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Pediatric Symptom Checklist</h1>
          <p className="text-sm text-muted-foreground">PSC-35 Screening</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentQuestion + 1} of {pscQuestions.length}
          </span>
          <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">My child...</CardTitle>
          <CardDescription className="text-base font-medium text-foreground">
            {pscQuestions[currentQuestion]}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-3">
            {[
              { value: 0, label: "Never" },
              { value: 1, label: "Sometimes" },
              { value: 2, label: "Often" },
            ].map((option) => (
              <Button
                key={option.value}
                variant={answers[currentQuestion] === option.value ? "default" : "outline"}
                className={cn(
                  "h-14 justify-start text-left",
                  answers[currentQuestion] === option.value && "bg-primary text-primary-foreground",
                )}
                onClick={() => handleAnswer(option.value as Answer)}
              >
                <span className="text-lg">{option.label}</span>
              </Button>
            ))}
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" onClick={handlePrevious} disabled={currentQuestion === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button onClick={handleNext} disabled={answers[currentQuestion] === null}>
              {currentQuestion === pscQuestions.length - 1 ? "Complete" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
