"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CalendarClock, MessageCircle, ShieldCheck, Sparkles, Star, Stethoscope } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Doctor = {
  id: string
  name: string
  specialization: string
  rating: number
  experienceYears: number
  languages: string[]
  modes: Array<"chat" | "appointment">
  bio: string
  nextAvailable: string
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/doctors")
      const data = (await response.json()) as Doctor[]
      setDoctors(data)
    })()
  }, [])

  return (
    <div className="space-y-6 fade-in-up">
      <section className="rounded-[2rem] border border-border/60 bg-gradient-to-br from-slate-50 via-white to-sky-50 shadow-sm">
        <div className="grid gap-6 px-6 py-7 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Link href="/assessments/mchat">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Specialist Directory
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Doctor consultation options</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Browse specialists who can review M-CHAT reports, offer quick guidance by chat, or support formal follow-up appointments.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <DirectoryStat label="Doctors" value={String(doctors.length || 0)} />
            <DirectoryStat label="Review ready" value="M-CHAT report" />
            <DirectoryStat label="Support mode" value="Chat + booking" />
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="border border-border/60 bg-white/90 shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    {doctor.name}
                  </CardTitle>
                  <CardDescription>{doctor.specialization}</CardDescription>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 shadow-sm">
                  <Star className="mr-1 inline h-3 w-3 fill-current" />
                  {doctor.rating}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted-foreground">{doctor.bio}</p>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1">{doctor.experienceYears} years experience</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">{doctor.languages.join(", ")}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">Next available {formatDate(doctor.nextAvailable)}</span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-slate-50/70 p-4">
                  <p className="font-medium text-foreground">Chat Support</p>
                  <p className="mt-1 text-muted-foreground">
                    {doctor.modes.includes("chat") ? "Available for quick review" : "Not available"}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-slate-50/70 p-4">
                  <p className="font-medium text-foreground">Appointments</p>
                  <p className="mt-1 text-muted-foreground">
                    {doctor.modes.includes("appointment") ? "Available for booking" : "Not available"}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 text-sm text-emerald-800">
                <div className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4" />
                  Doctors receive your shared assessment summary before the consultation request is reviewed.
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild className="rounded-full">
                  <Link href="/assessments/mchat">
                    <MessageCircle className="h-4 w-4" />
                    Send Chat Request
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/assessments/mchat">
                    <CalendarClock className="h-4 w-4" />
                    Book via M-CHAT Flow
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function DirectoryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-3 text-lg font-semibold text-foreground">{value}</p>
    </div>
  )
}
