"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Eye, Star, RefreshCw, Volume2 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type GameType = "tracking" | "pointing" | "face-recognition" | "object-permanence"

interface GameResult {
  game: string
  score: number
  maxScore: number
  observations: string[]
}

export default function MChatVisualGamesPage() {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null)
  const [results, setResults] = useState<GameResult[]>([])

  const games = [
    {
      id: "tracking" as GameType,
      title: "Follow the Ball",
      description: "Watch if your child follows the moving object with their eyes.",
      skill: "Visual tracking",
      icon: Eye,
    },
    {
      id: "pointing" as GameType,
      title: "Point & Find",
      description: "Test pointing and joint attention skills with interactive pictures.",
      skill: "Joint attention",
      icon: Star,
    },
    {
      id: "face-recognition" as GameType,
      title: "Find the Emotion",
      description: "Match emotions on faces to build social understanding.",
      skill: "Social cognition",
      icon: Volume2,
    },
    {
      id: "object-permanence" as GameType,
      title: "Peek-a-Boo Game",
      description: "Test object permanence understanding with hide and reveal.",
      skill: "Cognitive development",
      icon: RefreshCw,
    },
  ]

  const addResult = (result: GameResult) => {
    setResults((prev) => [...prev, result])
  }

  if (selectedGame === "tracking") {
    return <TrackingGame onBack={() => setSelectedGame(null)} onComplete={addResult} />
  }

  if (selectedGame === "pointing") {
    return <PointingGame onBack={() => setSelectedGame(null)} onComplete={addResult} />
  }

  if (selectedGame === "face-recognition") {
    return <FaceRecognitionGame onBack={() => setSelectedGame(null)} onComplete={addResult} />
  }

  if (selectedGame === "object-permanence") {
    return <ObjectPermanenceGame onBack={() => setSelectedGame(null)} onComplete={addResult} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/assessments/mchat">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">M-CHAT Visual Games</h1>
          <p className="text-sm text-muted-foreground">
            Interactive games to help observe your child&apos;s developmental skills
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {games.map((game) => {
          const Icon = game.icon
          const completed = results.some((r) => r.game === game.title)

          return (
            <Card
              key={game.id}
              className={cn(
                "cursor-pointer border-none shadow-sm transition-all hover:shadow-md",
                completed && "ring-2 ring-accent",
              )}
              onClick={() => setSelectedGame(game.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                    <Icon className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  {completed && (
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                      Completed
                    </span>
                  )}
                </div>
                <CardTitle className="mt-3">{game.title}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  <span className="font-medium text-foreground">Tests:</span>{" "}
                  <span className="text-muted-foreground">{game.skill}</span>
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {results.length > 0 && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Game Results Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, idx) => (
              <div key={idx} className="rounded-lg bg-muted p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">{result.game}</h4>
                  <span className="text-sm text-muted-foreground">
                    {result.score}/{result.maxScore}
                  </span>
                </div>
                <ul className="mt-2 space-y-1">
                  {result.observations.map((obs, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      • {obs}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function TrackingGame({
  onBack,
  onComplete,
}: {
  onBack: () => void
  onComplete: (result: GameResult) => void
}) {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [isMoving, setIsMoving] = useState(false)
  const [round, setRound] = useState(0)
  const [observations, setObservations] = useState<string[]>([])
  const maxRounds = 5

  const startMovement = useCallback(() => {
    setIsMoving(true)
    const directions = [
      { x: 20, y: 50 },
      { x: 80, y: 50 },
      { x: 50, y: 20 },
      { x: 50, y: 80 },
      { x: 50, y: 50 },
    ]
    setPosition(directions[round])
  }, [round])

  const recordObservation = (followed: boolean) => {
    const obs = followed
      ? `Round ${round + 1}: Child followed the ball`
      : `Round ${round + 1}: Child did not follow the ball`
    setObservations((prev) => [...prev, obs])
    setIsMoving(false)

    if (round < maxRounds - 1) {
      setRound(round + 1)
    } else {
      const followedCount = observations.filter((o) => o.includes("followed")).length + (followed ? 1 : 0)
      onComplete({
        game: "Follow the Ball",
        score: followedCount,
        maxScore: maxRounds,
        observations: [...observations, obs],
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Follow the Ball</h1>
          <p className="text-sm text-muted-foreground">
            Round {round + 1} of {maxRounds}
          </p>
        </div>
      </div>

      <Progress value={((round + 1) / maxRounds) * 100} className="h-2" />

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="relative mx-auto h-64 w-full max-w-lg overflow-hidden rounded-xl bg-gradient-to-br from-blue-100 to-blue-200">
            <div
              className="absolute h-12 w-12 rounded-full bg-red-500 shadow-lg transition-all duration-1000 ease-in-out"
              style={{
                left: `calc(${position.x}% - 24px)`,
                top: `calc(${position.y}% - 24px)`,
              }}
            />
          </div>

          <div className="mt-6 space-y-4">
            {!isMoving ? (
              <Button onClick={startMovement} className="w-full">
                Move the Ball
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-center font-medium text-foreground">
                  Did your child follow the ball with their eyes?
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => recordObservation(true)}>
                    Yes, they followed it
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => recordObservation(false)}>
                    No, they didn&apos;t
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none bg-muted/50 shadow-sm">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>What to look for:</strong> Observe if your child&apos;s eyes move to follow the ball as it moves
            across the screen. Note if they lose interest, get distracted, or consistently track it.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function PointingGame({
  onBack,
  onComplete,
}: {
  onBack: () => void
  onComplete: (result: GameResult) => void
}) {
  const [round, setRound] = useState(0)
  const [observations, setObservations] = useState<string[]>([])

  const items = [
    { name: "butterfly", image: "/colorful-butterfly-cartoon.png" },
    { name: "puppy", image: "/cute-puppy-cartoon.jpg" },
    { name: "balloon", image: "/red-balloon-cartoon.jpg" },
    { name: "star", image: "/yellow-star-cartoon.jpg" },
  ]

  const positions = [
    [0, 1, 2, 3],
    [3, 2, 1, 0],
    [1, 3, 0, 2],
    [2, 0, 3, 1],
  ]

  const currentTarget = items[round]
  const currentPositions = positions[round]

  const recordObservation = (looked: boolean, pointed: boolean) => {
    const obs = `${currentTarget.name}: ${looked ? "Looked" : "Did not look"}, ${pointed ? "Pointed" : "Did not point"}`
    const newObs = [...observations, obs]
    setObservations(newObs)

    if (round < items.length - 1) {
      setRound(round + 1)
    } else {
      const lookedCount = newObs.filter((o) => o.includes("Looked")).length
      const pointedCount = newObs.filter((o) => o.includes(", Pointed")).length
      onComplete({
        game: "Point & Find",
        score: lookedCount + pointedCount,
        maxScore: items.length * 2,
        observations: newObs,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Point & Find</h1>
          <p className="text-sm text-muted-foreground">
            Round {round + 1} of {items.length}
          </p>
        </div>
      </div>

      <Progress value={((round + 1) / items.length) * 100} className="h-2" />

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-center text-lg">
            Point to the <span className="text-primary">{currentTarget.name}</span> and say &quot;Look!&quot;
          </CardTitle>
          <CardDescription className="text-center">
            Watch if your child follows your point and looks at the {currentTarget.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {currentPositions.map((itemIdx, gridIdx) => (
              <div key={gridIdx} className="aspect-square overflow-hidden rounded-xl bg-muted p-4">
                <img
                  src={items[itemIdx].image || "/placeholder.svg"}
                  alt={items[itemIdx].name}
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-center font-medium text-foreground">After pointing, did your child:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-auto py-3 bg-transparent"
                onClick={() => recordObservation(true, true)}
              >
                <div className="text-center">
                  <p className="font-medium">Looked & Pointed</p>
                  <p className="text-xs text-muted-foreground">Best response</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-3 bg-transparent"
                onClick={() => recordObservation(true, false)}
              >
                <div className="text-center">
                  <p className="font-medium">Looked Only</p>
                  <p className="text-xs text-muted-foreground">Followed gaze</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-3 bg-transparent"
                onClick={() => recordObservation(false, true)}
              >
                <div className="text-center">
                  <p className="font-medium">Pointed Only</p>
                  <p className="text-xs text-muted-foreground">No eye contact</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-3 bg-transparent"
                onClick={() => recordObservation(false, false)}
              >
                <div className="text-center">
                  <p className="font-medium">Neither</p>
                  <p className="text-xs text-muted-foreground">No response</p>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FaceRecognitionGame({
  onBack,
  onComplete,
}: {
  onBack: () => void
  onComplete: (result: GameResult) => void
}) {
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [observations, setObservations] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [lastCorrect, setLastCorrect] = useState(false)

  const emotions = [
    { name: "happy", emoji: "😊", image: "/happy-child-face-cartoon.jpg" },
    { name: "sad", emoji: "😢", image: "/placeholder.svg?height=120&width=120" },
    { name: "surprised", emoji: "😲", image: "/placeholder.svg?height=120&width=120" },
    { name: "angry", emoji: "😠", image: "/placeholder.svg?height=120&width=120" },
  ]

  const rounds = [
    { target: "happy", options: ["happy", "sad", "angry"] },
    { target: "sad", options: ["happy", "sad", "surprised"] },
    { target: "surprised", options: ["sad", "surprised", "angry"] },
    { target: "happy", options: ["happy", "surprised", "angry"] },
  ]

  const currentRound = rounds[round]
  const targetEmotion = emotions.find((e) => e.name === currentRound.target)!

  const handleSelect = (selected: string) => {
    const correct = selected === currentRound.target
    setLastCorrect(correct)
    setShowResult(true)

    if (correct) setScore(score + 1)

    const obs = `${currentRound.target}: ${correct ? "Correct" : `Selected ${selected}`}`
    setObservations((prev) => [...prev, obs])
  }

  const handleNext = () => {
    setShowResult(false)
    if (round < rounds.length - 1) {
      setRound(round + 1)
    } else {
      onComplete({
        game: "Find the Emotion",
        score,
        maxScore: rounds.length,
        observations,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Find the Emotion</h1>
          <p className="text-sm text-muted-foreground">
            Round {round + 1} of {rounds.length}
          </p>
        </div>
      </div>

      <Progress value={((round + 1) / rounds.length) * 100} className="h-2" />

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-center">
            Find the <span className="text-primary">{targetEmotion.name}</span> face {targetEmotion.emoji}
          </CardTitle>
          <CardDescription className="text-center">
            Help your child point to or tap the matching emotion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showResult ? (
            <div className="grid grid-cols-3 gap-4">
              {currentRound.options.map((emotionName) => {
                const emotion = emotions.find((e) => e.name === emotionName)!
                return (
                  <button
                    key={emotionName}
                    onClick={() => handleSelect(emotionName)}
                    className="aspect-square overflow-hidden rounded-xl bg-muted p-2 transition-transform hover:scale-105"
                  >
                    <img
                      src={emotion.image || "/placeholder.svg"}
                      alt={emotion.name}
                      className="h-full w-full object-contain"
                    />
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div
                className={cn(
                  "mx-auto flex h-24 w-24 items-center justify-center rounded-full",
                  lastCorrect ? "bg-accent/20" : "bg-destructive/20",
                )}
              >
                <span className="text-5xl">{lastCorrect ? "🎉" : "🤔"}</span>
              </div>
              <p className="text-xl font-medium text-foreground">{lastCorrect ? "Great job!" : "Keep trying!"}</p>
              <Button onClick={handleNext}>{round < rounds.length - 1 ? "Next Round" : "See Results"}</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-none bg-muted/50 shadow-sm">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>What to observe:</strong> Can your child match emotions? Do they show understanding of what
            different facial expressions mean? Do they look at the faces or avoid eye contact with the images?
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function ObjectPermanenceGame({
  onBack,
  onComplete,
}: {
  onBack: () => void
  onComplete: (result: GameResult) => void
}) {
  const [round, setRound] = useState(0)
  const [phase, setPhase] = useState<"show" | "hide" | "guess" | "reveal">("show")
  const [hiddenPosition, setHiddenPosition] = useState(0)
  const [observations, setObservations] = useState<string[]>([])
  const [score, setScore] = useState(0)

  const objects = [
    { name: "teddy bear", image: "/placeholder.svg?height=100&width=100" },
    { name: "ball", image: "/placeholder.svg?height=100&width=100" },
    { name: "car", image: "/placeholder.svg?height=100&width=100" },
  ]

  const currentObject = objects[round % objects.length]
  const cups = [0, 1, 2]

  useEffect(() => {
    if (phase === "show") {
      const timer = setTimeout(() => {
        setHiddenPosition(Math.floor(Math.random() * 3))
        setPhase("hide")
      }, 2000)
      return () => clearTimeout(timer)
    }
    if (phase === "hide") {
      const timer = setTimeout(() => {
        setPhase("guess")
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [phase])

  const handleGuess = (position: number) => {
    const correct = position === hiddenPosition
    if (correct) setScore(score + 1)

    const obs = `Round ${round + 1}: ${correct ? "Found" : "Did not find"} the ${currentObject.name}`
    setObservations((prev) => [...prev, obs])
    setPhase("reveal")
  }

  const handleNext = () => {
    if (round < 2) {
      setRound(round + 1)
      setPhase("show")
    } else {
      onComplete({
        game: "Peek-a-Boo Game",
        score,
        maxScore: 3,
        observations,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Peek-a-Boo Game</h1>
          <p className="text-sm text-muted-foreground">Round {round + 1} of 3</p>
        </div>
      </div>

      <Progress value={((round + 1) / 3) * 100} className="h-2" />

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-center">
            {phase === "show" && `Look! A ${currentObject.name}!`}
            {phase === "hide" && "Hiding..."}
            {phase === "guess" && `Where is the ${currentObject.name}?`}
            {phase === "reveal" && (hiddenPosition === -1 ? "Try again!" : "Found it!")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center gap-4">
            {cups.map((cupIdx) => (
              <div
                key={cupIdx}
                className={cn(
                  "relative h-32 w-24 cursor-pointer rounded-t-3xl bg-gradient-to-b from-orange-400 to-orange-600 transition-transform",
                  phase === "guess" && "hover:scale-105",
                )}
                onClick={() => phase === "guess" && handleGuess(cupIdx)}
              >
                {phase === "show" && cupIdx === 1 && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                    <img
                      src={currentObject.image || "/placeholder.svg"}
                      alt={currentObject.name}
                      className="h-16 w-16"
                    />
                  </div>
                )}
                {phase === "reveal" && cupIdx === hiddenPosition && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                    <img
                      src={currentObject.image || "/placeholder.svg"}
                      alt={currentObject.name}
                      className="h-16 w-16"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {phase === "guess" && (
            <p className="text-center text-sm text-muted-foreground">
              Let your child point to or tap where they think the {currentObject.name} is hiding
            </p>
          )}

          {phase === "reveal" && (
            <div className="text-center">
              <Button onClick={handleNext}>{round < 2 ? "Next Round" : "See Results"}</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-none bg-muted/50 shadow-sm">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>What to observe:</strong> Does your child understand that the object still exists even when hidden?
            Do they search for it or lose interest when it disappears?
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
