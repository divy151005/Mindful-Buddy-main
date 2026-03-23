"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { MessageCircle, LayoutDashboard, ClipboardList, BookOpen, Mail, Settings, Brain, Gamepad2, ShieldCheck } from "lucide-react"

const navItems = [
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assessments", label: "Assessments", icon: ClipboardList },
  { href: "/games", label: "Brain Games", icon: Gamepad2 },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/messages", label: "Messages", icon: Mail },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar-surface flex h-screen w-72 flex-col border-r border-sidebar-border/70 px-4 py-4">
      <div className="pro-panel flex items-center gap-3 rounded-2xl px-4 py-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-md">
          <Brain className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-lg font-bold gradient-text">Mindful Buddy</p>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Child wellness platform</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "pro-panel bg-primary/8 text-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hover:translate-x-0.5",
              )}
            >
              {isActive && (
                <span className="absolute left-0 h-8 w-1 rounded-r-full bg-gradient-to-b from-primary to-accent" />
              )}
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-transparent group-hover:bg-sidebar-accent",
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-2 pb-3">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 text-sm text-emerald-800 shadow-sm">
          <div className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4" />
            Assessment and profile flows are organized for caregiver-friendly guidance.
          </div>
        </div>
      </div>

      <div className="border-t border-sidebar-border/70 p-2">
        <Link
          href="/settings"
          className={cn(
            "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
            pathname === "/settings"
              ? "pro-panel bg-primary/8 text-primary"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hover:translate-x-0.5",
          )}
        >
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
              pathname === "/settings"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-transparent group-hover:bg-sidebar-accent",
            )}
          >
            <Settings className="h-4 w-4" />
          </div>
          Settings
        </Link>
      </div>

      <div className="border-t border-sidebar-border/70 px-4 py-3">
        <p className="text-center text-xs text-muted-foreground/70">v1.0.0 · Professional caregiver workspace</p>
      </div>
    </aside>
  )
}
