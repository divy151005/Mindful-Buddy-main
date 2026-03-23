<div align="center">

# 🧠 Mindful Buddy

### AI-Powered Child Mental Health Screening and Support Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

**Mindful Buddy** is a Next.js web app for early child mental health screening, caregiver guidance, and structured follow-up. It combines screening tools, AI-style result explanations, progress tracking, therapeutic games, and specialist consultation flows into one caregiver-friendly workspace.

<img width="1470" height="835" alt="Screenshot 2026-03-23 at 11 00 46 AM" src="https://github.com/user-attachments/assets/ceffd507-3387-4fd5-b843-3f0d4d0efaf3" />


</div>

---

## ✨ Features

### 🤖 AI Chatbot
A warm, empathetic conversational agent that helps children express their feelings, tells calming stories, and provides age-appropriate emotional support with quick-response prompts.

### 📋 Clinical Assessments
- **M-CHAT-R/F workflow** — Full yes/no autism screening flow with follow-up questions, AI-style explanation, risk-based triage UI, behavioral insights, printable report, and specialist consultation handoff
- **PSC (Pediatric Symptom Checklist)** — Broad psychosocial screening with polished scoring and caregiver-friendly summary view
- **Assessment library dashboard** — Categorized cards, time estimates, age ranges, and featured screening flows

### 🎮 Cognitive Development Games
- **Memory Cards** — Flip-and-match memory game to strengthen recall
- **Pattern Matching** — Visual pattern recognition challenges
- **Number Sequences** — Logical reasoning and numerical aptitude exercises
- **M-CHAT visual observation games** — Guided activities for tracking, pointing, emotion recognition, and observation notes

### 📊 Dashboard & Mood Tracking
A polished dashboard with mood history charts, weekly trends, activity summaries, and progress indicators for caregivers.

### 👶 Child Profiles & Progress
- Child profile creation with age-based tracking
- Assessment history saved per child
- Trend visualization for repeated M-CHAT screenings
- Reminder-style retake guidance for follow-up after 30 days

### 🩺 Doctor Consultation
- Specialist directory with ratings, specialization, and consultation modes
- Chat request and appointment request flows
- Assessment report snapshot sharing with the selected doctor

### 🤖 AI-Guided Interpretation
- Parent-friendly explanation after screening
- Risk-specific next steps and home guidance
- Visible disclaimer that results are screening support, not diagnosis

### 💬 Messaging System
Secure messaging interface for communication between caregivers, counselors, and the platform.

### 📚 Resources
Curated mental health resources, articles, and support links for parents and educators.

### ⚙️ Settings
User profile management, theme preferences (dark/light mode), and notification controls.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | Radix UI Primitives, shadcn/ui |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Forms** | React Hook Form + Zod validation |
| **State & Local Data** | React Context + JSON-backed local API routes |
| **Fonts** | Geist & Geist Mono |
| **Analytics** | Vercel Analytics |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
Mindful-Buddy-main/
├── app/
│   ├── (app)/                  # App route group
│   │   ├── assessments/        # Assessment hub, M-CHAT, PSC
│   │   ├── chat/               # AI chatbot interface
│   │   ├── dashboard/          # Mood tracking & analytics
│   │   ├── doctors/            # Specialist directory and consultation UI
│   │   ├── games/              # Cognitive development games
│   │   ├── messages/           # Messaging system
│   │   ├── resources/          # Educational resources
│   │   └── settings/           # User preferences
│   ├── api/                    # Backend API routes
│   │   ├── assessments/        # Assessment endpoints
│   │   ├── consultations/      # Doctor consultation request endpoints
│   │   ├── conversational-agent/ # AI agent API
│   │   ├── development-screening/ # Screening endpoints
│   │   ├── doctors/            # Specialist directory data
│   │   ├── feedback/           # User feedback
│   │   ├── games/              # Game data endpoints
│   │   ├── iq-tests/           # IQ test endpoints
│   │   ├── mood/               # Mood tracking API
│   │   ├── profiles/           # User profiles
│   │   └── progress/           # Progress tracking
│   ├── globals.css             # Global theme, layout, and premium UI styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── layout/                 # Layout components (sidebar, header)
│   ├── providers/              # Context providers
│   └── ui/                     # Reusable UI components (shadcn/ui)
├── lib/                        # Utilities, database, schema
├── public/                     # Static assets & images
└── styles/                     # Additional stylesheets
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/divy151005/Mindful-Buddy-main.git
cd Mindful-Buddy-main

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at **http://localhost:3000**.

### Build for Production

```bash
npm run build
npm start
```

---

## 🎯 Use Cases

- **Parents & Caregivers** — Monitor your child's emotional well-being and track mood patterns over time.
- **Pediatricians & Counselors** — Review structured screening reports and use consultation flows for follow-up.
- **Educators** — Leverage cognitive games to support classroom learning and child development.
- **Children** — A safe, friendly space to talk about feelings and engage with guided developmental games.

---

## 🧭 Current Highlights

- Professionalized shared UI shell with upgraded sidebar, header, dashboard, and assessment experiences
- Full M-CHAT screening flow with follow-up, AI-style interpretation, doctor consultation UI, and print-ready report
- Child-specific tracking and progress-oriented screening history
- Local API routes for profiles, assessments, doctors, consultations, and progress

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ for children's mental health

</div>
