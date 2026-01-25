"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Puzzle, Calculator, Grid3X3, Lightbulb, Zap, Shapes } from "lucide-react"

const games = [
  {
    id: "number-sequences",
    title: "Number Sequences",
    description: "Complete number patterns to test logical reasoning and pattern recognition.",
    skill: "Fluid Intelligence",
    difficulty: "Easy to Hard",
    icon: Calculator,
    href: "/games/number-sequences",
  },
  {
    id: "pattern-matching",
    title: "Pattern Matching",
    description: "Find matching patterns and shapes to improve visual processing.",
    skill: "Visual Processing",
    difficulty: "Easy to Medium",
    icon: Grid3X3,
    href: "/games/pattern-matching",
  },
  {
    id: "memory-cards",
    title: "Memory Cards",
    description: "Match pairs of cards to strengthen working memory.",
    skill: "Working Memory",
    difficulty: "Easy to Hard",
    icon: Puzzle,
    href: "/games/memory-cards",
  },
  {
    id: "shape-builder",
    title: "Shape Builder",
    description: "Arrange shapes to match target patterns for spatial reasoning.",
    skill: "Spatial Reasoning",
    difficulty: "Medium",
    icon: Shapes,
    href: "/games/shape-builder",
  },
  {
    id: "quick-math",
    title: "Quick Math",
    description: "Solve math problems quickly to boost processing speed.",
    skill: "Processing Speed",
    difficulty: "Adaptive",
    icon: Zap,
    href: "/games/quick-math",
  },
  {
    id: "story-sequence",
    title: "Story Sequence",
    description: "Arrange story cards in logical order to develop sequential thinking.",
    skill: "Sequential Processing",
    difficulty: "Easy",
    icon: Lightbulb,
    href: "/games/story-sequence",
  },
]

export default function GamesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Brain Games</h1>
        <p className="mt-2 text-muted-foreground">Fun games designed to assess and improve cognitive abilities.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => {
          const Icon = game.icon
          return (
            <Card key={game.id} className="border-none shadow-sm transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <Icon className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="mt-3">{game.title}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>
                    <span className="font-medium text-foreground">Skill:</span>{" "}
                    <span className="text-muted-foreground">{game.skill}</span>
                  </span>
                  <span className="text-muted-foreground">{game.difficulty}</span>
                </div>
                <Button asChild className="w-full gap-2">
                  <Link href={game.href}>
                    Play Game
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
