"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, BookOpen, Video, FileText, Phone, Heart, Users } from "lucide-react"

const resources = [
  {
    category: "Educational Materials",
    icon: BookOpen,
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-600",
    items: [
      {
        title: "Understanding Child Anxiety",
        description: "A guide for parents on recognizing and supporting anxious children",
        type: "Article",
        typeColor: "bg-blue-100 text-blue-700",
      },
      {
        title: "Emotional Regulation for Kids",
        description: "Techniques to help children manage big emotions",
        type: "PDF Guide",
        typeColor: "bg-emerald-100 text-emerald-700",
      },
      {
        title: "Building Resilience in Children",
        description: "Strategies to help your child bounce back from challenges",
        type: "Article",
        typeColor: "bg-blue-100 text-blue-700",
      },
    ],
  },
  {
    category: "Videos & Activities",
    icon: Video,
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-600",
    items: [
      {
        title: "Breathing Exercises for Kids",
        description: "Fun animated breathing exercises for calm",
        type: "Video",
        typeColor: "bg-purple-100 text-purple-700",
      },
      {
        title: "Mindfulness for Children",
        description: "Age-appropriate meditation practices",
        type: "Video Series",
        typeColor: "bg-violet-100 text-violet-700",
      },
      {
        title: "Yoga for Kids",
        description: "Gentle yoga routines for stress relief",
        type: "Video",
        typeColor: "bg-purple-100 text-purple-700",
      },
    ],
  },
  {
    category: "Assessment Information",
    icon: FileText,
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-600",
    items: [
      {
        title: "About M-CHAT Screening",
        description: "Understanding the Modified Checklist for Autism in Toddlers",
        type: "Guide",
        typeColor: "bg-amber-100 text-amber-700",
      },
      {
        title: "PSC Explained",
        description: "What the Pediatric Symptom Checklist measures",
        type: "Article",
        typeColor: "bg-blue-100 text-blue-700",
      },
      {
        title: "Developmental Milestones",
        description: "What to expect at each age",
        type: "Reference",
        typeColor: "bg-cyan-100 text-cyan-700",
      },
    ],
  },
  {
    category: "Crisis Support",
    icon: Phone,
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-600",
    items: [
      {
        title: "Crisis Hotlines",
        description: "Emergency contacts for immediate support",
        type: "Resource List",
        typeColor: "bg-rose-100 text-rose-700",
      },
      {
        title: "When to Seek Help",
        description: "Signs that indicate professional help is needed",
        type: "Guide",
        typeColor: "bg-amber-100 text-amber-700",
      },
      {
        title: "Finding a Therapist",
        description: "How to find the right mental health professional for your child",
        type: "Guide",
        typeColor: "bg-amber-100 text-amber-700",
      },
    ],
  },
]

const quickTips = [
  {
    icon: Heart,
    title: "Daily Check-ins",
    description: "Ask your child about their feelings each day",
    gradient: "from-pink-500/10 to-rose-500/10",
    iconBg: "bg-pink-500/20",
    iconColor: "text-pink-600",
  },
  {
    icon: Users,
    title: "Quality Time",
    description: "Spend dedicated one-on-one time with your child",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-600",
  },
  {
    icon: BookOpen,
    title: "Read Together",
    description: "Books about emotions help children understand feelings",
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-600",
  },
]

export default function ResourcesPage() {
  return (
    <div className="space-y-6 fade-in-up">
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
            <Card
              key={idx}
              className={`card-hover border-none shadow-sm bg-gradient-to-br ${tip.gradient} overflow-hidden`}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tip.iconBg}`}>
                  <Icon className={`h-5 w-5 ${tip.iconColor}`} />
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
            <Card key={category.category} className="card-hover border-none shadow-sm gradient-border-top overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${category.iconBg}`}>
                    <Icon className={`h-5 w-5 ${category.iconColor}`} />
                  </div>
                  <CardTitle>{category.category}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center justify-between rounded-xl bg-muted/30 p-3 transition-all duration-200 hover:bg-muted/60 cursor-pointer"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <span className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${item.typeColor}`}>
                        {item.type}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0 transition-transform duration-200 group-hover:rotate-12">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-none overflow-hidden shadow-md bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/20">
              <Phone className="h-8 w-8 text-rose-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">Need Immediate Help?</h3>
              <p className="text-muted-foreground">
                If your child is in crisis or you need immediate support, please contact a crisis helpline or visit your
                nearest emergency room.
              </p>
            </div>
            <Button className="shrink-0 bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
              View Crisis Resources
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
