"use client"

import type { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useApp } from "@/components/providers/app-provider"

export function AppShell({ children }: { children: ReactNode }) {
  const { childProfile } = useApp()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-end border-b border-border bg-card px-6">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {childProfile?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </header>
        <main className="flex-1 overflow-auto bg-background p-6">{children}</main>
      </div>
    </div>
  )
}
