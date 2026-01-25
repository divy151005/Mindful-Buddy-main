"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star, Trophy, RefreshCw } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const cardImages = [
  { id: "sun", emoji: "☀️", name: "Sun" },
  { id: "moon", emoji: "🌙", name: "Moon" },
  { id: "star", emoji: "⭐", name: "Star" },
  { id: "rainbow", emoji: "🌈", name: "Rainbow" },
  { id: "flower", emoji: "🌸", name: "Flower" },
  { id: "tree", emoji: "🌳", name: "Tree" },
  { id: "butterfly", emoji: "🦋", name: "Butterfly" },
  { id: "fish", emoji: "🐠", name: "Fish" },
]

interface GameCard {
  id: number
  imageId: string
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

export default function MemoryCardsPage() {
  const [cards, setCards] = useState<GameCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    if (startTime && !gameComplete) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [startTime, gameComplete])

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true)
      const [first, second] = flippedCards

      if (cards[first].imageId === cards[second].imageId) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, idx) => (idx === first || idx === second ? { ...card, isMatched: true } : card)),
          )
          setMatches((m) => m + 1)
          setFlippedCards([])
          setIsChecking(false)
        }, 500)
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, idx) => (idx === first || idx === second ? { ...card, isFlipped: false } : card)),
          )
          setFlippedCards([])
          setIsChecking(false)
        }, 1000)
      }
    }
  }, [flippedCards, cards])

  useEffect(() => {
    if (matches === cardImages.length && matches > 0) {
      setGameComplete(true)
    }
  }, [matches])

  const initializeGame = () => {
    const duplicatedCards = [...cardImages, ...cardImages]
    const shuffled = duplicatedCards
      .sort(() => Math.random() - 0.5)
      .map((img, idx) => ({
        id: idx,
        imageId: img.id,
        emoji: img.emoji,
        isFlipped: false,
        isMatched: false,
      }))
    setCards(shuffled)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setGameComplete(false)
    setStartTime(null)
    setElapsedTime(0)
  }

  const handleCardClick = (index: number) => {
    if (isChecking || cards[index].isFlipped || cards[index].isMatched || flippedCards.length >= 2) {
      return
    }

    if (!startTime) {
      setStartTime(Date.now())
    }

    setCards((prev) => prev.map((card, idx) => (idx === index ? { ...card, isFlipped: true } : card)))
    setFlippedCards((prev) => [...prev, index])
    setMoves((m) => m + 1)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getStars = () => {
    const perfectMoves = cardImages.length * 2
    const ratio = perfectMoves / moves
    if (ratio >= 0.8) return 5
    if (ratio >= 0.6) return 4
    if (ratio >= 0.4) return 3
    if (ratio >= 0.2) return 2
    return 1
  }

  if (gameComplete) {
    const stars = getStars()

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/games">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Great Memory!</h1>
        </div>

        <Card className="border-none shadow-sm">
          <CardContent className="space-y-6 p-8 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-warning/20">
              <Trophy className="h-12 w-12 text-warning" />
            </div>

            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn("h-8 w-8", star <= stars ? "fill-warning text-warning" : "text-muted")}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted p-4">
              <div>
                <p className="text-2xl font-bold text-foreground">{moves}</p>
                <p className="text-xs text-muted-foreground">Total Moves</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{formatTime(elapsedTime)}</p>
                <p className="text-xs text-muted-foreground">Time</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={initializeGame} variant="outline" className="flex-1 gap-2 bg-transparent">
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
          <h1 className="text-2xl font-bold text-foreground">Memory Cards</h1>
          <p className="text-sm text-muted-foreground">Find all matching pairs!</p>
        </div>
      </div>

      <div className="flex justify-between rounded-lg bg-muted p-3 text-sm">
        <span>
          Moves: <strong>{moves}</strong>
        </span>
        <span>
          Matches:{" "}
          <strong>
            {matches}/{cardImages.length}
          </strong>
        </span>
        <span>
          Time: <strong>{formatTime(elapsedTime)}</strong>
        </span>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-3">
            {cards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={cn(
                  "aspect-square rounded-xl text-4xl transition-all duration-300",
                  card.isFlipped || card.isMatched ? "bg-secondary" : "bg-primary hover:bg-primary/90",
                  card.isMatched && "opacity-60",
                )}
                disabled={card.isMatched}
              >
                {card.isFlipped || card.isMatched ? card.emoji : "?"}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button variant="outline" onClick={initializeGame} className="gap-2 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          Restart Game
        </Button>
      </div>

      <Card className="border-none bg-muted/50 shadow-sm">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>About this game:</strong> Memory matching games strengthen working memory and concentration -
            essential cognitive skills for learning and daily life.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
