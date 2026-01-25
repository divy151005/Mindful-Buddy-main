"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, BookOpen, Video, FileText, Phone, Heart, Users } from "lucide-react"

const resources = [
  {
    category: "Educational Materials",
    icon: BookOpen,
    items: [
      {
        title: "Understanding Child Anxiety",
        description: "A guide for parents on recognizing and supporting anxious children",
        type: "Article",
      },
      {
        title: "Emotional Regulation for Kids",
        description: "Techniques to help children manage big emotions",
        type: "PDF Guide",
      },
      {
        title: "Building Resilience in Children",
        description: "Strategies to help your child bounce back from challenges",
        type: "Article",
      },
    ],
  },
  {
    category: "Videos & Activities",
    icon: Video,
    items: [
      {
        title: "Breathing Exercises for Kids",
        description: "Fun animated breathing exercises for calm",
        type: "Video",
      },
      { title: "Mindfulness for Children", description: "Age-appropriate meditation practices", type: "Video Series" },
      { title: "Yoga for Kids", description: "Gentle yoga routines for stress relief", type: "Video" },
    ],
  },
  {
    category: "Assessment Information",
    icon: FileText,
    items: [
      {
        title: "About M-CHAT Screening",
        description: "Understanding the Modified Checklist for Autism in Toddlers",
        type: "Guide",
      },
      { title: "PSC Explained", description: "What the Pediatric Symptom Checklist measures", type: "Article" },
      { title: "Developmental Milestones", description: "What to expect at each age", type: "Reference" },
    ],
  },
  {
    category: "Crisis Support",
    icon: Phone,
    items: [
      { title: "Crisis Hotlines", description: "Emergency contacts for immediate support", type: "Resource List" },
      { title: "When to Seek Help", description: "Signs that indicate professional help is needed", type: "Guide" },
      {
        title: "Finding a Therapist",
        description: "How to find the right mental health professional for your child",
        type: "Guide",
      },
    ],
  },
]

const quickTips = [
  { icon: Heart, title: "Daily Check-ins", description: "Ask your child about their feelings each day" },
  { icon: Users, title: "Quality Time", description: "Spend dedicated one-on-one time with your child" },
  { icon: BookOpen, title: "Read Together", description: "Books about emotions help children understand feelings" },
]

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Resources</h1>
        <p className="mt-2 text-muted-foreground">
          {"Educational materials and support resources for children's mental health."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {quickTips.map((tip, idx) => {
          const Icon = tip.icon
          return (
            <Card key={idx} className="border-none bg-secondary/30 shadow-sm">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Icon className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {resources.map((category) => {
          const Icon = category.icon
          return (
            <Card key={category.category} className="border-none shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>{category.category}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <span className="mt-1 inline-block rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                        {item.type}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-none bg-primary/5 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Phone className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">Need Immediate Help?</h3>
              <p className="text-muted-foreground">
                If your child is in crisis or you need immediate support, please contact a crisis helpline or visit your
                nearest emergency room.
              </p>
            </div>
            <Button className="shrink-0">View Crisis Resources</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
