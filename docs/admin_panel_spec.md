# Dasi Games Website Redesign - Admin Control Panel Specification

This document defines the functional and architectural specifications for the **Admin Control Panel**. This panel allows the Dasi Games team to edit the website content dynamically without changing source code files directly.

---

## 1. Functional Requirements

The Admin Dashboard must support:
1. **Featured Game Highlight**:
   - Change which game is featured in the main landing sections (e.g. Hero banner and primary section below hero).
   - Change the featured game title, descriptions, background banners, and download links.
2. **Game Catalog Management**:
   - Add new game cards to the list.
   - Edit existing game entries (name, description, logo asset, links to App Store/Play Store/Poki, and hover gameplay video source).
   - Delete outdated games or toggle visibility.
3. **Careers / Jobs Board Management**:
   - Create new job postings (title, department, requirements, description).
   - Edit current jobs.
   - Delete filled job listings.
4. **Form Submissions Archive (Optional / Phase 2)**:
   - View contact messages sent by users.
   - View career applications and download resumes.
5. **Security/Authentication**:
   - Simple, secure login page using credentials (username + password).
   - Session storage or secure JWT cookies to protect admin routes (`/admin/*`).

---

## 2. Technical Architecture & Database Design

To avoid complex server and external database setup (keeping the project self-contained and easy to deploy as a portfolio piece):

### Local JSON Files with Server Actions
- All games and careers data will reside in two files inside the project under `src/data/games.json` and `src/data/jobs.json`.
- Next.js **Server Actions** or **API Routes** (`/api/admin/games` and `/api/admin/jobs`) will handle reading and writing to these JSON files.
- **Serverless Fallback**: Since serverless hosting platforms like Vercel have a read-only filesystem at runtime, the API must support:
  1. Reading from the local static JSON files by default.
  2. Saving updates to **Browser LocalStorage** (for demo/portfolio purposes on static/serverless deployments) OR utilizing a simple environment variable toggle to hook into a database like **Firebase/Supabase** or **Vercel KV**.
  - **Proposed Implementation**: Implement a database adapter pattern:
    ```typescript
    interface DatabaseAdapter {
      getGames(): Promise<Game[]>;
      saveGame(game: Game): Promise<void>;
      // ...
    }
    ```
    - **LocalFileAdapter**: Reads/writes to `src/data/games.json` (used in local development / VPS host).
    - **LocalStorageAdapter**: Reads/writes to client-side storage (used when running as a serverless portfolio demo).
    - **SupabaseAdapter (Optional)**: Connects to a free SQL database.

---

## 3. UI/UX Design Guidelines

The Admin Panel must maintain a premium, utility-first dark console aesthetic matching the main site, built on the refined color palette:

### Theme & Colors
- **Backdrop Canvas**: Carbon Black (`#181818` / `oklch(0.209 0 3.2)`) as the global layout background.
- **Section Headers & Tables**: Carbon Black 2 (`#1e1e1e` / `oklch(0.235 0 3.2)`) for sidebars and primary layout containers.
- **Form Panels & Cards**: Graphite (`#2d2d2d` / `oklch(0.2972 0 3.2)`) as the primary surface for editor blocks, control panels, and modals.
- **Active Editor Fields**: Graphite Light (`#3d3d3d` / `oklch(0.36 0 3.2)`) for nested editor groups, text area backgrounds, and hover highlights.
- **Typography**: Primary titles in Bright Snow (`#f9fafc` / `oklch(0.9849 0.0029 264.6)`); labels and secondary copy in Alabaster Grey (`#d0d6dc` / `oklch(0.8732 0.0105 248.0)`).
- **Accents & Indicators**: 
  - *Active Buttons/Interactive Borders*: Electric Violet (`#a855f7` / `oklch(0.6268 0.2325 303.9)`) with Electric Violet Light (`#c084fc` / `oklch(0.7217 0.1767 305.5)`) for hover states.
  - *Focus Rings / Selection*: Neon Teal (`#06b6d4` / `oklch(0.7148 0.1257 215.2)`) for high-contrast focus rings.
  - *Status Badges*: Cyber Green (`#10b981` / `oklch(0.6959 0.1491 162.5)`) for "Live" toggles and success messages; Alabaster Grey for "Hidden/Draft" status.

### Interaction & Accessibility Guidelines
- **Responsive Layout**: Utilize CSS Grid for the dashboard and Flexbox for sidebars, adapting smoothly across viewports using fluid scaling (`clamp()`) and container queries (`@container`).
- **Interactive Tables & Form Fields**:
  - Focus outlines must use high-visibility outlines: `outline: 2px solid var(--color-accent-secondary)` (Neon Teal) with `outline-offset: 2px`.
  - Sync programmatic accessibility states (`aria-invalid="true"`) with visual `:user-invalid` styling on form fields to ensure screen reader feedback is delayed until user interaction.
- **Interactive Animations**: Accompany all interactive transitions (e.g., toggling a game's visibility or expanding a card) with subtle micro-animations (e.g., using `@starting-style` for modals, and scaling active clicks to `0.98`).
- **Scrollbar Styling**: Style scrollbars natively:
  ```css
  .admin-panel {
    scrollbar-width: thin;
    scrollbar-color: var(--color-scrollbar-thumb) var(--color-scrollbar-track);
  }
  ```

