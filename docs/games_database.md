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

Each game card in the horizontal showcase list should support the following visual state flow:
1. **Default State**:
   - Clean card showing the high-resolution game logo/artwork background, stylized game title, and a list of platforms supported (small vector icons: Apple logo, Google Play logo, Poki logo).
   - Slightly darkened overlay to keep text highly legible.
2. **Hover State (Interactive)**:
   - **3D Tilt Effect**: The card tracks the mouse position. The agent must translate mouse coordinates (relative to card center) into small angles of rotation on the X and Y axes (`rotateX` and `rotateY` between -10deg and +10deg) and move the subtle reflection sheen layer to simulate material depth.
   - **Video Preview Reveal**: The static card background fades out or scales down, revealing a looping 10-15s gameplay video (MP4 format). If the video URL is missing, it should fall back to an animated game banner or a high-quality GIF.
   - **Download Badges Overlay**: Small badges for download slides up smoothly to encourage immediate installs.
