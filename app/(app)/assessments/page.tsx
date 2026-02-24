"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ClipboardCheck, Baby, Users, Eye, Brain, Gamepad2, FileText } from "lucide-react"

const assessments = [
  {
    id: "psc",
    title: "Pediatric Symptom Checklist (PSC)",
    description: "A brief screening questionnaire to assess a child's emotional and behavioral problems.",
    bestFor: "General screening for a wide range of psychosocial problems.",
    icon: ClipboardCheck,
    href: "/assessments/psc",
    ageRange: "4-16 years",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-600",
    ageBadgeColor: "bg-blue-100 text-blue-700",
  },
  {
    id: "asq",
    title: "Ages and Stages Questionnaires (ASQ)",
    description: "A developmental screening tool that pinpoints developmental progress in children.",
    bestFor: "Screening for developmental delays in young children.",
    icon: Baby,
    href: "/assessments/asq",
    ageRange: "1-66 months",
    iconBg: "bg-pink-500/15",
    iconColor: "text-pink-600",
    ageBadgeColor: "bg-pink-100 text-pink-700",
  },
  {
    id: "peds",
    title: "Parents' Evaluation of Developmental Status (PEDS)",
    description: "A screening tool that elicits and addresses parents' concerns about their child's development.",
    bestFor: "Identifying children at risk for developmental and behavioral problems based on parent concerns.",
    icon: Users,
    href: "/assessments/peds",
    ageRange: "0-8 years",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-600",
    ageBadgeColor: "bg-amber-100 text-amber-700",
  },
  {
    id: "mchat",
    title: "Modified Checklist for Autism in Toddlers (M-CHAT)",
    description:
      "A screening tool for parents to assess the risk of Autism Spectrum Disorder in toddlers (16-30 months).",
    bestFor: "Screening for autism in toddlers.",
    icon: Eye,
    href: "/assessments/mchat",
    ageRange: "16-30 months",
    featured: true,
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-600",
    ageBadgeColor: "bg-violet-100 text-violet-700",
  },
  {
    id: "neuropsych",
    title: "Neuropsychological Tests",
    description: "A set of tests to assess cognitive functions like attention, memory, and executive function.",
    bestFor: "Diagnosing conditions like ADHD and learning disabilities.",
    icon: Brain,
    href: "/assessments/neuropsych",
    ageRange: "5+ years",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-600",
    ageBadgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "iq-game",
    title: "IQ Game: Number Sequences",
    description:
      "A fun game to test and improve pattern recognition and logical reasoning skills by completing number sequences.",
    bestFor: "Assessing and improving fluid intelligence and problem-solving skills.",
    icon: Gamepad2,
    href: "/games/number-sequences",
    ageRange: "5+ years",
    iconBg: "bg-cyan-500/15",
    iconColor: "text-cyan-600",
    ageBadgeColor: "bg-cyan-100 text-cyan-700",
  },
  {
    id: "psychiatric",
    title: "Comprehensive Psychiatric Evaluation",
    description: "A thorough assessment including interviews, observations, and input from parents/teachers.",
    bestFor: "In-depth evaluation of mental health conditions.",
    icon: FileText,
    href: "/assessments/psychiatric",
    ageRange: "All ages",
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-600",
    ageBadgeColor: "bg-rose-100 text-rose-700",
  },
]

export default function AssessmentsPage() {
  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mental Health Assessments</h1>
        <p className="mt-2 text-muted-foreground">
          {"Choose an assessment to understand and support your child's mental well-being."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {assessments.map((assessment, idx) => {
          const Icon = assessment.icon
          return (
            <Card
              key={assessment.id}
              className={`card-hover border-none shadow-sm overflow-hidden group transition-all duration-300 ${assessment.featured ? "ring-2 ring-primary/40 pulse-glow" : ""
                }`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${assessment.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className={`h-5 w-5 ${assessment.iconColor}`} />
                    </div>
                    {assessment.featured && (
                      <span className="rounded-full bg-gradient-to-r from-primary/20 to-accent/20 px-2.5 py-1 text-xs font-semibold text-primary">
                        ✨ Featured
                      </span>
                    )}
                  </div>
                </div>
                <CardTitle className="mt-3 text-lg">{assessment.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{assessment.description}</p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium text-foreground">Best for:</span>{" "}
                    <span className="text-muted-foreground">{assessment.bestFor}</span>
                  </p>
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${assessment.ageBadgeColor}`}>
                    {assessment.ageRange}
                  </span>
                </div>
                <Button asChild className="w-full gap-2 bg-gradient-to-r from-primary to-primary/85 shadow-sm hover:shadow-md transition-all duration-200">
                  <Link href={assessment.href}>
                    Start Assessment
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
