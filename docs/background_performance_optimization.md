# Background Performance Analysis & Optimization Plan

This document outlines the performance analysis of the scattered vector background implemented at `/sandbox/background` and provides step-by-step instructions and code templates to optimize scrolling performance when needed.

---

## 1. Current Architecture & Performance Bottleneck

The background is built using a highly optimal asset-free vector approach, but scrolling can introduce overhead on certain devices.

### 1.1 The Architecture
* **Grid Backdrop**: Pure CSS `linear-gradient` repeating background. **(Zero network overhead, GPU accelerated, extremely optimal)**.
* **Icons**: 23 inline `<svg>` elements scattered down the scroll height. **(Zero HTTP request overhead, instant rendering, optimal)**.
* **Animations**: Dual-layered:
  1. *Micro-Floating*: Compositor-thread CSS keyframe animations. **(Very optimal)**.
  2. *Scroll Parallax*: JavaScript-based **GSAP ScrollTrigger** loops. **(Performance bottleneck on scroll)**.

### 1.2 The Bottleneck
When the user scrolls, the GSAP ScrollTrigger script listens to the browser's scroll events. On every scroll tick, the browser is forced to:
1. Run JavaScript calculations on the **Main Thread** for 23 independent triggers.
2. Recalculate layout/paint offsets.
3. Apply inline `transform: translateY(...)` style updates to 23 DOM elements.

On high-refresh-rate screens or mobile devices, this main-thread scroll-handling can cause layout thrashing, resulting in minor frame drops (jank) and increased CPU usage.

---

## 2. Step-by-Step Optimization Methods

To achieve a locked, silky-smooth 60+ FPS scrolling experience, two non-breaking optimizations are outlined below.

### Method 1: Compositor-Thread CSS Scroll-Driven Animations

This method shifts 100% of the scroll-linked calculations from the JavaScript main thread to the browser's **Compositor Thread** using the modern CSS Scroll-Driven Animations specification. 

#### Step 1: Update the CSS Module
Add the following CSS rules to [BackgroundGrid.module.css](file:///c:/Users/Mzia/Desktop/www/dasi/src/components/BackgroundGrid.module.css) inside the `@supports` block. This binds the vertical translation directly to the root scroll container.

```css
/* Compositor-thread scroll-driven animations */
@supports (animation-timeline: scroll()) {
  .parallaxWrapper {
    /* Bind the translation animation to the page's vertical scroll timeline */
    animation: parallaxScroll linear;
    animation-timeline: scroll(root);
    animation-range: entry 0% exit 100%;
  }

  @keyframes parallaxScroll {
    from {
      transform: translateY(-45px);
    }
    to {
      transform: translateY(45px);
    }
  }
}
```

#### Step 2: Update the React Component
Modify [BackgroundGrid.tsx](file:///c:/Users/Mzia/Desktop/www/dasi/src/components/BackgroundGrid.tsx) to check if the browser supports native CSS scroll timelines before initializing GSAP. This prevents the JavaScript scroll triggers from running on modern browsers, keeping GSAP strictly as a fallback for legacy browsers.

```typescript
useEffect(() => {
  // Check if the browser natively supports CSS scroll timelines
  const supportsCSSScroll = typeof window !== 'undefined' && 
    CSS.supports('animation-timeline', 'scroll()');

  // If natively supported, bypass GSAP scroll tracking entirely to save CPU
  if (supportsCSSScroll) return;

  const ctx = gsap.context(() => {
    const items = gsap.utils.toArray<HTMLElement>('.parallax-item');
    items.forEach((item) => {
      gsap.fromTo(
        item,
        { y: -40 },
        {
          y: 40,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        }
      );
    });
  }, containerRef);

  return () => ctx.revert();
}, []);
```

---

### Method 2: Responsive Culling (Mobile Optimization)

Rendering 23 moving vector icons on mobile viewports is visually cluttered and causes unnecessary GPU redraw cycles. This method hides or reduces background elements on mobile screens.

#### Step 1: Set Mobile Breakpoints
Append the following media queries to [BackgroundGrid.module.css](file:///c:/Users/Mzia/Desktop/www/dasi/src/components/BackgroundGrid.module.css) to hide or scale down the background elements on smaller screens:

```css
/* Mobile viewports: Hide background decorations to maximize performance and legibility */
@media (max-width: 768px) {
  .parallaxWrapper {
    display: none !important;
  }
}
```

#### Step 2 (Optional): Selective Rendering in React
Alternatively, if you want to keep a subset of icons on mobile instead of hiding them all, you can filter the `backgroundIcons` array based on viewport width, or add a `mobileOnly` boolean flag to specific coordinates.

---

## 3. How to Verify Performance Gains

When these optimizations are applied, you can verify the rendering improvements using Chrome DevTools:

1. **Open DevTools** (`F12` or `Ctrl+Shift+I`).
2. **Open Command Menu** (`Ctrl+Shift+P`) and type `Show Rendering`.
3. Check the **Frame Rendering Stats** (FPS Meter) box.
4. Record a profile in the **Performance Panel** while scrolling:
   - *Before Optimization*: You will see frequent yellow/orange blocks indicating main-thread CPU activity tied to scroll events.
   - *After Optimization*: The main-thread activity will drop to near-zero, and the FPS graph will remain flat green, signifying hardware-accelerated compositor rendering.
