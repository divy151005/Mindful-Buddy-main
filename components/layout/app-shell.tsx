"use client"

import type { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useApp } from "@/components/providers/app-provider"
import { Bell, Search, Sparkles } from "lucide-react"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export function AppShell({ children }: { children: ReactNode }) {
  const { childProfile } = useApp()

  return (
    <div className="app-canvas flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="pro-panel mx-4 mt-4 flex h-18 items-center justify-between rounded-2xl px-5">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Mindful Buddy</p>
              <p className="text-sm text-muted-foreground">
                {getGreeting()},{" "}
                <span className="font-semibold text-foreground">{childProfile?.name || "there"}</span>
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-primary lg:inline-flex">
              <Sparkles className="h-3.5 w-3.5" />
              Calm, guided support
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-2 text-sm text-muted-foreground md:flex">
              <Search className="h-4 w-4" />
              Search tools, screens, and resources
            </div>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>

            <Avatar className="h-10 w-10 ring-2 ring-primary/15 ring-offset-2 ring-offset-background transition-transform duration-200 hover:scale-105 cursor-pointer">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                {childProfile?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-auto px-4 pb-4 pt-4">
          <div className="mx-auto h-full max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  )
}
