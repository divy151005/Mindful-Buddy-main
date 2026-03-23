"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/components/providers/app-provider"
import {
  CheckCircle,
  Gamepad,
  Heart,
  Lightbulb,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Video,
} from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, CartesianGrid } from "recharts"

const moodColors: Record<string, string> = {
  excited: "#10b981",
  happy: "#34d399",
  calm: "#8b5cf6",
  okay: "#f59e0b",
  sad: "#60a5fa",
  anxious: "#f87171",
}

const moodLevels = ["anxious", "sad", "okay", "calm", "happy", "excited"]
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function DashboardPage() {
  const { childProfile, moodEntries, sessionsCompleted, copingSkillsUsed } = useApp()

  const chartData = moodEntries.slice(-7).map((entry) => {
    const date = new Date(entry.date)
    return {
      day: dayNames[date.getDay()],
      mood: moodLevels.indexOf(entry.mood) + 1,
      color: moodColors[entry.mood],
      label: entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1),
      date: entry.date,
    }
  })

  const latestMood = moodEntries[moodEntries.length - 1]?.mood || "okay"
  const moodTrend = moodLevels.indexOf(latestMood) >= 3 ? "Positive direction" : "Needs support"

  const recommendations = [
    {
      icon: Video,
      title: '"Mindful Monster Breathing Game for Kids" on YouTube',
      description: "A playful breathing exercise video that can help make calming routines easier to repeat.",
    },
    {
      icon: Gamepad,
      title: '"Worry Warriors Adventure"',
      description: "A guided game concept for noticing school worries and building confidence through small wins.",
    },
    {
      icon: Video,
      title: '"A Kid\'s Guide: Dealing with School Worries"',
      description: "A short animated explainer you can use to open gentle conversations about stress and school anxiety.",
    },
  ]

  const statCards = [
    {
      title: "Sessions completed",
      value: sessionsCompleted,
      subtitle: "Structured check-ins and practice moments",
      icon: RefreshCw,
      accent: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Mood trend",
      value: moodTrend,
      subtitle: "Based on the most recent seven mood entries",
      icon: TrendingUp,
      accent: "bg-emerald-500/10 text-emerald-600",
    },
    {
      title: "Coping skills practiced",
      value: copingSkillsUsed.length,
      subtitle: "Breathing and emotional naming remain the most used",
      icon: Heart,
      accent: "bg-rose-500/10 text-rose-600",
    },
  ]

  return (
    <div className="space-y-6 fade-in-up">
      <section className="rounded-[2rem] border border-border/60 bg-gradient-to-br from-slate-50 via-white to-sky-50 shadow-sm">
        <div className="grid gap-6 px-6 py-8 md:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Care Dashboard
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {childProfile?.name ? `${childProfile.name}'s wellness overview` : "Your wellness overview"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                Track mood patterns, completed sessions, and practical support suggestions in one calm, organized workspace.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <DashboardStat label="Profile" value={childProfile?.name || "Active"} />
            <DashboardStat label="Recent mood" value={latestMood.charAt(0).toUpperCase() + latestMood.slice(1)} />
            <DashboardStat label="Focus" value="Consistency" />
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title} className="border border-border/60 bg-white/90 shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
                <div>
                  <CardTitle className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {card.title}
                  </CardTitle>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{card.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{card.subtitle}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border border-border/60 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Weekly mood overview</CardTitle>
            <p className="text-sm text-muted-foreground">
              A simple visual snapshot of recent emotional patterns over the last seven check-ins.
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-80 rounded-2xl bg-slate-50/70 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={36} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                  <YAxis
                    domain={[0, 6]}
                    ticks={[1, 2, 3, 4, 5, 6]}
                    tickFormatter={(value) => {
                      const mood = moodLevels[value - 1]
                      return mood ? mood.charAt(0).toUpperCase() + mood.slice(1) : ""
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.25, radius: 12 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-lg">
                            <p className="text-sm font-semibold text-foreground">{data.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {data.day} · {data.date}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="mood" radius={[10, 10, 0, 0]} animationDuration={850} animationEasing="ease-out">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-white/90 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Suggested next supports</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Curated ideas based on recent patterns and calming practice.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((recommendation) => (
              <div
                key={recommendation.title}
                className="rounded-2xl border border-border/70 bg-slate-50/75 p-4 transition-colors hover:bg-slate-100/80"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{recommendation.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{recommendation.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DashboardStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/82 p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-3 text-lg font-semibold text-foreground">{value}</p>
    </div>
  )
}
