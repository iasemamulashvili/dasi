# Project Agent Rules

This document defines the core principles, behavior, and design standards that all AI agents must follow when contributing to the Dasi Games project.

## Mandatory Skill Compliance

All future agents must respect, read, and apply the guidelines defined in the custom project skills. When editing or creating styles, layouts, templates, or interaction patterns, ensure complete alignment with these skills:

1. **[Web Design and Modern Layouts](file:///c:/Users/Mzia/Desktop/www/dasi/.agents/skills/web-design/SKILL.md)**
   - Always prioritize modern CSS layout mechanisms: Flexbox for one-dimensional components, CSS Grid for two-dimensional structures, and `subgrid` for alignment within nested layouts.
   - Use container queries (`@container`) for self-contained UI components so they scale and adapt based on their container's width, not the viewport.
   - Employ fluid scaling with `clamp()` and container-relative units (`cqw`, etc.) rather than rigid breakpoint-based media queries.
   - Utilize advanced typography features like `text-wrap: balance` for headings, `text-wrap: pretty` for paragraphs, and line height trimming with `text-box-trim` for perfect alignment.

2. **[UI/UX Design and Interaction](file:///c:/Users/Mzia/Desktop/www/dasi/.agents/skills/ui-ux-design/SKILL.md)**
   - Maintain WCAG 2.1 AA level compliance, ensuring contrast ratios of at least 4.5:1 for standard text and 3:1 for large text.
   - Implement rigorous keyboard accessibility and focus management: never hide outlines without high-visibility `:focus-visible` styles, keep focus loops intact, and use `inert` for background elements during modal states.
   - Sync programmatic accessibility states (`aria-invalid="true"`) with visual `:user-invalid` states to provide screen reader feedback only after user interaction.
   - Build smooth, micro-animated interfaces utilizing `@starting-style` for top-layer entrance/exit transitions.
   - Style scrollbars natively using standard `scrollbar-color` and `scrollbar-width` properties, adapting them dynamically to contrast and theme preferences.

3. **[Branding, Colors, and Theme Architecture](file:///c:/Users/Mzia/Desktop/www/dasi/.agents/skills/branding-and-colors/SKILL.md)**
   - Maintain a robust dark theme architecture using the standard `color-scheme` property to align native browser controls and scrollbars.
   - Use the `light-dark()` CSS function to define adaptive variables, minimizing the need for repetitive media queries.
   - Define color palettes in the perceptually uniform `oklch()` color space to guarantee equal brightness perception across hues.
   - Use `color-mix()` in `oklch` to dynamically generate tints, shades, and hover/active colors rather than hardcoding static HEX/RGB values.
   - Strictly follow the three-tiered design token hierarchy: primitive tokens, semantic tokens, and component overrides, respecting semantic roles (backgrounds, surfaces, borders, text, actions).

---

## Code Quality and Preservation

- **Do Not Bloat**: Always use native browser capabilities and clean CSS features before reaching for heavy JavaScript libraries or bloated polyfills.
- **Maintain Comments**: Preserve all existing comments, documentation, and licensing notices in unmodified sections of code.
- **Run Validation**: Run appropriate linters and test suites to verify compliance and correctness after making changes.
