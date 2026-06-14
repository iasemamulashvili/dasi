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

## 2. Tailwind CSS Styling & Custom Utilities

Avoid ad-hoc styles. Instead, configure custom colors in `tailwind.config.ts` and use utility classes.

### Token Mapping
In your `tailwind.config.ts`, integrate the cool-slate color palette:
```typescript
theme: {
  extend: {
    colors: {
      dasi: {
        bg: '#070e1d',       // base background
        surface: '#0a1429',  // cards and headers
        ink: '#101623',      // secondary container
        steel: '#667b99',    // primary copy/text
        accent: '#62909d',   // active teal/cyan
        light: '#ebf0fa',    // title headers
      }
    }
  }
}
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
