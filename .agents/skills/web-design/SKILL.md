---
name: web-design
description: Guidelines on modern CSS layouts (Flexbox, Grid, subgrid, container queries), responsive design, fluid scaling, and advanced typography.
---

# Modern Web Design and Layout Guidelines

This skill defines the standards for implementing modern, high-performance, and responsive layouts. Follow these guidelines to ensure structural integrity, fluid adaptability, and clean typography across all pages.

## 1. Modern Layout Systems

### Flexbox vs. CSS Grid
- **Flexbox**: Use for one-dimensional layouts (either a row or a column). Ideal for navigation bars, alignment, and simple component stacks.
- **CSS Grid**: Use for two-dimensional layouts (both rows and columns). Ideal for page templates, dashboard grids, card decks, and complex galleries.

```css
/* Example: Premium Grid Layout */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-md);
}
```

### CSS Subgrid
- Use `grid-template-rows: subgrid` or `grid-template-columns: subgrid` to align descendant components perfectly within parent grid tracks. This prevents misalignments in card heights, headings, or call-to-action buttons.

```css
/* Card list container */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-auto-rows: auto;
}

/* Individual card participating in parent alignment */
.card-item {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid;
}
```

### Container Queries
- Use container queries (`@container`) instead of media queries (`@media`) for self-contained components. This allows components to adapt their layout based on the width of their parent container rather than the viewport.
- Declare container contexts using `container-type: inline-size` on the parent element.

```css
/* Container declaration */
.sidebar-layout {
  container-type: inline-size;
  container-name: sidebar-card;
}

/* Component response */
@container sidebar-card (max-width: 400px) {
  .card-inner {
    flex-direction: column;
  }
}
```

---

## 2. Responsive Design and Fluid Scaling

### Fluid Typography and Spacing
- Avoid rigid media query breakpoints for font sizes and margins. Use fluid scaling with the `clamp()` function.
- Combine viewport width (`vw`) or container query inline-size (`cqw`) units to scale dimensions smoothly between defined boundaries.

```css
:root {
  /* Fluid font scaling from 16px to 24px */
  --font-fluid-base: clamp(1rem, 0.95rem + 0.25vw, 1.5rem);
  
  /* Fluid spacing from 16px to 32px */
  --space-fluid-md: clamp(1rem, 0.8rem + 1vw, 2rem);
}
```

### Container-Relative Units
- Leverage container-relative units (`cqw`, `cqh`, `cqi`, `cqb`, `cqmin`, `cqmax`) to size typography and padding relative to the component's parent container.

```css
.card-title {
  font-size: clamp(1.2rem, 4cqw, 2rem);
}
```

---

## 3. Advanced Typography

### Line Height Trimming
- Use the modern `text-box-trim` and `text-box-edge` (or the older `text-box` shorthand) to remove default leadings and extra blank space above and below text characters. This ensures precise alignment with adjacent icons, buttons, or border edges.

```css
.trimmed-heading {
  text-box-trim: both;
  text-box-edge: cap alphabetic;
}
```

### Text Wrap Tuning
- **`text-wrap: balance`**: Use for short, multi-line titles, headings, and blockquotes to distribute words evenly across lines, avoiding single-word orphans.
- **`text-wrap: pretty`**: Use for body text paragraphs to prevent orphans at the end of text blocks.

```css
h1, h2, h3 {
  text-wrap: balance;
}

p {
  text-wrap: pretty;
}
```
