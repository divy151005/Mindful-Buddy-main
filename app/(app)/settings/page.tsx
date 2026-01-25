"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useApp } from "@/components/providers/app-provider"
import { User, Bell, Shield, HelpCircle } from "lucide-react"

export default function SettingsPage() {
  const { childProfile } = useApp()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Child Profile</CardTitle>
              </div>
              <CardDescription>{"Manage your child's profile information."}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                    {childProfile?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={childProfile?.name || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" defaultValue={childProfile?.age || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" defaultValue={childProfile?.dateOfBirth || ""} />
                </div>
              </div>

              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Choose what notifications you receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Session Reminders</p>
                  <p className="text-sm text-muted-foreground">Get reminded about scheduled sessions</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Assessment Results</p>
                  <p className="text-sm text-muted-foreground">Notify when assessment results are ready</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Daily Tips</p>
                  <p className="text-sm text-muted-foreground">Receive daily mental health tips</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Progress Updates</p>
                  <p className="text-sm text-muted-foreground">Weekly progress summaries</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Privacy & Security</CardTitle>
              </div>
              <CardDescription>Manage your privacy settings and data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Data Sharing</p>
                  <p className="text-sm text-muted-foreground">Share progress with healthcare providers</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Anonymous Analytics</p>
                  <p className="text-sm text-muted-foreground">Help improve the app with anonymous data</p>
                </div>
                <Switch />
              </div>
              <div className="pt-2">
                <Button variant="outline" className="mr-2 bg-transparent">
                  Export Data
                </Button>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-primary" />
                <CardTitle>Help & Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Frequently Asked Questions
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Contact Support
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Privacy Policy
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Terms of Service
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none bg-primary/5 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Mindful Buddy v1.0.0</p>
              <p className="text-xs text-muted-foreground">Made with care for children&apos;s mental health</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
