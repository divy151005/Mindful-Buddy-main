"use client"

import type { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useApp } from "@/components/providers/app-provider"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export function AppShell({ children }: { children: ReactNode }) {
  const { childProfile } = useApp()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="glass flex h-16 items-center justify-between border-b border-border/50 px-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {getGreeting()},{" "}
              <span className="font-semibold text-foreground">
                {childProfile?.name || "there"}
              </span>{" "}
              👋
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 ring-2 ring-primary/20 ring-offset-2 ring-offset-background transition-transform duration-200 hover:scale-110 cursor-pointer">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                {childProfile?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-background p-6">{children}</main>
      </div>
    </div>
  )
}
