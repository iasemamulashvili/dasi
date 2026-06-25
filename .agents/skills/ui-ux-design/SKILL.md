---
name: ui-ux-design
description: Guidelines on accessibility (WCAG compliance, error announcements, focus), interactive states, micro-animations, and scrollbar styling.
---

# UI/UX Design and Interaction Guidelines

This skill defines the standards for user experience, accessibility, and interactive feel. Follow these guidelines to ensure the application is accessible, responsive, and delightful to interact with.

## 1. Accessibility (a11y)

### WCAG Compliance & Contrast
- Maintain WCAG 2.1 AA level compliance (aim for AAA where possible).
- Regular text must have a contrast ratio of at least 4.5:1 against its background. Large text (18pt/24px or bold 14pt/18.66px and above) must have a contrast ratio of at least 3:1.
- Use native HTML elements (`<button>`, `<a>`, `<input>`, `<dialog>`) to preserve semantic meaning and keyboard behaviors out of the box.

### Focus Management
- Never remove focus outlines without providing a visible, custom `:focus-visible` alternative.
- Ensure focus order is logical and follows the visual layout.
- Use `inert` to temporarily disable background content when modal elements (like dialogs or drawers) are active, preventing screen readers and keyboard users from interacting with background elements.

```css
/* Focus-visible styling */
button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

### Accessible Error Announcements
- Synchronize programmatic accessibility states (`aria-invalid="true"`) with the visual `:user-invalid` state.
- Ensure screen reader users receive error feedback only after they have interacted with the input field, mirroring the visual experience.

```html
<!-- Example of synchronizing input states -->
<div class="form-group">
  <label for="email-field">Email Address</label>
  <input type="email" id="email-field" required aria-describedby="email-error">
  <span id="email-error" class="error-message" aria-live="polite">Please enter a valid email.</span>
</div>
```

```css
/* Display error message only when input is invalid after interaction */
.error-message {
  display: none;
}

input:user-invalid ~ .error-message {
  display: block;
}
```

---

## 2. Interactive States and Micro-Animations

### Interactive States
- Provide clear visual feedback for all interaction stages: `:hover`, `:focus-visible`, and `:active`.
- Use transitions to animate changes in background color, borders, and transforms.

```css
.interactive-element {
  transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive-element:hover {
  background-color: var(--color-surface-hover);
}

.interactive-element:active {
  transform: scale(0.98);
}
```

### Modern Entrance and Exit Animations
- Use `@starting-style` to define the initial visual state of an element before it is rendered or when its `display` property changes. This allows smooth transitions for elements entering/exiting the top layer (like dialogs and popovers) or elements being dynamically added to the DOM.

```css
/* Popover entrance animation */
[popover]:popover-open {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Starting style when popover is first opened */
@starting-style {
  [popover]:popover-open {
    opacity: 0;
    transform: translateY(10px);
  }
}
```

---

## 3. Custom Scrollbar Styling

### Cross-Browser Scrollbar Customization
- Use standard properties `scrollbar-color` and `scrollbar-width` instead of legacy non-standard `-webkit-scrollbar` pseudo-elements. This ensures modern, standards-compliant styling.

```css
.scrollable-container {
  scrollbar-width: thin;
  scrollbar-color: var(--color-scroll-thumb) var(--color-scroll-track);
}
```

### Adaptive Scrollbars
- Ensure scrollbar colors adapt to the user's operating system preferences for light/dark themes and contrast requirements using media queries.

```css
@media (prefers-color-scheme: dark) {
  .scrollable-container {
    --color-scroll-thumb: var(--color-neutral-700);
    --color-scroll-track: var(--color-neutral-900);
  }
}

@media (prefers-contrast: more) {
  .scrollable-container {
    scrollbar-width: auto;
    --color-scroll-thumb: var(--color-neutral-900);
    --color-scroll-track: var(--color-neutral-100);
  }
}
```
