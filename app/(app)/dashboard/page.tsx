"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/components/providers/app-provider"
import { RefreshCw, TrendingUp, Heart, Lightbulb, CheckCircle, Video, Gamepad } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"

const moodColors: Record<string, string> = {
  excited: "#10b981",
  happy: "#34d399",
  calm: "#a78bfa",
  okay: "#fbbf24",
  sad: "#60a5fa",
  anxious: "#f87171",
}

const moodLevels = ["anxious", "sad", "okay", "calm", "happy", "excited"]

export default function DashboardPage() {
  const { moodEntries, sessionsCompleted, copingSkillsUsed } = useApp()

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const chartData = moodEntries.slice(-7).map((entry, idx) => ({
    day: weekDays[idx],
    mood: moodLevels.indexOf(entry.mood) + 1,
    color: moodColors[entry.mood],
    label: entry.mood,
  }))

  const latestMood = moodEntries[moodEntries.length - 1]?.mood || "okay"
  const moodTrend = moodLevels.indexOf(latestMood) >= 3 ? "Positive" : "Needs Support"

  const recommendations = [
    {
      icon: Video,
      title: '"Mindful Monster Breathing Game for Kids" on YouTube',
      description: "An interactive video that makes breathing exercises fun and engaging.",
    },
    {
      icon: Gamepad,
      title: '"Worry Warriors Adventure"',
      description: "A game designed to help children identify and manage their worries about school in a playful way.",
    },
    {
      icon: Video,
      title: '"A Kid\'s Guide: Dealing with School Worries"',
      description: "A short animated video explaining common school anxieties and simple coping strategies.",
    },
  ]

  const statCards = [
    {
      title: "Sessions Completed",
      value: sessionsCompleted,
      subtitle: "+2 since last week",
      icon: RefreshCw,
      gradient: "from-blue-500/10 to-cyan-500/10",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-600",
    },
    {
      title: "Mood Trend",
      value: moodTrend,
      subtitle: "Up by 15% this month",
      icon: TrendingUp,
      gradient: "from-emerald-500/10 to-teal-500/10",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
    },
    {
      title: "Coping Skills Practiced",
      value: copingSkillsUsed.length,
      subtitle: "Deep breathing was your most used skill",
      icon: Heart,
      gradient: "from-pink-500/10 to-rose-500/10",
      iconBg: "bg-pink-500/15",
      iconColor: "text-pink-600",
    },
  ]

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Your Progress</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your mental wellness journey</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <Card
              key={idx}
              className={`card-hover border-none shadow-sm overflow-hidden bg-gradient-to-br ${card.gradient}`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.iconBg}`}>
                  <Icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${card.valueColor || "text-foreground"}`}>
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="card-hover border-none shadow-sm lg:col-span-3 gradient-border-top overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Weekly Mood Overview</CardTitle>
            <p className="text-sm text-muted-foreground">How you&apos;ve been feeling this week</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={40}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis
                    domain={[0, 6]}
                    ticks={[1, 2, 3, 4, 5, 6]}
                    tickFormatter={(value) => moodLevels[value - 1] || ""}
                    axisLine={false}
                    tickLine={false}
                    width={60}
                  />
                  <Bar dataKey="mood" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-none shadow-sm lg:col-span-2 gradient-border-top overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15">
                <Lightbulb className="h-5 w-5 text-amber-600" />
              </div>
              <CardTitle className="text-xl font-bold">For You</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on your recent chats, here are some things you might like.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl p-3 transition-colors duration-200 hover:bg-muted/50 cursor-pointer"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/20 mt-0.5">
                  <CheckCircle className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{rec.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{rec.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
