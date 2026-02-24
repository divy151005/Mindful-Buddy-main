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
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-600",
    difficultyColor: "bg-blue-100 text-blue-700",
  },
  {
    id: "pattern-matching",
    title: "Pattern Matching",
    description: "Find matching patterns and shapes to improve visual processing.",
    skill: "Visual Processing",
    difficulty: "Easy to Medium",
    icon: Grid3X3,
    href: "/games/pattern-matching",
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-600",
    difficultyColor: "bg-purple-100 text-purple-700",
  },
  {
    id: "memory-cards",
    title: "Memory Cards",
    description: "Match pairs of cards to strengthen working memory.",
    skill: "Working Memory",
    difficulty: "Easy to Hard",
    icon: Puzzle,
    href: "/games/memory-cards",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-600",
    difficultyColor: "bg-amber-100 text-amber-700",
  },
  {
    id: "shape-builder",
    title: "Shape Builder",
    description: "Arrange shapes to match target patterns for spatial reasoning.",
    skill: "Spatial Reasoning",
    difficulty: "Medium",
    icon: Shapes,
    href: "/games/shape-builder",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-600",
    difficultyColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "quick-math",
    title: "Quick Math",
    description: "Solve math problems quickly to boost processing speed.",
    skill: "Processing Speed",
    difficulty: "Adaptive",
    icon: Zap,
    href: "/games/quick-math",
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-600",
    difficultyColor: "bg-rose-100 text-rose-700",
  },
  {
    id: "story-sequence",
    title: "Story Sequence",
    description: "Arrange story cards in logical order to develop sequential thinking.",
    skill: "Sequential Processing",
    difficulty: "Easy",
    icon: Lightbulb,
    href: "/games/story-sequence",
    iconBg: "bg-cyan-500/15",
    iconColor: "text-cyan-600",
    difficultyColor: "bg-cyan-100 text-cyan-700",
  },
]

export default function GamesPage() {
  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          🧩 Brain Games
        </h1>
        <p className="mt-2 text-muted-foreground">Fun games designed to assess and improve cognitive abilities.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {games.map((game, idx) => {
          const Icon = game.icon
          return (
            <Card
              key={game.id}
              className="card-hover border-none shadow-sm overflow-hidden group"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <CardHeader>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${game.iconBg} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon className={`h-6 w-6 ${game.iconColor}`} />
                </div>
                <CardTitle className="mt-3">{game.title}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>
                    <span className="font-medium text-foreground">Skill:</span>{" "}
                    <span className="text-muted-foreground">{game.skill}</span>
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${game.difficultyColor}`}>
                    {game.difficulty}
                  </span>
                </div>
                <Button asChild className="w-full gap-2 bg-gradient-to-r from-primary to-primary/85 shadow-sm hover:shadow-md transition-all duration-200">
                  <Link href={game.href}>
                    Play Game
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
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
