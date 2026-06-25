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

The Dasi Games redesigned website uses a highly premium, cohesive, and accessible dark theme built in the perceptually uniform **`oklch()`** color space. This guarantees uniform brightness and contrast across all elements.

### Design Token Architecture & Color Palette
All layout blocks map to a strict three-tiered token structure:

1. **Canvas & Layout Backdrops (Primitive & Semantic Base)**
   - **Carbon Black (`#181818` / `oklch(0.209 0 3.2)`)**: The deepest canvas layer. Minimizes eye fatigue and makes game artwork pop.
   - **Carbon Black 2 (`#1e1e1e` / `oklch(0.235 0 3.2)`)**: Secondary background layer. Used for headers, footers, and structural offsets.

2. **Hierarchical Surfaces & Containers**
   - **Graphite (`#2d2d2d` / `oklch(0.2972 0 3.2)`)**: Prominent primary container and surface color (e.g., game cards, career accordion headers). Establishes structural weight and presence.
   - **Graphite Light (`#3d3d3d` / `oklch(0.36 0 3.2)`)**: Secondary/elevated surface for hover states, nested editor blocks, and borders.

3. **High-Contrast Typography**
   - **Bright Snow (`#f9fafc` / `oklch(0.9849 0.0029 264.6)`)**: Primary text and main headings. Achieves an outstanding 16.7:1 contrast ratio against Carbon Black.
   - **Alabaster Grey (`#d0d6dc` / `oklch(0.8732 0.0105 248.0)`)**: Muted copy, secondary paragraphs, metadata, and platform icon outlines.

4. **Dynamic Gaming Accents**
   - **Electric Violet (`#a855f7` / `oklch(0.6268 0.2325 303.9)`)**: The primary recommended brand accent, evoking high energy and console RPG themes. Mapped as `accent-primary` for CTAs and highlighted titles.
   - **Electric Violet Light (`#c084fc` / `oklch(0.7217 0.1767 305.5)`)**: Primary hover accent and readable violet link text on dark.
   - **Neon Teal (`#06b6d4` / `oklch(0.7148 0.1257 215.2)`)**: Secondary active accent, evoking cyber tech, precision, and focus states.
   - **Cyber Green (`#10b981` / `oklch(0.6959 0.1491 162.5)`)**: Utility success accent, representing active hiring indicators, badges, and health-bar aesthetics.

### Primary Gradients & Shadows
- **Cinematic Void Gradient**: Linear transition from Carbon Black (`#181818`) to Carbon Black 2 (`#1e1e1e`) to guide scrolling depth.
- **Accented Glow Shadows**: Drop-shadows generated dynamically using oklch color mixing for a premium neon-glow effect on active cards:
  ```css
  box-shadow: 0 16px 48px -12px color-mix(in oklch, var(--color-accent-primary) 20%, transparent);
  ```

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
