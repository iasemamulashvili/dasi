# Frontend Performance Guidelines

This document outlines the core Web Vitals performance budgets and metrics checked by our automated auditing loop.

---

## Core Performance Metrics & Budgets

We measure and budget the following client-centric loading and responsiveness indicators:

### 1. LCP (Largest Contentful Paint)
- **What it is**: Measures loading performance. It marks the point in the page load timeline when the page's main content has likely loaded.
- **Budget Goal**: `< 2.5s` (Green / Good)
- **Warning Limit**: `< 4.0s` (Yellow / Needs Improvement)
- **Critical Threshold**: `>= 4.0s` (Red / Poor)

### 2. INP / TBT (Interaction to Next Paint / Total Blocking Time)
- **What it is**: Measures responsiveness. TBT serves as our lab-audited proxy metric for INP. It measures the total amount of time between FCP and Time to Interactive where the main thread was blocked by tasks taking more than 50ms.
- **Budget Goal**: `< 150ms` (Green / Good)
- **Warning Limit**: `< 300ms` (Yellow / Needs Improvement)
- **Critical Threshold**: `>= 300ms` (Red / Poor)

### 3. CLS (Cumulative Layout Shift)
- **What it is**: Measures visual stability. It quantifies how much the page elements shift unexpectedly during the loading phase.
- **Budget Goal**: `< 0.1` (Green / Good)
- **Warning Limit**: `< 0.25` (Yellow / Needs Improvement)
- **Critical Threshold**: `>= 0.25` (Red / Poor)

### 4. FCP (First Contentful Paint)
- **What it is**: Measures the time from when the page starts loading to when any part of the page's content is rendered on the screen.
- **Budget Goal**: `< 1.8s` (Green / Good)

### 5. TTFB (Time to First Byte)
- **What it is**: Measures the delay between the request for a resource and the start of the response arriving.
- **Budget Goal**: `< 800ms` (Green / Good)

---

## Performance Auditing Instructions

To trigger a performance audit locally:
```bash
node scripts/perf-audit.js
```
The script will spin up a transient production Next.js instance, run Lighthouse in headless Chrome, track the results, update `PERFORMANCE_HISTORY.md`, and compile a standalone, offline-ready dashboard inside `reports/performance-dashboard.html`.
