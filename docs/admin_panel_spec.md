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

The Admin Panel should maintain a premium aesthetic similar to the main site, but focus on utility:
- **Style**: Sleek dark console layout (`dasi-bg` backdrop, glassmorphic panel blocks).
- **Interactive Tables/Cards**: Easy grid view of current games with visual indicators (e.g., green dot for "Live", grey for "Hidden").
- **Asset Uploaders**: Fields to input image URLs, video URLs, or drag-and-drop file inputs (stored locally in `/public/uploads` or external storage).
- **Responsive Controls**: Fully functional on desktop and tablet viewports to allow quick changes on-the-go.
