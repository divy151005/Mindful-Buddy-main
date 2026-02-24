"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useApp } from "@/components/providers/app-provider"
import { User, Bell, Shield, HelpCircle, FileQuestion, Mail, ScrollText, Scale } from "lucide-react"

export default function SettingsPage() {
  const { childProfile } = useApp()

  const helpLinks = [
    { label: "Frequently Asked Questions", icon: FileQuestion },
    { label: "Contact Support", icon: Mail },
    { label: "Privacy Policy", icon: ScrollText },
    { label: "Terms of Service", icon: Scale },
  ]

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-hover border-none shadow-sm gradient-border-top overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle>Child Profile</CardTitle>
              </div>
              <CardDescription>{"Manage your child's profile information."}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-4 ring-primary/20 ring-offset-2 ring-offset-background shadow-md">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-2xl text-primary-foreground font-bold">
                    {childProfile?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" className="rounded-full hover:bg-primary/5 transition-colors duration-200">
                  Change Photo
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={childProfile?.name || ""} className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" defaultValue={childProfile?.age || ""} className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" defaultValue={childProfile?.dateOfBirth || ""} className="rounded-lg" />
                </div>
              </div>

              <Button className="bg-gradient-to-r from-primary to-primary/85 shadow-sm hover:shadow-md transition-all duration-200">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="card-hover border-none shadow-sm gradient-border-top overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15">
                  <Bell className="h-5 w-5 text-amber-600" />
                </div>
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Choose what notifications you receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                { label: "Session Reminders", desc: "Get reminded about scheduled sessions", on: true },
                { label: "Assessment Results", desc: "Notify when assessment results are ready", on: true },
                { label: "Daily Tips", desc: "Receive daily mental health tips", on: false },
                { label: "Progress Updates", desc: "Weekly progress summaries", on: true },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl p-3 transition-colors duration-200 hover:bg-muted/40"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.on} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="card-hover border-none shadow-sm gradient-border-top overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15">
                  <Shield className="h-5 w-5 text-emerald-600" />
                </div>
                <CardTitle>Privacy & Security</CardTitle>
              </div>
              <CardDescription>Manage your privacy settings and data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                { label: "Data Sharing", desc: "Share progress with healthcare providers", on: true },
                { label: "Anonymous Analytics", desc: "Help improve the app with anonymous data", on: false },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl p-3 transition-colors duration-200 hover:bg-muted/40"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.on} />
                </div>
              ))}
              <div className="pt-3 flex gap-2">
                <Button variant="outline" className="bg-transparent rounded-full hover:bg-muted/50 transition-colors duration-200">
                  Export Data
                </Button>
                <Button variant="destructive" className="rounded-full shadow-sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="card-hover border-none shadow-sm gradient-border-top overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15">
                  <HelpCircle className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle>Help & Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {helpLinks.map((link, idx) => {
                const Icon = link.icon
                return (
                  <Button
                    key={idx}
                    variant="outline"
                    className="w-full justify-start gap-3 bg-transparent rounded-xl hover:bg-muted/50 transition-all duration-200 hover:translate-x-0.5"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {link.label}
                  </Button>
                )
              })}
            </CardContent>
          </Card>

          <Card className="border-none overflow-hidden shadow-sm bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
            <CardContent className="p-5 text-center">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-md mb-3">
                <span className="text-lg">🧠</span>
              </div>
              <p className="text-sm font-semibold text-foreground">Mindful Buddy v1.0.0</p>
              <p className="text-xs text-muted-foreground mt-1">Made with care for children&apos;s mental health</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
