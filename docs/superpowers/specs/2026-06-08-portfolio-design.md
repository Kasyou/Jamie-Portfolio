# Portfolio Website — Design Spec

**Date:** 2026-06-08
**Status:** Approved
**Purpose:** Personal portfolio website showcasing vibecoding + hand-built projects for job seeking.

---

## 1. Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS 3
- **Animation:** Framer Motion (page transitions, scroll reveals, star map physics)
- **Routing:** React Router v6
- **Deployment:** Netlify

---

## 2. Visual Design System

### 2.1 Design Language

Dark Terminal aesthetic as base tone, with Editorial typography driving the layout. Glassmorphism for hover overlays and floating elements. Mind-map and constellation visualizations for structured data presentation.

### 2.2 Color Palette

**Surface Colors (4-layer dark hierarchy):**

| Token | Hex | Usage |
|-------|-----|-------|
| Deep Void | `#090c10` | Root background |
| Surface | `#0d1117` | Cards, panels |
| Elevated | `#161b22` | Hover state, floating elements |
| Border | `#21262d` | Dividers, borders |

**Category Accent Colors:**

| Category | Hex | 
|----------|-----|
| Frontend | `#58a6ff` |
| Backend | `#7ee787` |
| CLI / MCP | `#a78bfa` |
| Mobile | `#ff6b35` |
| Embedded | `#ffa657` |

### 2.3 Typography

| Role | Font | Size/Weight |
|------|------|-------------|
| Display / Hero | Geist Mono | 48-72px, Bold/Light |
| Headings | Geist Sans | 24-36px, SemiBold |
| Body | Inter / Geist Sans | 14-17px, Regular |
| Code / Terminal | JetBrains Mono | 12-14px |

---

## 3. Page Architecture

### 3.1 Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Homepage | 5-section editorial narrative: Who → What → Spectrum → Proof → Why Me |
| `/projects` | Projects Index | Interactive star map + visual gallery by category |
| `/projects/:id` | Project Detail | Magazine-style deep dive with mind-map architecture |

### 3.2 Shared Layout

- Fixed top nav: `Jamie` (logo) + Home / Projects / About
- Footer: Mini terminal easter egg (`$ _` command input)
- Page transitions: Framer Motion `AnimatePresence` fade + slide

---

## 4. Homepage Design (`/`)

5 horizontal sections, each ~1 viewport height, scroll-driven narrative.

### Section 1: Hero

- Large editorial heading: "I turn ideas into **shipped products**"
- Subtitle: "React → Spring Boot → Go CLI → Android → ESP32 firmware"
- 4 stat numbers: 15+ Shipped / 5 Domains / 6 Languages / 1yr Vibecoding
- Layout: Centered, generous whitespace, gradient glow behind hero text

### Section 2: Capabilities

- Heading: "What I bring to the table"
- 3 capability cards: Full-Stack Breadth / AI-Native Workflow / Ship End-to-End
- Each card: icon + title + description + tech tag pills
- Non-grid alignment — offset positioning for visual rhythm

### Section 3: Tech Spectrum

- Heading: "One developer, five dimensions"
- 5 vertical columns (Frontend / Backend / CLI-MCP / Mobile / Embedded)
- Each column: category color, project count (large number), specific tech list
- Accent-colored borders matching category system

### Section 4: Featured Work

- Heading: "Selected projects that demonstrate range"
- 4 project previews in 2x2 layout, each from different category
- Compact card: category tag + name + one-line description + tech stack
- "Browse all 15 projects →" CTA

### Section 5: Why Me

- Heading: "Not just a coder — a builder"
- 4 value props: Speed / Breadth / Ship to Users / Deep Understanding
- Each: emoji icon + title + one-line explanation
- Differentiation: mentions both AI-Native vibecoding AND traditional hand-built expertise

---

## 5. Projects Page (`/projects`)

### 5.1 Interactive Star Map (top section)

- Center node: "Jamie" — the developer
- Orbiting nodes: each project as a planet on concentric rings
- Rings organized by category (inner = core skills, outer = expanding domains)
- Node size proportional to project complexity (LOC, files, features)
- Node color = category accent color
- **Interaction:**
  - Mouse drag to rotate the entire constellation
  - Physics-based inertia after drag release (gradual deceleration)
  - Nodes orbit around center on their respective rings
  - Hover node: node scales up + glow + info tooltip appears
  - Click node: scrolls down to project in gallery OR navigates to detail
- Optional: subtle particle field in background

### 5.2 Visual Gallery (below star map)

- Projects organized by category bands, scrolling vertically
- Each category: colored header with name + count
- Projects shown as rich visual tiles in horizontal scroll band
- **Tile structure:**
  - Top: gradient preview area with category-specific color + emoji/icon
  - Bottom: project name + short description + tech tag pills + live/source link
- Tile sizes vary: Featured projects larger (280px wide), others smaller (220-240px)
- **Interaction:**
  - Hover: tile lifts 4px + border glows with category color
  - Mouse move: subtle 3D tilt following cursor (Apple TV card effect)
  - Click: navigate to project detail page
- Mobile: horizontal bands become vertical stacking grid

---

## 6. Project Detail Page (`/projects/:id`)

Magazine editorial layout. No card containers. Text + images in organic flow.

### 6.1 Hero

- Full-width section with radial gradient glow matching project category color
- Category tag + year + status badges
- Large project name (56px, light weight)
- One-sentence value proposition as subtitle
- Links: Live Demo → | Source ↗

