"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Eye, CheckCircle, AlertTriangle, Info } from "lucide-react"
import Link from "next/link"
import { useApp } from "@/components/providers/app-provider"
import { cn } from "@/lib/utils"

// M-CHAT-R/F Questions (Modified for parent-friendly language)
const mchatQuestions = [
  {
    id: 1,
    question: "If you point at something across the room, does your child look at it?",
    description: "For example, if you point at a toy or an animal, does your child look at the toy or animal?",
    criticalItem: true,
    visualTest: true,
    testType: "joint-attention",
  },
  {
    id: 2,
    question: "Have you ever wondered if your child might be deaf?",
    description: "Does your child respond when you call their name?",
    criticalItem: true,
    reverseScored: true,
    visualTest: false,
  },
  {
    id: 3,
    question: "Does your child play pretend or make-believe?",
    description:
      "For example, pretend to drink from an empty cup, pretend to talk on a phone, or pretend to feed a doll or stuffed animal?",
    criticalItem: false,
    visualTest: true,
    testType: "pretend-play",
  },
  {
    id: 4,
    question: "Does your child like climbing on things?",
    description: "For example, furniture, playground equipment, or stairs.",
    criticalItem: false,
    visualTest: false,
  },
  {
    id: 5,
    question: "Does your child make unusual finger movements near their eyes?",
    description: "For example, does your child wiggle their fingers close to their eyes?",
    criticalItem: false,
    reverseScored: true,
    visualTest: true,
    testType: "finger-movement",
  },
  {
    id: 6,
    question: "Does your child point with one finger to ask for something or to get help?",
    description: "For example, pointing to a snack or toy that is out of reach.",
    criticalItem: true,
    visualTest: true,
    testType: "pointing",
  },
  {
    id: 7,
    question: "Does your child point with one finger to show you something interesting?",
    description: "For example, pointing to an airplane in the sky or a big truck in the road.",
    criticalItem: true,
    visualTest: true,
    testType: "pointing-interest",
  },
  {
    id: 8,
    question: "Is your child interested in other children?",
    description: "For example, does your child watch other children, smile at them, or go to them?",
    criticalItem: false,
    visualTest: false,
  },
  {
    id: 9,
    question: "Does your child show you things by bringing them to you or holding them up for you to see?",
    description: "Not to get help, but just to share.",
    criticalItem: true,
    visualTest: true,
    testType: "showing",
  },
  {
    id: 10,
    question: "Does your child respond when you call their name?",
    description:
      "For example, does they look up, talk or babble, or stop what they are doing when you call their name?",
    criticalItem: true,
    visualTest: false,
  },
  {
    id: 11,
    question: "When you smile at your child, do they smile back at you?",
    description: "Does your child return your smile?",
    criticalItem: false,
    visualTest: true,
    testType: "social-smile",
  },
  {
    id: 12,
    question: "Does your child get upset by everyday sounds?",
    description: "For example, does your child scream or cry to noise such as a vacuum cleaner or loud music?",
    criticalItem: false,
    reverseScored: true,
    visualTest: false,
  },
  {
    id: 13,
    question: "Does your child walk?",
    description: "Can your child walk independently?",
    criticalItem: false,
    visualTest: false,
  },
  {
    id: 14,
    question: "Does your child look you in the eye when you are talking to them, playing with them, or dressing them?",
    description: "Does your child make eye contact during interactions?",
    criticalItem: true,
    visualTest: true,
    testType: "eye-contact",
  },
  {
    id: 15,
    question: "Does your child try to copy what you do?",
    description: "For example, wave bye-bye, clap, or make a funny noise when you do.",
    criticalItem: false,
    visualTest: true,
    testType: "imitation",
  },
  {
    id: 16,
    question: "If you turn your head to look at something, does your child look around to see what you are looking at?",
    description: "Does your child follow your gaze?",
    criticalItem: true,
    visualTest: true,
    testType: "gaze-following",
  },
  {
    id: 17,
    question: "Does your child try to get you to watch them?",
    description: 'For example, does your child look at you for praise, or say "look" or "watch me"?',
    criticalItem: false,
    visualTest: false,
  },
  {
    id: 18,
    question: "Does your child understand when you tell them to do something?",
    description:
      'For example, if you don\'t point, can your child understand "put the book on the chair" or "bring me the blanket"?',
    criticalItem: false,
    visualTest: false,
  },
  {
    id: 19,
    question: "If something new happens, does your child look at your face to see how you feel about it?",
    description: "For example, if they hear a strange or funny noise, or see a new toy, will they look at your face?",
    criticalItem: true,
    visualTest: true,
    testType: "social-referencing",
  },
  {
    id: 20,
    question: "Does your child like movement activities?",
    description: "For example, being swung or bounced on your knee.",
    criticalItem: false,
    visualTest: false,
  },
]

type AnswerType = "yes" | "no" | null

