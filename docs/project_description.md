# Dasi Games Website Redesign - Project Description

This document describes the redesign project for **Dasi Games**, a game development company based in Tbilisi, Georgia, specializing in mobile games, hybrid arcade RPGs, and tycoon titles.

## Project Vision & Goals
The objective is to elevate the digital identity of Dasi Games to a premium tier. We will transform their static showcase website into an immersive, highly interactive, and cinematic experience characterized by:
- **Spatial Depth & Parallax**: Interconnected layers of game assets.
- **Dynamic Scroll Animations**: Horizontal timelines, reveal effects, and fluid typography.
- **Micro-Interactions**: Magnetic call-to-actions, hover video triggers, and interactive elements.
- **Gamified Landing Page**: Fun and engaging interactive text animations mimicking game mechanics.
- **Admin Control Panel**: Content management functionality allowing the owner to modify featured games, media links, and open jobs without touch-editing code.

---

## Technical Stack & Architecture
The project will use a modern, high-performance web development stack:
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with custom utility classes and tokens from the color palette)
- **Animation**: GSAP (GreenSock Animation Platform) with ScrollTrigger and Observer plugins
- **Icons**: Lucide React
- **Media**: Local or hosting-delivered gameplay preview videos, high-resolution webp/png game cards, and logos.
- **State/Backend**: A self-contained JSON file-based database for game data and career posts, managed via API routes and Server Actions.

---

## Design System & Color Palette
The colors are inspired by the original Dasi Games site and modified for a premium, cool slate-and-navy aesthetic:

### Primary Gradients
- **Midnight Void to Deep Slate**: Mapped from the dark blue/black values to slate blue.
- **Teal / Alice Blue Accents**: Used for active borders, CTAs, and highlight text.

### Color Swatches (Variables in Tailwind config)
- **Deep Blue / Black**:
  - `black-950`: `#070e1d` (Base background)
  - `black-900`: `#0a1429` (Card/Section background)
- **Ink Black**:
  - `ink-950`: `#0b0f19` (Alternative dark background)
  - `ink-900`: `#101623`
- **Cool Steel / Slate Grays**:
  - `steel-500`: `#667b99` (Secondary text)
  - `steel-400`: `#8596ad` (Muted details)
- **Charcoal Blue**:
  - `charcoal-500`: `#607a9f`
- **Alice Blue (Teal Accents)**:
  - `alice-500`: `#62909d`
  - `alice-400`: `#82a6b0`

---

## Key Core Pages & Layout Sections
1. **Global Header**: Logo, Interactive Links (Home, Games, About, Career, Contact, Admin Console), Mobile Navigation.
2. **Hero Section**:
   - Multi-layer spatial parallax utilizing game art assets (foreground characters, background sky/mountains, midground gameplay elements).
   - Letter-by-letter kinetic entrance typography.
   - Gamified "Letter Collector" title effect: hovering over letters detaches/collects them onto the cursor, and moving to the "anchor dump site" slides them back into place.
   - Magnetic "Let's Talk" CTA.
3. **Games Horizontal Showcase**:
   - Scroll-interception carousel pinning the screen and sliding game cards horizontally.
   - 3D tilting cards responding to mouse cursor.
   - Smooth video overlay reveal when hovering over a card.
4. **About Us Section**:
   - Interactive counter blocks ("100+ Games", "Founded 2021", "Based in Tbilisi") that count up as the section enters the viewport.
5. **Career Section**:
   - Custom careers accordion showing job descriptions and dynamic application buttons.
   - Smooth container expansion without visual jumps.
6. **Contact Section**:
   - Full email sending form supporting CV/Resume upload.
7. **Footer**: Sitemap, platforms badges (App Store, Play Store), and social links (LinkedIn, Facebook).
8. **Admin Control Panel**:
   - Secure interface to manage featured games, upload/update video links, add/remove job postings, and adjust contact form recipient details.