### 6.2 Overview

- Left-right split: screenshot/image (left, ~240px) + narrative text (right)
- Text explains WHY the project was built, not just WHAT it does
- Problem → Solution flow

### 6.3 Architecture — Mind Map

- Central node: project name
- Branches radiating left and right: architecture layers (UI Layer, State, Routing, Animation, Data, Deploy, etc.)
- Sub-nodes: specific technologies used in each layer
- Each branch has its own accent color
- Connection lines from center to sub-nodes
- Hover: branch highlights, sub-node details appear

### 6.4 Highlights

- Numbered list (01, 02, 03...)
- Each highlight: title + narrative paragraph + optional inline code block
- Code blocks: dark surface with syntax-highlighted snippets
- Written like a high-quality technical blog post

### 6.5 Project Data

- Horizontal stat row (no card frames):
  - Codebase: X files / Y LOC
  - Timeline: N weeks/days
  - Status: Live / Complete / Prototype
  - Links: Demo / Source / Docs

### 6.6 Navigation

- Bottom bar: ← Previous Project | Back to all projects | Next Project →

---

## 7. Interaction & Animation Spec

### 7.1 Card Hover State (all pages)

- Border color transitions from `#21262d` to category accent color
- Card lifts 4px (`translateY(-4px)`)
- Subtle box-shadow glow in category color (8-30px blur, low opacity)
- Tech stack tag pills fade in
- "View details →" text fades in
- Transition: 300ms ease

### 7.2 Card Mouse-Tilt (desktop only)

- Card rotates slightly towards cursor position
- Max rotation: ±3° on X and Y axes
- Uses `onMouseMove` to calculate relative cursor position within card bounds
- Perspective transform via CSS `transform: perspective(1000px) rotateX() rotateY()`
- Returns to neutral on mouse leave with 500ms ease-out

### 7.3 Star Map Physics

- Drag to rotate: `onMouseDown` → track delta → apply rotation to entire constellation
- Release: inertia deceleration (exponential decay over ~2 seconds)
- Continuous slow auto-rotation when idle (~0.1°/frame)
- Nodes maintain orbital positions relative to center
- CSS `transform: rotate()` on container, nodes counter-rotate to stay upright

### 7.4 Page Transitions

- Route changes: Framer Motion `AnimatePresence`
- Page enter: fade in + slide up 20px
- Page exit: fade out
- Duration: 300ms

### 7.5 Scroll Reveals

- Sections animate in on first scroll into view
- `whileInView` trigger: opacity 0→1, translateY 30px→0
- Stagger children by 100ms
- Once-only (no re-trigger on scroll back)

---

## 8. Project Content Inventory

### Frontend (5 projects)
1. **CoBoard** — Kanban collaboration, React/TS/dnd-kit/Motion, 34 files, Netlify live
2. **AiWaifu** — AI anime chat, React/Capacitor/Zustand, Web + APK, SSE streaming
3. **ccMonitor** — Claude Code desktop companion, C# WPF, DeepSeek API, cat-themed
4. **CrossBorderWorkflow** — E-commerce management, Electron/React/Ant Design, 30+ IPC
5. **RussiaBlock** — Desktop Tetris, Electron/Canvas, portable EXE

### Backend (3 projects)
6. **AsynSMS** — Enterprise SMS, Spring Boot/RabbitMQ/Redis, 48/48 tests, Docker
7. **FinancialSystem** — A-share trading sim, Python/akshare, 3 strategies, event-driven
8. **ContentPlatform** — AI content operation, Claude-driven, 4 platforms

### CLI / MCP (2 projects)
9. **MCPX** — "Next.js for MCP", TypeScript, 60% less code, 111-line core, MIT
10. **VibeView** — Claude visual output, Go, 9 MCP tools, ~2550 LOC

### Mobile (3 projects)
11. **ExpenseTracker** — Personal finance, React Native/Expo/SQLite, ~3679 LOC, Chinese UI
12. **WeatherReport** — Android weather app, Java/MVVM/Room, 62 files, hand-built
13. **MusicPlayer** — Desktop music player, Electron/React 19, scaffolded

### Embedded (3 projects)
14. **TinyRobot** — $11 desktop companion, ESP32-S3/FreeRTOS, 4 modes, custom TCP
15. **TrafficLight** — Bare-metal LED controller, STM32F103 CMSIS, custom linker script
16. **IoT Monitor** — Environmental IoT, STM32/ESP8266/DHT11/MQ-4, 3 firmware variants, hand-built

### Note on Build Approach
- **AI-Native (Vibecoding):** Projects 1-11, 13-15 — built with Claude Code collaboration
- **Hand-Built (Traditional):** Projects 12 (WeatherReport) + 16 (IoT Monitor) — independently coded without AI assistance

---

## 9. Responsive Behavior

- **Desktop (1200px+):** Full editorial layout, star map with drag, card tilt effects
- **Tablet (768-1199px):** Stacked sections, star map simplified (no drag, auto-rotate only), no card tilt
- **Mobile (<768px):** Single column, horizontal bands become vertical grid, star map becomes static cluster, reduced motion

---

## 10. Performance Notes

- Star map: use CSS transforms (GPU-accelerated), avoid JS-driven animation for orbit
- Lazy load project detail pages with `React.lazy()`
- Images: WebP format where possible, lazy loading
- Framer Motion: use `layout` animations sparingly, prefer `opacity`/`transform` only
