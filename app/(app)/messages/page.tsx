"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Send, UserCircle } from "lucide-react"

const conversations = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Child Psychologist",
    lastMessage: "Great progress this week! Keep up the breathing exercises.",
    time: "2h ago",
    unread: true,
    avatarColor: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "Mindful Buddy Support",
    role: "Support Team",
    lastMessage: "Your assessment results are ready to view.",
    time: "1d ago",
    unread: false,
    avatarColor: "from-emerald-500 to-teal-500",
  },
  {
    id: 3,
    name: "Ms. Emily Chen",
    role: "School Counselor",
    lastMessage: "I've shared some resources for the classroom.",
    time: "3d ago",
    unread: false,
    avatarColor: "from-purple-500 to-violet-500",
  },
]

export default function MessagesPage() {
  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="mt-2 text-muted-foreground">Communicate with healthcare providers and support team.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search messages..." className="pl-10 rounded-full border-border/50 bg-card" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-1">
          {conversations.map((conv) => (
            <Card
              key={conv.id}
              className={`cursor-pointer border-none shadow-sm transition-all duration-200 hover:shadow-md hover:translate-x-1 group overflow-hidden ${conv.unread ? "bg-primary/5 border-l-4 border-l-primary" : ""
                }`}
            >
              <CardContent className="flex items-start gap-3 p-4">
                <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                  <AvatarFallback className={`bg-gradient-to-br ${conv.avatarColor} text-white font-semibold`}>
                    {conv.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">{conv.name}</h4>
                    <span className="text-xs text-muted-foreground">{conv.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{conv.role}</p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{conv.lastMessage}</p>
                </div>
                {conv.unread && (
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary shadow-sm" style={{ animation: "pulse-glow 2s ease-in-out infinite" }} />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-none shadow-sm lg:col-span-2 overflow-hidden gradient-border-top">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-blue-500/20 shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold">S</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">Dr. Sarah Johnson</CardTitle>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <p className="text-xs text-muted-foreground">Child Psychologist · Online</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex h-[400px] flex-col p-0">
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <div className="flex justify-start slide-in-left">
                <div className="max-w-[75%] rounded-2xl bg-muted px-4 py-3 shadow-sm">
                  <p className="text-sm leading-relaxed">
                    Hi! I wanted to follow up on our session yesterday. How has Alex been doing with the breathing
                    exercises we practiced?
                  </p>
                  <span className="mt-1.5 block text-xs text-muted-foreground">Yesterday, 2:30 PM</span>
                </div>
              </div>

              <div className="flex justify-end slide-in-right">
                <div className="max-w-[75%] rounded-2xl bg-gradient-to-br from-primary to-primary/90 px-4 py-3 text-primary-foreground shadow-md">
                  <p className="text-sm leading-relaxed">
                    {
                      "Hi Dr. Johnson! Alex has been doing really well. He's been practicing the balloon breathing every night before bed."
                    }
                  </p>
                  <span className="mt-1.5 block text-xs opacity-70">Yesterday, 4:15 PM</span>
                </div>
              </div>

              <div className="flex justify-start slide-in-left" style={{ animationDelay: "100ms" }}>
                <div className="max-w-[75%] rounded-2xl bg-muted px-4 py-3 shadow-sm">
                  <p className="text-sm leading-relaxed">
                    {
                      "That's wonderful to hear! Great progress this week! Keep up the breathing exercises. I'll see you both next Tuesday."
                    }
                  </p>
                  <span className="mt-1.5 block text-xs text-muted-foreground">2 hours ago</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border/50 glass p-4">
              <div className="flex gap-2">
                <Input placeholder="Type a message..." className="flex-1 rounded-full border-border/50 bg-background/80" />
                <Button size="icon" className="rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none overflow-hidden shadow-sm bg-gradient-to-r from-muted/50 via-primary/5 to-muted/50">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <UserCircle className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-foreground">Connect with a Professional</h4>
            <p className="text-sm text-muted-foreground">
              Need to speak with a mental health professional? Request a consultation.
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary/85 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
            Request Consultation
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
