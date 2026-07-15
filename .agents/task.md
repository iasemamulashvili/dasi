# Dasi Games - Execution Tasklist (Hover Refinements & G-Force Animations)

## Hover & Autoplay Refinements
- [x] Implement smooth speed decay to `0` when cards are hovered in the autoplay loop (`GamesShowcase.tsx`)
- [x] Verify that autoplay resumes when cards are unhovered

## Navigation Controls & Indicators
- [x] Add `impulseState` React state to synchronize button hold states with UI rendering
- [x] Implement G-Force drift and skew animations on dot/dash buttons using spring physics
- [x] Add active border and box shadow glow effects to the navigation container during acceleration
- [x] Apply focus/active scale-down transitions on the Left and Right chevron buttons
- [x] Update bottom caption text to `"DRAG TO SCROLL // HOLD ARROWS TO ACCELERATE"`

## Verification & Deployment
- [x] Run `npx tsc --noEmit` to verify type and build stability
- [x] Update walkthrough.md with the latest changes
- [x] Commit and push code to the remote branch
