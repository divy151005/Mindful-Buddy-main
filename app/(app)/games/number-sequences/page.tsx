"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Star, Trophy, RefreshCw } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Sequence {
  numbers: number[]
  answer: number
  hint: string
  difficulty: "easy" | "medium" | "hard"
}

const sequences: Sequence[] = [
  { numbers: [2, 4, 6, 8], answer: 10, hint: "Add 2 each time", difficulty: "easy" },
  { numbers: [1, 2, 4, 8], answer: 16, hint: "Double each number", difficulty: "easy" },
  { numbers: [5, 10, 15, 20], answer: 25, hint: "Add 5 each time", difficulty: "easy" },
  { numbers: [1, 3, 5, 7], answer: 9, hint: "Add 2 each time (odd numbers)", difficulty: "easy" },
  { numbers: [3, 6, 9, 12], answer: 15, hint: "Add 3 each time", difficulty: "easy" },
  { numbers: [1, 4, 9, 16], answer: 25, hint: "Square numbers: 1², 2², 3², 4²...", difficulty: "medium" },
  { numbers: [2, 6, 12, 20], answer: 30, hint: "Add increasing even numbers", difficulty: "medium" },
  { numbers: [1, 1, 2, 3, 5], answer: 8, hint: "Fibonacci: add the previous two", difficulty: "medium" },
  { numbers: [100, 50, 25], answer: 12, hint: "Divide by 2 (round down)", difficulty: "medium" },
  { numbers: [2, 3, 5, 7, 11], answer: 13, hint: "Prime numbers", difficulty: "hard" },
  { numbers: [1, 8, 27, 64], answer: 125, hint: "Cube numbers: 1³, 2³, 3³...", difficulty: "hard" },
  { numbers: [2, 5, 10, 17], answer: 26, hint: "Add increasing odd numbers", difficulty: "hard" },
]

export default function NumberSequencesPage() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [gameComplete, setGameComplete] = useState(false)
  const [streak, setStreak] = useState(0)

  const currentSequence = sequences[currentLevel]
  const progress = ((currentLevel + 1) / sequences.length) * 100

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null)
        if (feedback === "correct" && currentLevel < sequences.length - 1) {
          setCurrentLevel(currentLevel + 1)
          setUserAnswer("")
          setShowHint(false)
          setAttempts(0)
        } else if (feedback === "correct" && currentLevel === sequences.length - 1) {
          setGameComplete(true)
        }
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [feedback, currentLevel])

  const checkAnswer = () => {
    const numAnswer = Number.parseInt(userAnswer, 10)
    if (numAnswer === currentSequence.answer) {
      setFeedback("correct")
      setScore(score + (showHint ? 5 : 10) + streak * 2)
      setStreak(streak + 1)
    } else {
      setFeedback("incorrect")
      setAttempts(attempts + 1)
      setStreak(0)
      if (attempts >= 1) {
        setShowHint(true)
      }
    }
  }

  const resetGame = () => {
    setCurrentLevel(0)
    setScore(0)
    setStreak(0)
    setUserAnswer("")
    setShowHint(false)
    setFeedback(null)
    setAttempts(0)
    setGameComplete(false)
  }

  if (gameComplete) {
    const maxScore = sequences.length * 10
    const percentage = Math.round((score / maxScore) * 100)

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/games">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Game Complete!</h1>
        </div>

        <Card className="border-none shadow-sm">
          <CardContent className="space-y-6 p-8 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-warning/20">
              <Trophy className="h-12 w-12 text-warning" />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-foreground">{score} Points</h2>
              <p className="text-muted-foreground">{percentage}% of maximum score</p>
            </div>

            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn("h-8 w-8", percentage >= star * 20 ? "fill-warning text-warning" : "text-muted")}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted p-4">
              <div>
                <p className="text-2xl font-bold text-foreground">{sequences.length}</p>
                <p className="text-xs text-muted-foreground">Levels Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{score}</p>
                <p className="text-xs text-muted-foreground">Total Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{streak}</p>
                <p className="text-xs text-muted-foreground">Best Streak</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={resetGame} variant="outline" className="flex-1 gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                Play Again
              </Button>
              <Button asChild className="flex-1">
                <Link href="/games">More Games</Link>
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
        <Link href="/games">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Number Sequences</h1>
          <p className="text-sm text-muted-foreground">
            Level {currentLevel + 1} of {sequences.length}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-warning/20 px-4 py-2">
          <Star className="h-5 w-5 fill-warning text-warning" />
          <span className="font-bold text-foreground">{score}</span>
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="flex items-center justify-between">
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            currentSequence.difficulty === "easy" && "bg-accent/20 text-accent-foreground",
            currentSequence.difficulty === "medium" && "bg-warning/20 text-warning-foreground",
            currentSequence.difficulty === "hard" && "bg-destructive/20 text-destructive",
          )}
        >
          {currentSequence.difficulty.charAt(0).toUpperCase() + currentSequence.difficulty.slice(1)}
        </span>
        {streak > 0 && (
          <span className="flex items-center gap-1 text-sm text-accent">
            <Zap className="h-4 w-4" />
            {streak} streak!
          </span>
        )}
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-center text-lg">What number comes next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center gap-3">
            {currentSequence.numbers.map((num, idx) => (
              <div
                key={idx}
                className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-xl font-bold text-secondary-foreground"
              >
                {num}
              </div>
            ))}
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-xl border-2 border-dashed text-xl font-bold transition-colors",
                feedback === "correct" && "border-accent bg-accent/20 text-accent-foreground",
                feedback === "incorrect" && "border-destructive bg-destructive/20 text-destructive",
              )}
            >
              {feedback === "correct" ? currentSequence.answer : "?"}
            </div>
          </div>

          {showHint && (
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Hint:</span> {currentSequence.hint}
              </p>
            </div>
          )}

          {feedback ? (
            <div
              className={cn(
                "rounded-lg p-4 text-center",
                feedback === "correct" ? "bg-accent/20" : "bg-destructive/20",
              )}
            >
              <p
                className={cn(
                  "text-lg font-medium",
                  feedback === "correct" ? "text-accent-foreground" : "text-destructive",
                )}
              >
                {feedback === "correct" ? "Great job! 🎉" : "Try again! 🤔"}
              </p>
            </div>
          ) : (
            <div className="flex gap-3">
              <Input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Your answer"
                className="flex-1 text-center text-xl"
                onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
              />
              <Button onClick={checkAnswer} disabled={!userAnswer} className="px-8">
                Check
              </Button>
            </div>
          )}

          {!showHint && attempts === 0 && !feedback && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHint(true)}
              className="w-full text-muted-foreground"
            >
              Need a hint?
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="border-none bg-muted/50 shadow-sm">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>About this game:</strong> Number sequence puzzles help develop pattern recognition and logical
            reasoning skills - key components of fluid intelligence.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function Zap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}
