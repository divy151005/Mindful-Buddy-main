import type React from "react"
import type { Metadata, Viewport } from "next"
import { Nunito, Nunito_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AppProvider } from "@/components/providers/app-provider"

const nunito = Nunito({ subsets: ["latin"], variable: "--font-heading" })
const nunitoSans = Nunito_Sans({ subsets: ["latin"], variable: "--font-body" })

export const metadata: Metadata = {
  title: "Mindful Buddy - Mental Health Triage for Kids",
  description:
    "A conversational AI platform for children's mental health screening, assessments, and cognitive development games.",
  keywords: ["mental health", "children", "triage", "assessments", "M-CHAT", "PSC", "IQ games"],
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#5B9BD5",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${nunitoSans.variable} font-sans antialiased`}>
        <AppProvider>{children}</AppProvider>
        <Analytics />
      </body>
    </html>
  )
}
