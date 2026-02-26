<div align="center">

# 🧠 Mindful Buddy

### AI-Powered Mental Health Companion for Children

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

**Mindful Buddy** is a child-friendly conversational AI platform designed to support early mental health screening, emotional well-being, and cognitive development through interactive assessments, therapeutic games, and a caring AI chatbot.

![Mindful Buddy Dashboard](./public/Screenshot%202026-02-25%20221447.png)

</div>

---

## ✨ Features

### 🤖 AI Chatbot
A warm, empathetic conversational agent that helps children express their feelings, tells calming stories, and provides age-appropriate emotional support with quick-response prompts.

### 📋 Clinical Assessments
- **M-CHAT-R/F** — Modified Checklist for Autism in Toddlers (visual, image-based questionnaire)
- **PSC (Pediatric Symptom Checklist)** — Broad psychosocial screening tool for children

### 🎮 Cognitive Development Games
- **Memory Cards** — Flip-and-match memory game to strengthen recall
- **Pattern Matching** — Visual pattern recognition challenges
- **Number Sequences** — Logical reasoning and numerical aptitude exercises

### 📊 Dashboard & Mood Tracking
A visual dashboard with mood history charts, weekly trends, activity summaries, and progress indicators — giving parents and caregivers actionable insights at a glance.

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
| **Fonts** | Nunito & Nunito Sans (Google Fonts) |
| **Analytics** | Vercel Analytics |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
Mindful-Buddy-main/
├── app/
│   ├── (app)/                  # App route group
│   │   ├── assessments/        # M-CHAT & PSC screening tools
│   │   ├── chat/               # AI chatbot interface
│   │   ├── dashboard/          # Mood tracking & analytics
│   │   ├── games/              # Cognitive development games
│   │   ├── messages/           # Messaging system
│   │   ├── resources/          # Educational resources
│   │   └── settings/           # User preferences
│   ├── api/                    # Backend API routes
│   │   ├── assessments/        # Assessment endpoints
│   │   ├── conversational-agent/ # AI agent API
│   │   ├── development-screening/ # Screening endpoints
│   │   ├── feedback/           # User feedback
│   │   ├── games/              # Game data endpoints
│   │   ├── iq-tests/           # IQ test endpoints
│   │   ├── mood/               # Mood tracking API
│   │   ├── profiles/           # User profiles
│   │   └── progress/           # Progress tracking
│   ├── globals.css             # Global styles
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
git clone https://github.com/divy151005/Mindful-Buddy.git
cd Mindful-Buddy

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
- **Pediatricians & Counselors** — Use standardized screening tools (M-CHAT, PSC) for early identification of developmental concerns.
- **Educators** — Leverage cognitive games to support classroom learning and child development.
- **Children** — A safe, friendly space to talk about feelings and play brain-boosting games.

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
