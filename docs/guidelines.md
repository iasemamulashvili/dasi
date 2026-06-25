# Dasi Games Website Redesign - Animation & Coding Guidelines

This guide contains essential coding standards and animation principles to keep the codebase clean, performant, and bug-free. Future building agents **must** read and follow these directives.

---

## 1. GSAP & Next.js Lifecycle Guidelines

Next.js uses React, which has a strict mounting/unmounting behavior (especially in React 18 StrictMode where components double-render). Standard GSAP timelines can result in memory leaks, duplicated event listeners, or animation glitches if not properly cleaned up.

### The GSAP Context Pattern
Always use `gsap.context()` inside a `useEffect` hook to scope all animations and ensure auto-cleanup.

```tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function MyComponent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Create a GSAP Context bound to the container ref
    const ctx = gsap.context(() => {
      
      // Target elements relative to containerRef using class names
      gsap.to('.animate-me', {
        x: 100,
        scrollTrigger: {
          trigger: '.trigger-el',
          start: 'top center',
          scrub: true,
        }
      });

    }, containerRef); // <- scope container

    // 2. Clean up context on unmount to revert all changes/ScrollTriggers
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <div className="trigger-el">Scroll trigger point</div>
      <div className="animate-me">I am animated!</div>
    </div>
  );
}
```

### Performance Optimization for Animations
- **CSS Transitions vs GSAP**: Do not combine CSS transitions with GSAP on the same properties (e.g. `transition: all 0.3s` in CSS while animating `transform`/`opacity` in GSAP). This causes visual stuttering and high CPU utilization.
- **Hardware Acceleration**: Animate `x`, `y`, `scale`, `rotation`, and `opacity`. Avoid animating layout properties like `width`, `height`, `top`, or `left` unless strictly necessary (e.g., career accordion smooth height transition). When possible, use GSAP's `y` instead of `top` to trigger GPU acceleration.
- **Will-Change**: Apply `will-change: transform` or `will-change: opacity` on elements that undergo high-frequency transitions (e.g., 3D tilting cards or parallax layers) to let the browser optimize drawing passes.

---

## 2. Tailwind CSS Styling & Design Tokens

Avoid ad-hoc styling. All color mappings must strictly follow the three-tiered design token hierarchy (primitive, semantic, component overrides) and utilize modern CSS color functions (`oklch()`, `color-mix()`, and `light-dark()`) to maintain theme robustness.

### CSS Custom Properties & Dynamic Mixing
Configure the central design tokens in your global CSS stylesheet using `oklch` for perceptual uniformity and `color-mix` for dynamic hover/active tinting:

```css
:root {
  color-scheme: dark;

  /* Primitive Tokens */
  --color-primitive-carbon-black: oklch(0.209 0 3.2);       /* #181818 */
  --color-primitive-carbon-black-2: oklch(0.235 0 3.2);     /* #1e1e1e */
  --color-primitive-graphite: oklch(0.2972 0 3.2);          /* #2d2d2d */
  --color-primitive-graphite-light: oklch(0.36 0 3.2);      /* #3d3d3d */
  --color-primitive-alabaster-grey: oklch(0.8732 0.0105 248);/* #d0d6dc */
  --color-primitive-bright-snow: oklch(0.9849 0.0029 264.6); /* #f9fafc */

  /* Accents */
  --color-primitive-violet: oklch(0.6268 0.2325 303.9);      /* #a855f7 */
  --color-primitive-violet-light: oklch(0.7217 0.1767 305.5);/* #c084fc */
  --color-primitive-teal: oklch(0.7148 0.1257 215.2);        /* #06b6d4 */
  --color-primitive-teal-light: oklch(0.7971 0.1339 211.5);  /* #22d3ee */
  --color-primitive-green: oklch(0.6959 0.1491 162.5);       /* #10b981 */

  /* Semantic Mappings */
  --color-bg-base: var(--color-primitive-carbon-black);
  --color-bg-alternate: var(--color-primitive-carbon-black-2);
  
  --color-surface-primary: var(--color-primitive-graphite);
  --color-surface-secondary: var(--color-primitive-graphite-light);

  --color-text-primary: var(--color-primitive-bright-snow);
  --color-text-muted: var(--color-primitive-alabaster-grey);

  --color-accent-primary: var(--color-primitive-violet);
  --color-accent-hover: var(--color-primitive-violet-light);
  --color-accent-secondary: var(--color-primitive-teal);
  --color-accent-secondary-hover: var(--color-primitive-teal-light);
  
  --color-scrollbar-thumb: var(--color-surface-secondary);
  --color-scrollbar-track: var(--color-bg-base);
}
```

### Tailwind Config Integration
Map these semantic CSS variables inside `tailwind.config.ts` so they are accessible via utility classes while keeping values centralized and fully dynamic:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dasi: {
          bg: {
            DEFAULT: 'var(--color-bg-base)',
            alt: 'var(--color-bg-alternate)',
          },
          surface: {
            primary: 'var(--color-surface-primary)',
            secondary: 'var(--color-surface-secondary)',
          },
          text: {
            primary: 'var(--color-text-primary)',
            muted: 'var(--color-text-muted)',
          },
          accent: {
            primary: 'var(--color-accent-primary)',
            hover: 'var(--color-accent-hover)',
            secondary: 'var(--color-accent-secondary)',
            'secondary-hover': 'var(--color-accent-secondary-hover)',
            success: 'var(--color-primitive-green)',
          }
        }
      }
    }
  },
  plugins: [],
};
export default config;
```

---

## 3. SEO & Semantic HTML
Ensure the website remains search-engine friendly despite its highly animated structure:
- **Title & Descriptions**: Use the Next.js `metadata` object in `layout.tsx` or `page.tsx`.
- **Semantic Tags**: Use `<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, and `<footer>` rather than generic `<div>` stacks.
- **Interactive Element Accessibility**: All buttons/links must have clear `aria-label` properties, and form inputs must have corresponding `<label>` descriptions or accessible tags.

---

## 4. Mobile Responsiveness & Fallbacks
Smooth mouse-based interactive triggers (such as magnetic buttons, 3D card tilt, cursor-collect letters) do not work on touchscreens and can cause broken UI layouts.
- **Media Queries**: Use Tailwind's responsive prefixes (`md:`, `lg:`) to disable complex hover/parallax animations on mobile viewports (widths < 768px).
- **Mobile Fallback**: Provide simple, attractive static vertical grids or touch-scroll carousels for mobile devices.
