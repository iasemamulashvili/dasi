# Dasi Games Website Redesign - State Management & Status

This document tracks the current progress, file structure, and implementation status of the project.

---

## 1. Project Directory Structure
Once set up, the project folder structure should resemble:
```
dasi/
├── docs/                      # Markdown documentation for building agents
│   ├── project_description.md
│   ├── guidelines.md
│   ├── games_database.md
│   ├── admin_panel_spec.md
│   └── state_management.md
├── public/                    # Static assets
│   ├── images/                # Game art, icons, logo
│   └── videos/                # Looping gameplay videos (MP4)
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Immersive landing page
│   │   ├── admin/             # Admin panel folder
│   │   │   ├── login/         # Admin Login
│   │   │   └── dashboard/     # Admin Dashboard
│   │   └── api/               # API endpoints
│   ├── components/            # Reusable UI parts
│   │   ├── Header.tsx
│   │   ├── Hero.tsx           # Parallax & text effects
│   │   ├── GamesShowcase.tsx  # Horizontal scroll showcase
│   │   ├── About.tsx          # Stat counters
│   │   ├── Careers.tsx        # Careers accordion
│   │   ├── ContactForm.tsx
│   │   └── Footer.tsx
│   ├── data/                  # Static / Local database files
│   │   ├── games.json
│   │   └── jobs.json
│   ├── hooks/                 # Custom react hooks (GSAP, window resize, etc.)
│   └── utils/                 # Data adapters & helpers
├── tailwind.config.ts         # Tailwind configuration
├── package.json
└── tsconfig.json
```

---

## 2. Progress Tracker

| Component / Task | Status | Notes |
|---|---|---|
| **Documentation & Planning** | Completed | All doc files created in `docs/` |
| **Next.js & Env Setup** | Planned | Need to run Vite/Next.js initialization |
| **Design System & Tailwind Config** | Planned | Add custom colors and gradients |
| **Global Header & Navigation** | Planned | Core layouts and transitions |
| **Hero Parallax & Gamified Text** | Planned | Collect/dump letters interaction |
| **Games Showcase (Horizontal Scroll)** | Planned | GSAP horizontal lock & card tilt |
| **About Us & Counters** | Planned | Values interpolating on visible |
| **Careers Accordion** | Planned | Height transition without jumps |
| **Contact Us Form** | Planned | File uploads and inputs |
| **Footer & badging** | Planned | Store badge routing |
| **Admin Login & Console** | Planned | Mock db adapter, tables, forms |
| **Optimization & Verification** | Planned | GSAP cleanup audit, loading tests |