export default function MChatPage() {
  const { addAssessmentResult } = useApp()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<AnswerType[]>(new Array(mchatQuestions.length).fill(null))
  const [showVisualTest, setShowVisualTest] = useState(false)
  const [visualTestResults, setVisualTestResults] = useState<Record<string, any>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [result, setResult] = useState<{
    score: number
    riskLevel: "low" | "medium" | "high"
    criticalFailed: number
  } | null>(null)

  const question = mchatQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / mchatQuestions.length) * 100

  const handleAnswer = (answer: AnswerType) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < mchatQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowVisualTest(false)
    } else {
      calculateResults()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowVisualTest(false)
    }
  }

  const calculateResults = () => {
    let failedItems = 0
    let criticalFailed = 0

    mchatQuestions.forEach((q, idx) => {
      const answer = answers[idx]
      const failed = q.reverseScored ? answer === "yes" : answer === "no"

      if (failed) {
        failedItems++
        if (q.criticalItem) {
          criticalFailed++
        }
      }
    })

    let riskLevel: "low" | "medium" | "high"
    if (failedItems <= 2 && criticalFailed === 0) {
      riskLevel = "low"
    } else if (failedItems >= 3 && failedItems <= 7) {
      riskLevel = "medium"
    } else {
      riskLevel = "high"
    }

    const resultData = {
      score: failedItems,
      riskLevel,
      criticalFailed,
    }

    setResult(resultData)
    setIsComplete(true)

    addAssessmentResult({
      id: Date.now().toString(),
      type: "M-CHAT",
      score: failedItems,
      maxScore: 20,
      riskLevel,
      completedAt: new Date().toISOString(),
      details: {
        answers,
        criticalFailed,
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
          <h1 className="text-2xl font-bold text-foreground">M-CHAT Results</h1>
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
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-3xl font-bold text-foreground">{result.score}</p>
                <p className="text-sm text-muted-foreground">Total Items Failed</p>
              </div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-3xl font-bold text-foreground">{result.criticalFailed}</p>
                <p className="text-sm text-muted-foreground">Critical Items Failed</p>
              </div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-3xl font-bold text-foreground">20</p>
                <p className="text-sm text-muted-foreground">Total Questions</p>
              </div>
            </div>

            <div className="rounded-lg bg-secondary/30 p-4">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-foreground">What This Means</p>
                  {result.riskLevel === "low" && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Your child&apos;s responses indicate a low risk for Autism Spectrum Disorder. Continue to monitor
                      their development and discuss any concerns with your pediatrician.
                    </p>
                  )}
                  {result.riskLevel === "medium" && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Your child&apos;s responses indicate a medium risk. We recommend scheduling a follow-up interview
                      (M-CHAT-R/F) with a healthcare professional to gather more information.
                    </p>
                  )}
                  {result.riskLevel === "high" && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Your child&apos;s responses indicate a higher risk for Autism Spectrum Disorder. We strongly
                      recommend seeking a comprehensive diagnostic evaluation from a specialist as soon as possible.
                      Early intervention can make a significant difference.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Important:</strong> The M-CHAT is a screening tool, not a diagnostic instrument. A positive
                screen does not mean your child has autism, but it does suggest further evaluation is warranted. Please
                consult with your child&apos;s healthcare provider to discuss the results and next steps.
              </p>
            </div>

            <div className="flex gap-4">
              <Button asChild className="flex-1">
                <Link href="/assessments">Back to Assessments</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/assessments/mchat/visual-games">Try Visual Games</Link>
              </Button>
            </div>
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
          <h1 className="text-2xl font-bold text-foreground">M-CHAT Screening</h1>
          <p className="text-sm text-muted-foreground">Modified Checklist for Autism in Toddlers</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentQuestion + 1} of {mchatQuestions.length}
          </span>
          <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{question.question}</CardTitle>
              <CardDescription className="mt-2">{question.description}</CardDescription>
            </div>
            {question.criticalItem && (
              <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
                Critical Item
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {question.visualTest && !showVisualTest && (
            <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={() => setShowVisualTest(true)}>
              <Eye className="h-4 w-4" />
              Show Visual Test for This Question
            </Button>
          )}

          {showVisualTest && question.visualTest && (
            <VisualTestComponent testType={question.testType || ""} questionId={question.id} />
          )}

          <div className="flex gap-4">
            <Button
              variant={answers[currentQuestion] === "yes" ? "default" : "outline"}
              className={cn(
                "flex-1 h-16 text-lg",
                answers[currentQuestion] === "yes" && "bg-accent text-accent-foreground hover:bg-accent/90",
              )}
              onClick={() => handleAnswer("yes")}
            >
              Yes
            </Button>
            <Button
              variant={answers[currentQuestion] === "no" ? "default" : "outline"}
              className={cn(
                "flex-1 h-16 text-lg",
                answers[currentQuestion] === "no" &&
                  "bg-destructive/80 text-destructive-foreground hover:bg-destructive/70",
              )}
              onClick={() => handleAnswer("no")}
            >
              No
            </Button>
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" onClick={handlePrevious} disabled={currentQuestion === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button onClick={handleNext} disabled={answers[currentQuestion] === null}>
              {currentQuestion === mchatQuestions.length - 1 ? "Complete" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function VisualTestComponent({ testType, questionId }: { testType: string; questionId: number }) {
  const [testStarted, setTestStarted] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  const tests: Record<
    string,
    {
      title: string
      instructions: string
      image: string
      interaction: string
    }
  > = {
    "joint-attention": {
      title: "Joint Attention Test",
      instructions: "Point at the butterfly on the screen. Does your child follow your finger to look at it?",
      image: "/colorful-butterfly-in-garden.jpg",
      interaction: "Watch where your child looks when you point to the butterfly.",
    },
    "pretend-play": {
      title: "Pretend Play Observation",
      instructions: "Give your child a toy cup. Do they pretend to drink from it?",
      image: "/child-toy-tea-cup-colorful.jpg",
      interaction: "Observe if your child engages in pretend drinking or feeding.",
    },
    "finger-movement": {
      title: "Visual Tracking",
      instructions: "Watch if your child makes unusual finger movements near their eyes.",
      image: "/child-hands-colorful-illustration.jpg",
      interaction: "Observe finger movements during normal play.",
    },
    pointing: {
      title: "Pointing Test",
      instructions: "Place a favorite toy out of reach. Does your child point to ask for it?",
      image: "/colorful-toys-on-shelf-child-reaching.jpg",
      interaction: "Observe how your child communicates their wants.",
    },
    "pointing-interest": {
      title: "Sharing Interest Test",
      instructions: "Show your child something interesting. Do they point to share it with you?",
      image: "/airplane-in-blue-sky-child-pointing.jpg",
      interaction: "Watch if your child points just to share, not to request.",
    },
    showing: {
      title: "Showing Objects Test",
      instructions: "Does your child bring things to show you, just to share (not for help)?",
      image: "/child-showing-drawing-to-parent.jpg",
      interaction: "Observe if your child shares discoveries with you.",
    },
    "social-smile": {
      title: "Social Smile Test",
      instructions: "Smile at your child. Do they smile back at you?",
      image: "/happy-parent-and-child-smiling-faces.jpg",
      interaction: "Make eye contact and smile warmly.",
    },
    "eye-contact": {
      title: "Eye Contact Observation",
      instructions: "During play or conversation, observe eye contact.",
      image: "/parent-child-eye-contact-interaction.jpg",
      interaction: "Note how often your child makes eye contact.",
    },
    imitation: {
      title: "Imitation Game",
      instructions: "Wave bye-bye or clap. Does your child try to copy you?",
      image: "/parent-child-waving-clapping-game.jpg",
      interaction: "Demonstrate simple actions and watch for imitation.",
    },
    "gaze-following": {
      title: "Gaze Following Test",
      instructions: "Look at something interesting. Does your child follow your gaze?",
      image: "/parent-looking-at-colorful-bird-child-following-ga.jpg",
      interaction: "Turn your head to look at something and observe.",
    },
    "social-referencing": {
      title: "Social Referencing Test",
      instructions: "When something unexpected happens, does your child look at your face?",
      image: "/surprised-parent-face-child-looking.jpg",
      interaction: "Make a surprised expression at an unusual sound.",
    },
    "attention-span": {
      title: "Attention Span Test",
      instructions: "Show colorful toys and observe how long your child stays focused.",
      image: "/colorful-toys-on-shelf-child-reaching.jpg",
      interaction: "Present toys one by one and time attention duration.",
    },
    "memory-game": {
      title: "Simple Memory Game",
      instructions: "Hide a toy under a cup and see if your child finds it.",
      image: "/placeholder.svg?height=120&width=120",
      interaction: "Use peek-a-boo with increasing delays.",
    },
    "cause-effect": {
      title: "Cause and Effect Understanding",
      instructions: "Press a button to make a sound. Does your child understand the connection?",
      image: "/placeholder.svg?height=120&width=120",
      interaction: "Demonstrate button press causing sound, then let child try.",
    },
  }

  const test = tests[testType]

  if (!test) {
    return (
      <div className="rounded-lg bg-muted p-4 text-center">
        <p className="text-muted-foreground">No visual test available for this question.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-primary">
        <Eye className="h-5 w-5" />
        <h3 className="font-semibold">{test.title}</h3>
      </div>

      <div className="overflow-hidden rounded-lg">
        <img src={test.image || "/placeholder.svg"} alt={test.title} className="h-48 w-full object-cover" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">{test.instructions}</p>
        <p className="text-xs text-muted-foreground">{test.interaction}</p>
      </div>

      {!testStarted ? (
        <Button onClick={() => setTestStarted(true)} className="w-full">
          Start Visual Test
        </Button>
      ) : (
        <div className="space-y-3">
          <p className="text-center text-sm font-medium text-foreground">Did your child respond as expected?</p>
          <div className="flex gap-2">
            <Button
              variant={testResult === "yes" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setTestResult("yes")}
            >
              Yes, they did
            </Button>
            <Button
              variant={testResult === "no" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setTestResult("no")}
            >
              No, they didn&apos;t
            </Button>
          </div>
          {testResult && (
            <p className="text-center text-xs text-muted-foreground">
              Use this observation to help answer the question above.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
