"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { MessageCircle, LayoutDashboard, ClipboardList, BookOpen, Mail, Settings, Brain, Gamepad2 } from "lucide-react"

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
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-3 border-b border-sidebar-border p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-md">
          <Brain className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold gradient-text">Mindful Buddy</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
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

      <div className="border-t border-sidebar-border p-4">
        <Link
          href="/settings"
          className={cn(
            "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
            pathname === "/settings"
              ? "bg-primary/10 text-primary shadow-sm"
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

      <div className="border-t border-sidebar-border px-6 py-3">
        <p className="text-xs text-muted-foreground/60 text-center">v1.0.0 · Made with 💜</p>
      </div>
    </aside>
  )
}
