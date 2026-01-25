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
  },
  {
    id: "asq",
    title: "Ages and Stages Questionnaires (ASQ)",
    description: "A developmental screening tool that pinpoints developmental progress in children.",
    bestFor: "Screening for developmental delays in young children.",
    icon: Baby,
    href: "/assessments/asq",
    ageRange: "1-66 months",
  },
  {
    id: "peds",
    title: "Parents' Evaluation of Developmental Status (PEDS)",
    description: "A screening tool that elicits and addresses parents' concerns about their child's development.",
    bestFor: "Identifying children at risk for developmental and behavioral problems based on parent concerns.",
    icon: Users,
    href: "/assessments/peds",
    ageRange: "0-8 years",
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
  },
  {
    id: "neuropsych",
    title: "Neuropsychological Tests",
    description: "A set of tests to assess cognitive functions like attention, memory, and executive function.",
    bestFor: "Diagnosing conditions like ADHD and learning disabilities.",
    icon: Brain,
    href: "/assessments/neuropsych",
    ageRange: "5+ years",
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
  },
  {
    id: "psychiatric",
    title: "Comprehensive Psychiatric Evaluation",
    description: "A thorough assessment including interviews, observations, and input from parents/teachers.",
    bestFor: "In-depth evaluation of mental health conditions.",
    icon: FileText,
    href: "/assessments/psychiatric",
    ageRange: "All ages",
  },
]

export default function AssessmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mental Health Assessments</h1>
        <p className="mt-2 text-muted-foreground">
          {"Choose an assessment to understand and support your child's mental well-being."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {assessments.map((assessment) => {
          const Icon = assessment.icon
          return (
            <Card
              key={assessment.id}
              className={`border-none shadow-sm transition-shadow hover:shadow-md ${
                assessment.featured ? "ring-2 ring-primary" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <Icon className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    {assessment.featured && (
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <CardTitle className="mt-3 text-lg">{assessment.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{assessment.description}</p>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium text-foreground">Best for:</span>{" "}
                    <span className="text-muted-foreground">{assessment.bestFor}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Age range: {assessment.ageRange}</p>
                </div>
                <Button asChild className="w-full gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  <Link href={assessment.href}>
                    Start Assessment
                    <ArrowRight className="h-4 w-4" />
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
