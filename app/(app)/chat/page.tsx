"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Brain, Sparkles, Heart, Shield } from "lucide-react"
import { useApp } from "@/components/providers/app-provider"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickResponses = [
  { label: "I'm feeling worried", icon: Heart },
  { label: "I want to play a game", icon: Sparkles },
  { label: "Tell me a calming story", icon: Shield },
]

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hi there! I'm Mindful Buddy, your friendly helper. I'm here to chat, play games, and help you understand your feelings. How are you feeling today?",
    timestamp: new Date(),
  },
]

export default function ChatPage() {
  const { childProfile, incrementSessions, addCopingSkill } = useApp()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("worried") || lowerMessage.includes("scared") || lowerMessage.includes("anxious")) {
      addCopingSkill("talking about feelings")
      return "I hear you're feeling worried. That's a brave thing to share! Let's try something together. Can you take a deep breath with me? Breathe in slowly... 1, 2, 3, 4... Now breathe out... 1, 2, 3, 4. How do you feel now? Would you like to tell me more about what's making you worried?"
    }

    if (lowerMessage.includes("sad") || lowerMessage.includes("unhappy") || lowerMessage.includes("crying")) {
      addCopingSkill("expressing emotions")
      return "I'm sorry you're feeling sad. It's okay to feel this way sometimes. Everyone feels sad sometimes, even grown-ups! Would you like to draw how you're feeling, or would you like me to tell you a story about a character who felt sad too?"
    }

    if (lowerMessage.includes("angry") || lowerMessage.includes("mad") || lowerMessage.includes("frustrated")) {
      addCopingSkill("managing anger")
      return "I can tell you're feeling really strong emotions right now. That's okay! When I feel angry, I like to squeeze my hands tight like a lemon, then let go. Want to try that with me? Squeeze... and release! Better? Let's talk about what made you feel this way."
    }

    if (lowerMessage.includes("game") || lowerMessage.includes("play")) {
      return "Great idea! I love playing games! We have some fun brain games that can help you feel good and get smarter at the same time. Would you like to try a pattern matching game, a memory game, or a number puzzle? You can also go to the Brain Games section to see all our games!"
    }

    if (lowerMessage.includes("story") || lowerMessage.includes("calming")) {
      addCopingSkill("relaxation through stories")
      return "Once upon a time, in a cozy forest, there lived a little cloud named Fluffy. Fluffy loved floating through the sky, watching all the animals below. One day, Fluffy felt too heavy with rain. A wise old tree said, 'Let it out, little cloud. It's okay to rain.' So Fluffy gently let the rain fall, and felt much lighter and happier. The forest animals danced in the rain, and everyone was joyful. The end! How did that story make you feel?"
    }

    if (lowerMessage.includes("happy") || lowerMessage.includes("good") || lowerMessage.includes("great")) {
      return "That's wonderful to hear! I'm so happy that you're feeling good today! What's something fun that happened? Or would you like to play a game to celebrate your good mood?"
    }

    if (lowerMessage.includes("school") || lowerMessage.includes("homework") || lowerMessage.includes("teacher")) {
      return "School can be really interesting! Sometimes it's fun, and sometimes it can feel hard. What's something you enjoy about school? Or if something is bothering you about school, I'm here to listen."
    }

    if (lowerMessage.includes("friend") || lowerMessage.includes("friends")) {
      return "Friends are special! They can make us laugh and feel happy. Do you want to tell me about your friends? Or is there something about friends that's on your mind?"
    }

    if (lowerMessage.includes("sleep") || lowerMessage.includes("nightmare") || lowerMessage.includes("dream")) {
      addCopingSkill("sleep relaxation")
      return "Sleep is so important for growing strong! If you're having trouble sleeping or had a bad dream, we can practice some calming thoughts together. Imagine you're floating on a soft, fluffy cloud, surrounded by your favorite colors. Everything is peaceful and safe. Would you like me to teach you more bedtime calming tricks?"
    }

    return `Thanks for sharing that with me, ${childProfile?.name || "friend"}! I'm always here to listen. Would you like to talk more about how you're feeling, play a brain game, or hear a calming story?`
  }

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim()
    if (!text) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getAIResponse(text),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, aiResponse])
    setIsTyping(false)
    incrementSessions()
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground">Chat with Mindful Buddy</h1>
        <p className="text-sm text-muted-foreground">
          Talk to me about anything - your feelings, your day, or just to play!
        </p>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden border-none shadow-sm">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3", message.role === "user" ? "flex-row-reverse" : "flex-row")}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback
                  className={cn(
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground",
                  )}
                >
                  {message.role === "user" ? childProfile?.name?.charAt(0) || "U" : <Brain className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-3 text-sm",
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                )}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-accent text-accent-foreground">
                  <Brain className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-2xl bg-muted px-4 py-3">
                <div className="flex gap-1">
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border bg-card p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {quickResponses.map((response) => {
              const Icon = response.icon
              return (
                <Button
                  key={response.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSend(response.label)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {response.label}
                </Button>
              )
            })}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
