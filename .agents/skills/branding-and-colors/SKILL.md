---
name: branding-and-colors
description: Guidelines on dark theme architecture, modern color spaces (oklch, color-mix), design tokens, and semantic color roles.
---

# Branding, Color Spaces, and Theme Architecture

This skill defines the standards for implementing brand identity, theme configurations, and color spaces. Follow these guidelines to maintain a cohesive visual identity, robust dark theme architecture, and modern, flexible color utilities.

## 1. Modern Color Spaces (`oklch` & `color-mix`)

### Perceptually Uniform Color with `oklch`
- Use the `oklch()` color space for defining design tokens. Unlike `hsl()` or `rgb()`, `oklch` matches human eye perception, meaning colors with the same lightness value will actually look equally bright to the human eye.
- **Format**: `oklch(L C H)` where:
  - `L` represents Lightness (0% to 100% or 0 to 1).
  - `C` represents Chroma (color purity/saturation, 0 to 0.4).
  - `H` represents Hue (color angle, 0 to 360).

```css
:root {
  /* Brand colors in oklch */
  --color-brand-primary: oklch(0.6 0.25 250); /* Blue */
  --color-brand-accent: oklch(0.65 0.3 320);  /* Magenta */
}
```

### Dynamic Color Mixing with `color-mix`
- Use `color-mix()` to create shades, tints, and semi-transparent variants dynamically, rather than hardcoding dozens of separate color values. This keeps your stylesheet clean and maintainable.

```css
.card {
  /* Mix 12% of the brand primary color with transparent to create a subtle background tint */
  background-color: color-mix(in oklch, var(--color-brand-primary) 12%, transparent);
  
  /* Mix 20% of white or black to create hover states dynamically */
  border-color: color-mix(in oklch, var(--color-brand-primary) 80%, black);
}
```

---

## 2. Dark Theme Architecture

### Standardizing Theme Architecture
- Support both system-level user preferences (`prefers-color-scheme`) and class-based theme overrides (e.g. `.dark` class on the `<html>` or `<body>` element).
- Use the standard `color-scheme` CSS property to let the browser know which theme is active. This automatically adapts native scrollbars, form controls, and browser UI elements.

```css
:root {
  color-scheme: light dark;
}
```

### The `light-dark()` Function
- Use the modern `light-dark(<light-value>, <dark-value>)` CSS function to define colors that automatically react to the active color scheme without duplicating media queries.
- *Note*: For `light-dark()` to work, the container or root must have `color-scheme: light` or `color-scheme: dark` set.

```css
:root {
  --color-bg: light-dark(oklch(0.98 0.01 0), oklch(0.15 0.02 240));
  --color-text: light-dark(oklch(0.2 0.01 0), oklch(0.95 0.01 0));
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
}
```

---

## 3. Design Tokens and Semantic Color Roles

### Design Token Architecture
- Organize design tokens into three layers:
  1. **Global Tokens (Primitive)**: Context-free values (e.g., `--color-blue-500: oklch(0.6 0.25 250)`).
  2. **Semantic Tokens (Alias)**: Purpose-driven tokens referring to primitives (e.g., `--color-interactive-primary: var(--color-blue-500)`).
  3. **Component Tokens**: Component-specific overrides mapped to semantic tokens.

### Semantic Color Roles
- Define color tokens according to their semantic purpose, ensuring consistency across components. Use these standard roles:
  - **Backgrounds**: Deep canvas, page background, or panel layouts.
  - **Surfaces**: Cards, modals, dialogs, and headers.
  - **Borders/Dividers**: Boundaries and separating lines.
  - **Text Roles**: Primary (titles/body), secondary (meta-data/labels), tertiary (disabled/placeholder).
  - **Interactive States**: Default, hover, active, focus, disabled.
  - **Accents**: Brand callouts, highlights, success, warning, error states.

```css
/* Example: Semantic Token Mapping */
:root {
  /* Primitive Tokens */
  --color-slate-900: oklch(0.12 0.015 256);
  --color-slate-800: oklch(0.18 0.02 256);
  --color-slate-100: oklch(0.96 0.01 256);
  --color-indigo-500: oklch(0.55 0.22 264);
  --color-indigo-600: oklch(0.48 0.22 264);

  /* Semantic Tokens (Dark Theme Focus) */
  --color-bg-base: var(--color-slate-900);
  --color-surface-base: var(--color-slate-800);
  --color-border-subtle: color-mix(in oklch, var(--color-slate-100) 10%, transparent);
  
  --color-text-primary: var(--color-slate-100);
  --color-text-secondary: color-mix(in oklch, var(--color-slate-100) 70%, transparent);

  --color-action-default: var(--color-indigo-500);
  --color-action-hover: var(--color-indigo-600);
}
```
