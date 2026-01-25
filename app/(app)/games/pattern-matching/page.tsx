"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Star, Trophy, RefreshCw } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Pattern {
  grid: string[][]
  options: string[][][]
  correctIndex: number
  difficulty: "easy" | "medium" | "hard"
}

const shapes = ["●", "■", "▲", "★", "◆", "♥"]
const colors = ["text-red-500", "text-blue-500", "text-green-500", "text-yellow-500", "text-purple-500"]

function generatePattern(difficulty: "easy" | "medium" | "hard"): Pattern {
  const size = difficulty === "easy" ? 2 : difficulty === "medium" ? 3 : 3

  // Create main pattern
  const grid: string[][] = []
  for (let i = 0; i < size; i++) {
    const row: string[] = []
    for (let j = 0; j < size; j++) {
      row.push(shapes[Math.floor(Math.random() * shapes.length)])
    }
    grid.push(row)
  }

  // Create correct option (copy of grid)
  const correctOption = grid.map((row) => [...row])

  // Create wrong options
  const wrongOptions: string[][][] = []
  for (let i = 0; i < 3; i++) {
    const wrongOption = grid.map((row) => [...row])
    // Change 1-2 cells
    const changes = difficulty === "easy" ? 1 : 2
    for (let c = 0; c < changes; c++) {
      const ri = Math.floor(Math.random() * size)
      const ci = Math.floor(Math.random() * size)
      let newShape = shapes[Math.floor(Math.random() * shapes.length)]
      while (newShape === wrongOption[ri][ci]) {
        newShape = shapes[Math.floor(Math.random() * shapes.length)]
      }
      wrongOption[ri][ci] = newShape
    }
    wrongOptions.push(wrongOption)
  }

  // Shuffle options
  const options = [correctOption, ...wrongOptions]
  const correctIndex = 0

  // Fisher-Yates shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[options[i], options[j]] = [options[j], options[i]]
  }

  return {
    grid,
    options,
    correctIndex: options.findIndex((opt) => JSON.stringify(opt) === JSON.stringify(correctOption)),
    difficulty,
  }
}

export default function PatternMatchingPage() {
  const [level, setLevel] = useState(0)
  const [pattern, setPattern] = useState<Pattern | null>(null)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [gameComplete, setGameComplete] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const levels = 10
  const difficulties: ("easy" | "medium" | "hard")[] = [
    "easy",
    "easy",
    "easy",
    "medium",
    "medium",
    "medium",
    "medium",
    "hard",
    "hard",
    "hard",
  ]

  const startNewLevel = useCallback(() => {
    setPattern(generatePattern(difficulties[level]))
    setFeedback(null)
    setSelectedOption(null)
  }, [level])

  useEffect(() => {
    startNewLevel()
  }, [startNewLevel])

  const handleSelect = (index: number) => {
    if (feedback) return

    setSelectedOption(index)
    const isCorrect = index === pattern?.correctIndex
    setFeedback(isCorrect ? "correct" : "incorrect")

    if (isCorrect) {
      const points = pattern?.difficulty === "easy" ? 10 : pattern?.difficulty === "medium" ? 15 : 20
      setScore(score + points)
    }

    setTimeout(() => {
      if (level < levels - 1) {
        setLevel(level + 1)
      } else {
        setGameComplete(true)
      }
    }, 1500)
  }

  const resetGame = () => {
    setLevel(0)
    setScore(0)
    setGameComplete(false)
    setFeedback(null)
    setSelectedOption(null)
  }

  if (gameComplete) {
    const maxScore = 145
    const percentage = Math.round((score / maxScore) * 100)
    const stars = Math.ceil(percentage / 20)

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/games">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Well Done!</h1>
        </div>

        <Card className="border-none shadow-sm">
          <CardContent className="space-y-6 p-8 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-warning/20">
              <Trophy className="h-12 w-12 text-warning" />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-foreground">{score} Points</h2>
              <p className="text-muted-foreground">{percentage}% accuracy</p>
            </div>

            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn("h-8 w-8", star <= stars ? "fill-warning text-warning" : "text-muted")}
                />
              ))}
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

  if (!pattern) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/games">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Pattern Matching</h1>
          <p className="text-sm text-muted-foreground">
            Level {level + 1} of {levels}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-warning/20 px-4 py-2">
          <Star className="h-5 w-5 fill-warning text-warning" />
          <span className="font-bold text-foreground">{score}</span>
        </div>
      </div>

      <Progress value={((level + 1) / levels) * 100} className="h-2" />

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-center">Find the matching pattern</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="mx-auto w-fit rounded-xl bg-muted p-4">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${pattern.grid.length}, 1fr)` }}>
              {pattern.grid.flat().map((shape, idx) => (
                <div key={idx} className="flex h-12 w-12 items-center justify-center rounded bg-card text-2xl">
                  {shape}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {pattern.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={feedback !== null}
                className={cn(
                  "rounded-xl border-2 p-3 transition-all",
                  selectedOption === idx
                    ? feedback === "correct"
                      ? "border-accent bg-accent/20"
                      : "border-destructive bg-destructive/20"
                    : "border-border hover:border-primary",
                  feedback && idx === pattern.correctIndex && "border-accent bg-accent/20",
                )}
              >
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${option.length}, 1fr)` }}>
                  {option.flat().map((shape, sidx) => (
                    <div key={sidx} className="flex h-8 w-8 items-center justify-center rounded bg-muted text-lg">
                      {shape}
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {feedback && (
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
                {feedback === "correct" ? "Perfect! 🎉" : "Not quite! 🤔"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
