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
  },
  {
    id: 2,
    name: "Mindful Buddy Support",
    role: "Support Team",
    lastMessage: "Your assessment results are ready to view.",
    time: "1d ago",
    unread: false,
  },
  {
    id: 3,
    name: "Ms. Emily Chen",
    role: "School Counselor",
    lastMessage: "I've shared some resources for the classroom.",
    time: "3d ago",
    unread: false,
  },
]

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="mt-2 text-muted-foreground">Communicate with healthcare providers and support team.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search messages..." className="pl-10" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-1">
          {conversations.map((conv) => (
            <Card
              key={conv.id}
              className={`cursor-pointer border-none shadow-sm transition-shadow hover:shadow-md ${
                conv.unread ? "bg-primary/5" : ""
              }`}
            >
              <CardContent className="flex items-start gap-3 p-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
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
                {conv.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-secondary text-secondary-foreground">S</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">Dr. Sarah Johnson</CardTitle>
                <p className="text-xs text-muted-foreground">Child Psychologist</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex h-[400px] flex-col p-0">
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <div className="flex justify-start">
                <div className="max-w-[75%] rounded-2xl bg-muted px-4 py-2">
                  <p className="text-sm">
                    Hi! I wanted to follow up on our session yesterday. How has Alex been doing with the breathing
                    exercises we practiced?
                  </p>
                  <span className="mt-1 block text-xs text-muted-foreground">Yesterday, 2:30 PM</span>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="max-w-[75%] rounded-2xl bg-primary px-4 py-2 text-primary-foreground">
                  <p className="text-sm">
                    {
                      "Hi Dr. Johnson! Alex has been doing really well. He's been practicing the balloon breathing every night before bed."
                    }
                  </p>
                  <span className="mt-1 block text-xs opacity-80">Yesterday, 4:15 PM</span>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="max-w-[75%] rounded-2xl bg-muted px-4 py-2">
                  <p className="text-sm">
                    {
                      "That's wonderful to hear! Great progress this week! Keep up the breathing exercises. I'll see you both next Tuesday."
                    }
                  </p>
                  <span className="mt-1 block text-xs text-muted-foreground">2 hours ago</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <Input placeholder="Type a message..." className="flex-1" />
                <Button size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none bg-muted/50 shadow-sm">
        <CardContent className="flex items-center gap-4 p-4">
          <UserCircle className="h-10 w-10 text-muted-foreground" />
          <div className="flex-1">
            <h4 className="font-medium text-foreground">Connect with a Professional</h4>
            <p className="text-sm text-muted-foreground">
              Need to speak with a mental health professional? Request a consultation.
            </p>
          </div>
          <Button>Request Consultation</Button>
        </CardContent>
      </Card>
    </div>
  )
}
