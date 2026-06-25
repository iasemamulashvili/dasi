# Dasi Games Redesign - Games Database Specification

This document details all game titles, app store links, and design expectations for the **Games Showcase Carousel** on the redesigned website.

---

## 1. Game List & Platforms
The original site lists a main game (Crown Quest / Lumber Chopper) and loads other titles dynamically. Below is the complete catalog extracted from the live platform:

| Game Title | Platform Icons Needed | App Store / Link | Play Store / Link | Poki Link / Badge |
|---|---|---|---|---|
| **Crown Quest** | Apple, Google Play | [iOS App Store](https://apps.apple.com/us/app/crown-quest-action-rpg/id6477858164) | [Google Play Store](https://play.google.com/store/apps/details?id=dasi.arpg.crownquest&hl=en) | N/A |
| **Lumber Chopper** | Apple, Google Play | [iOS App Store](https://apps.apple.com/us/app/lumber-chopper-harvest-empire/id6738272884) | [Google Play Store](https://play.google.com/store/apps/details?id=dasi.prs2.lumberchopper&hl=en) | N/A |
| **Hotel Manager** | Apple, Google Play | [iOS App Store](https://apps.apple.com/us/app/hotel-manager-resort-empire/id6748454899) | [Google Play Store](https://play.google.com/store/apps/details?id=dasi.prs3.hotelmanager&hl=en) | N/A |
| **Coworking Manager** | Apple, Google Play, Poki | [iOS App Store](https://apps.apple.com/us/app/coworking-space-manager/id6477774068) | [Google Play Store](https://play.google.com/store/apps/details?id=dasi.prk1.coworking) | [Poki Play Page](https://poki.com/en/g/dasi-office-manager) |
| **Hospital Manager** | Poki | N/A | N/A | [Poki Play Page](https://poki.com/en/g/dasi-hospital-manager) |
| **My Spa Resort** | Poki | N/A | N/A | [Poki Play Page](https://poki.com/en/g/my-spa-manager) |
| **Dream Library** | Poki | N/A | N/A | [Poki Play Page](https://poki.com/en/g/dasi-library-manager) |
| **Bar Rumble** | Apple, Google Play | [iOS App Store](https://apps.apple.com/us/app/bar-rumble/id6497334742) | [Google Play Store](https://play.google.com/store/apps/details?id=com.udogames.barrumble&hl=en) | N/A |
| **Police Officer** | Google Play | N/A | [Google Play Store](https://play.google.com/store/apps/details?id=com.dasigames.policeofficer&hl=en) | N/A |
| **Idle Wars** | Google Play | N/A | [Google Play Store](https://play.google.com/store/apps/details?id=dasi.pi1.idlewars&hl=en) | N/A |
| **Wild West** | Google Play | N/A | [Google Play Store](https://play.google.com/store/apps/details?id=dasi.pr44.wildwest&hl=en) | N/A |
| **Police Commander** | Google Play | N/A | [Google Play Store](https://play.google.com/store/apps/details?id=dasi.pr12.policecommander&hl=en) | N/A |

---

## 2. Interactive Card Layout Specifications

Each game card in the horizontal showcase list must be built as a self-contained component using container queries (`@container`) and styled with the refined dark theme tokens to establish clean spatial depth:

### 1. Default State:
- **Card Surface**: Styled in Graphite (`#2d2d2d` / `oklch(0.2972 0 3.2)`), featuring a high-resolution game artwork background.
- **Card Border**: Subtle separator using dynamic color mixing:
  ```css
  border: 1px solid color-mix(in oklch, var(--color-surface-primary) 30%, transparent);
  ```
- **Overlays & Typography**:
  - A darkened linear gradient overlay (mixing Carbon Black and transparent) covers the background to ensure high-visibility readability.
  - Game titles are styled in Bright Snow (`#f9fafc` / `oklch(0.9849 0.0029 264.6)`) with balanced wrapping (`text-wrap: balance`) and trimmed headings:
    ```css
    text-box-trim: both;
    text-box-edge: cap alphabetic;
    ```
  - Secondary metadata and supported platform badges (Apple, Google Play, Poki icons) are styled in Alabaster Grey (`#d0d6dc` / `oklch(0.8732 0.0105 248.0)`).
- **Accessibility**: Complete keyboard accessibility via `:focus-visible` displaying a Neon Teal (`#06b6d4`) outline offset:
  ```css
  .game-card:focus-visible {
    outline: 2px solid var(--color-accent-secondary);
    outline-offset: 4px;
  }
  ```

### 2. Hover State (Interactive):
- **3D Tilt & Lighting**:
  - The card tracks the mouse cursor, dynamically adjusting CSS 3D transforms (`rotateX` and `rotateY` between `-8deg` and `+8deg`).
  - A radial reflection sheen layer (white mixed in `oklch` at 15% opacity) tracks relative mouse coordinates to simulate realistic, premium material depth.
- **Visual Elevation**:
  - Card background elevates to Graphite Light (`#3d3d3d` / `oklch(0.36 0 3.2)`).
  - Card border transitions to an interactive mix:
    ```css
    border-color: color-mix(in oklch, var(--color-accent-primary) 60%, var(--color-surface-secondary));
    ```
  - A glowing shadows drop-shadow is applied:
    ```css
    box-shadow: 0 16px 48px -12px color-mix(in oklch, var(--color-accent-primary) 25%, transparent);
    ```
- **Video Preview Reveal**: The static artwork scales down and fades out, revealing a looping 10-15s gameplay MP4 preview.
- **Download Badges Overlay**: A slide-up panel containing download buttons (styled in Electric Violet `#a855f7` for primary calls to action) animates smoothly using a custom bezier transition:
  ```css
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
  ```

