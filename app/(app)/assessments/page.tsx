"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Baby,
  Brain,
  ClipboardCheck,
  Eye,
  FileText,
  Gamepad2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react"

const assessments = [
  {
    id: "psc",
    title: "Pediatric Symptom Checklist (PSC)",
    description: "A brief screening questionnaire to assess a child's emotional and behavioral problems.",
    bestFor: "General screening for a wide range of psychosocial problems.",
    category: "Behavioral Screening",
    duration: "5-7 min",
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
    category: "Developmental",
    duration: "8-10 min",
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
    category: "Parent-Reported",
    duration: "6-8 min",
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
    bestFor: "Autism screening, follow-up guidance, and specialist triage.",
    category: "Autism Screening",
    duration: "10-12 min",
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
    category: "Cognitive Testing",
    duration: "15-20 min",
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
    category: "Interactive Game",
    duration: "5 min",
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
    category: "Clinical Review",
    duration: "20+ min",
    icon: FileText,
    href: "/assessments/psychiatric",
    ageRange: "All ages",
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-600",
    ageBadgeColor: "bg-rose-100 text-rose-700",
  },
]

const quickStats = [
  { label: "Assessment tools", value: `${assessments.length}+`, icon: ClipboardCheck },
  { label: "Age coverage", value: "0-16 yrs", icon: Users },
  { label: "Specialist-ready", value: "Reports", icon: Stethoscope },
]

export default function AssessmentsPage() {
  return (
    <div className="space-y-8 fade-in-up">
      <section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-br from-slate-50 via-white to-sky-50 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.12),_transparent_28%)]" />
        <div className="relative grid gap-8 px-6 py-8 md:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Clinical Screening Hub
            </div>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Mental health assessments designed for clear screening, support, and next steps.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                Choose a structured screening tool for developmental, behavioral, and autism-related concerns.
                Each assessment is organized for parents and caregivers, with guided routing into deeper evaluation when needed.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="gap-2 rounded-full px-5 shadow-sm">
                <Link href="/assessments/mchat">
                  Start Featured Screening
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Parent-friendly guidance and structured follow-up
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {quickStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-4 text-2xl font-semibold text-foreground">{stat.value}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <InfoPanel
          title="Screen with confidence"
          text="Use established checklists to organize concerns before discussing them with a clinician."
          tone="from-blue-50 to-white"
        />
        <InfoPanel
          title="Track by age and need"
          text="Compare tools by age range, best-fit use case, and expected time before you begin."
          tone="from-emerald-50 to-white"
        />
        <InfoPanel
          title="Move toward action"
          text="Featured flows like M-CHAT can lead into result interpretation, reports, and consultation."
          tone="from-amber-50 to-white"
        />
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Assessment Library</h2>
            <p className="text-sm text-muted-foreground">
              A curated mix of screening tools, deeper evaluations, and interactive skill-based activities.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Featured recommendation: <span className="font-medium text-foreground">M-CHAT for autism screening</span>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {assessments.map((assessment, idx) => {
            const Icon = assessment.icon
            return (
              <Card
                key={assessment.id}
                className={`card-hover group overflow-hidden border border-border/60 bg-white/90 shadow-sm transition-all duration-300 ${
                  assessment.featured ? "ring-2 ring-primary/30 shadow-lg shadow-primary/10" : ""
                }`}
                style={{ animationDelay: `${idx * 70}ms` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${assessment.iconBg} transition-transform duration-300 group-hover:scale-105`}
                      >
                        <Icon className={`h-5 w-5 ${assessment.iconColor}`} />
                      </div>
                      <div className="space-y-2">
                        <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {assessment.category}
                        </span>
                        {assessment.featured ? (
                          <span className="inline-flex rounded-full bg-gradient-to-r from-primary/15 to-accent/25 px-2.5 py-1 text-xs font-semibold text-primary">
                            Featured Flow
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${assessment.ageBadgeColor}`}
                    >
                      {assessment.ageRange}
                    </span>
                  </div>
                  <CardTitle className="mt-4 text-xl leading-tight">{assessment.title}</CardTitle>
                </CardHeader>

                <CardContent className="flex h-full flex-col gap-5">
                  <p className="text-sm leading-6 text-muted-foreground">{assessment.description}</p>

                  <div className="grid gap-3 rounded-2xl bg-slate-50/80 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Best for
                      </span>
                      <span className="text-xs font-medium text-foreground">{assessment.duration}</span>
                    </div>
                    <p className="text-sm text-foreground/85">{assessment.bestFor}</p>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Open assessment</p>
                    <Button
                      asChild
                      className="gap-2 rounded-full bg-gradient-to-r from-primary to-primary/85 px-4 shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                      <Link href={assessment.href}>
                        Begin
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function InfoPanel({
  title,
  text,
  tone,
}: {
  title: string
  text: string
  tone: string
}) {
  return (
    <div className={`rounded-2xl border border-border/60 bg-gradient-to-br ${tone} p-5 shadow-sm`}>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  )
}
