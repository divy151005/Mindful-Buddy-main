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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Your Progress</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sessions Completed</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{sessionsCompleted}</div>
            <p className="text-xs text-muted-foreground">+2 since last week</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mood Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{moodTrend}</div>
            <p className="text-xs text-muted-foreground">Up by 15% this month</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Coping Skills Practiced</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{copingSkillsUsed.length}</div>
            <p className="text-xs text-muted-foreground">Deep breathing was your most used skill</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="border-none shadow-sm lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Weekly Mood Overview</CardTitle>
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

        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-warning" />
              <CardTitle className="text-xl font-bold">For You</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on your recent chats, here are some things you might like.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="text-sm font-medium text-foreground">{rec.title}</p>
                  <p className="text-xs text-muted-foreground">{rec.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
