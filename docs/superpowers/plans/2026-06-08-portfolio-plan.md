# Portfolio Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 3-page personal portfolio website showcasing 16 projects across 5 domains with editorial design, interactive star map, and magazine-style project detail pages.

**Architecture:** React 18 + TypeScript + Vite SPA with Tailwind CSS and Framer Motion. Single data file drives all project rendering. Fixed nav + footer shell with animated page transitions. Star map uses CSS transforms for GPU-accelerated physics. Card tilt via onMouseMove perspective transforms.

**Tech Stack:** React 18, TypeScript, Vite 6, Tailwind CSS 3, Framer Motion 11, React Router v6

---

## File Map

```
src/
├── main.tsx                          # ReactDOM entry
├── App.tsx                           # Router setup + layout wrapper
├── index.css                         # Tailwind directives + CSS custom properties
│
├── data/
│   └── projects.ts                   # 16 projects, typed, all content
│
├── types/
│   └── project.ts                    # Project, Category, TechTag types
│
├── layouts/
│   └── RootLayout.tsx                # Fixed nav + footer + <Outlet/>
│
├── pages/
│   ├── HomePage.tsx                  # Assembles 5 sections
│   ├── ProjectsPage.tsx              # StarMap + GalleryBands
│   └── ProjectDetailPage.tsx         # Editorial detail with mind map
│
├── components/
│   ├── ui/
│   │   ├── Card.tsx                  # Generic card with hover+tilt
│   │   ├── Tag.tsx                   # Colored pill tag
│   │   └── StatNumber.tsx            # Large number with label
│   │
│   ├── home/
│   │   ├── HeroSection.tsx           # Section 1: big type + stats
│   │   ├── CapabilitiesSection.tsx   # Section 2: 3 capability blurbs
│   │   ├── TechSpectrumSection.tsx   # Section 3: 5 columns
│   │   ├── FeaturedWorkSection.tsx   # Section 4: 4 featured cards
│   │   └── WhyMeSection.tsx          # Section 5: 4 value props
│   │
│   ├── projects/
│   │   ├── StarMap.tsx               # Interactive constellation with drag physics
│   │   ├── GalleryBand.tsx           # Horizontal scroll band per category
│   │   └── GalleryTile.tsx           # Individual project tile
│   │
│   ├── detail/
│   │   ├── DetailHero.tsx            # Full-width gradient hero
│   │   ├── OverviewSection.tsx       # Image + narrative text
│   │   ├── MindMapArchitecture.tsx   # Central node + branches
│   │   ├── HighlightsSection.tsx     # Numbered list + inline code
│   │   ├── ProjectDataRow.tsx        # Horizontal stats row
│   │   └── ProjectNav.tsx            # Prev/Next + back links
│   │
│   └── shared/
│       ├── MiniTerminal.tsx          # Footer: $ _ command input
│       └── ScrollReveal.tsx          # whileInView wrapper
│
└── hooks/
    ├── useMouseTilt.ts               # Card 3D tilt on mouse move
    └── useStarMapDrag.ts             # Drag + inertia physics
```

---

## Task 1: Project Scaffold

**Files:**
- Run: scaffold commands
- Create: `tailwind.config.js`, `postcss.config.js`

- [ ] **Step 1: Scaffold Vite + React + TypeScript**

```bash
cd d:/WORKS/ClaudeCode/FrontedProject/ProfileHomepage
npm create vite@latest . -- --template react-ts
```

Accept overwrite if prompted. Choose React + TypeScript.

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install react-router-dom framer-motion
npm install -D tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: Configure Tailwind**

Write `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 4: Write base CSS**

Write `src/index.css`:

```css
@import "tailwindcss";

@theme {
  --color-void: #090c10;
  --color-surface: #0d1117;
  --color-elevated: #161b22;
  --color-border: #21262d;
  --color-frontend: #58a6ff;
  --color-backend: #7ee787;
  --color-cli: #a78bfa;
  --color-mobile: #ff6b35;
  --color-embedded: #ffa657;
  --color-text-primary: #c9d1d9;
  --color-text-secondary: #8b949e;
  --color-text-muted: #484f58;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-sans: 'Inter', 'Geist Sans', -apple-system, sans-serif;
}

body {
  background-color: var(--color-void);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
}

/* Terminal cursor blink */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```

- [ ] **Step 5: Verify dev server**

```bash
npm run dev
```

Open `http://localhost:5173`. Should see blank dark page.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold vite + react + tailwind project"
```

---

## Task 2: Types and Project Data

**Files:**
- Create: `src/types/project.ts`
- Create: `src/data/projects.ts`

- [ ] **Step 1: Define types**

Write `src/types/project.ts`:

```typescript
export type Category = 'frontend' | 'backend' | 'cli-mcp' | 'mobile' | 'embedded';

export interface ProjectMeta {
  files: string;
  loc: string;
  timeline: string;
  status: 'Live' | 'Complete' | 'Prototype' | 'Paused' | 'WIP';
}

export interface TechStackItem {
  name: string;
  category?: Category;
}

export interface Highlight {
  title: string;
  text: string;
  code?: string;
}

export interface Project {
  id: string;
  name: string;
  category: Category;
  tagline: string;
  description: string;
  problemStatement: string;
  techStack: string[];
  meta: ProjectMeta;
  highlights: Highlight[];
  links: {
    live?: string;
    source?: string;
    docs?: string;
  };
  isHandBuilt: boolean;
  featured: boolean;
  emoji: string;
}
```

- [ ] **Step 2: Write all 16 project entries**

Write `src/data/projects.ts`. All content below:

```typescript
import type { Project } from '../types/project';

export const projects: Project[] = [
  {
    id: 'coboard',
    name: 'CoBoard',
    category: 'frontend',
    tagline: 'Cross-department Kanban with 4-tier permissions and Framer Motion landing page.',
    description: 'Small-to-medium dev teams often lack visibility into cross-department progress. CoBoard solves this with a shared Kanban where each department manages their own board, while anyone can submit requests or flag blockers visible to all. Built in one week to demonstrate React ecosystem mastery.',
    problemStatement: 'Frontend doesn\'t know what backend is blocking on. PM can\'t see actual progress. CoBoard makes team work transparent.',
    techStack: ['React 18', 'TypeScript', 'Tailwind CSS', 'Zustand', '@dnd-kit', 'Framer Motion', 'React Router v6', 'Lucide React'],
    meta: { files: '34 TSX/TS', loc: '~3,500', timeline: '1 week', status: 'Live' },
    highlights: [
      {
        title: 'Landing Page Motion Design',
        text: 'Mouse-follow radial gradient orbs using useSpring, scroll parallax cards with useScroll + useTransform, and staggered entrance animations with whileInView. Every animation serves information hierarchy.',
      },
      {
        title: 'Permission Model as Pure Functions',
        text: 'All permission logic lives in 6 pure functions in src/utils/permissions.ts. Given a user role and card type, each function returns allowed operations. Testable without a browser.',
        code: `export const canEditCard = (user: User, card: Card): boolean => {
  if (user.role === 'pm') return true;
  if (user.role === 'leader' && user.dept === card.dept) return true;
  return user.id === card.authorId;
};`,
      },
      {
        title: 'Type Safety Without Leaks',
        text: 'User and UserSafe type separation ensures passwords never reach the frontend. TypeScript enforced what code review would have to catch.',
      },
    ],
    links: { live: 'https://coboard.netlify.app/' },
    isHandBuilt: false,
    featured: true,
    emoji: '📋',
  },
  {
    id: 'aiwaifu',
    name: 'AiWaifu',
    category: 'frontend',
    tagline: 'AI anime character chat with streaming SSE, multimodal input, and Android APK packaging.',
    description: 'A pure frontend AI chat app for real-time conversation with anime characters. Supports web browser and Android APK deployment with zero backend dependency. Features character creation, style learning, and location awareness.',
    problemStatement: 'Anime fans want immersive character interactions. AiWaifu delivers streaming conversations with personality — no server needed.',
    techStack: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Zustand', 'Capacitor 8', 'SSE'],
    meta: { files: '22 TSX/TS', loc: '~2,500', timeline: '2 weeks', status: 'Live' },
    highlights: [
      {
        title: 'Streaming SSE with Typewriter Effect',
        text: 'Token-by-token streaming via Server-Sent Events with automatic model detection for multimodal support. Character system prompts adapt based on conversation context.',
      },
      {
        title: 'Dual-Platform Without Code Split',
        text: 'Single codebase produces both Netlify web deployment and Android APK via Capacitor. Responsive layout switches between desktop sidebar and mobile page navigation.',
      },
      {
        title: 'Natural Language System Prompt Tuning',
        text: 'During conversation, user style suggestions auto-optimize the System Prompt with a 5-minute cooldown. Characters learn from interaction.',
      },
    ],
    links: { live: 'https://kasyouaiwaifu.netlify.app/' },
    isHandBuilt: false,
    featured: false,
    emoji: '💬',
  },
  {
    id: 'ccmonitor',
    name: 'ccMonitor',
    category: 'frontend',
    tagline: 'Windows desktop companion for Claude Code with real-time status monitoring and DeepSeek API dashboard.',
    description: 'A WPF desktop app that monitors Claude Code working status via file watcher, displays DeepSeek API usage and balance, and provides a terminal-style log console. Features cat-themed pixel art status indicators.',
    problemStatement: 'Claude Code runs in terminal. ccMonitor gives it a visual dashboard — status, costs, logs — always visible on the desktop.',
    techStack: ['C#', '.NET 8', 'WPF', 'XAML', 'DeepSeek API', 'DPAPI'],
    meta: { files: '~15', loc: '~2,000', timeline: '3 days', status: 'Complete' },
    highlights: [
      {
        title: 'Cat-Themed Status System',
        text: 'Four custom cat pixel art PNGs represent Idle/Working/Alert/Done states. File watcher polls claude_status.txt at configurable intervals.',
      },
      {
        title: 'API Key Security',
        text: 'DeepSeek API key encrypted at rest using Windows DPAPI (ProtectedData.Protect). Never stored in plaintext.',
      },
    ],
    links: {},
    isHandBuilt: false,
    featured: false,
    emoji: '🖥',
  },
  {
    id: 'crossborder-workflow',
    name: 'CrossBorderWorkflow',
    category: 'frontend',
    tagline: 'Cross-border e-commerce management desktop app with multi-platform order sync and AI translation.',
    description: 'An Electron + React + Ant Design desktop application for managing cross-border e-commerce operations. Handles orders, inventory, products, and warehouses with AI-powered listing translation and automated logistics tracking.',
    problemStatement: 'Cross-border sellers juggle Temu, Amazon, Shopee, TikTok. This app centralizes everything with AI assistance.',
    techStack: ['Electron 31', 'React 18', 'TypeScript', 'Ant Design 5', 'ECharts', 'Zustand', 'better-sqlite3', 'xlsx'],
    meta: { files: '~40', loc: '~5,000', timeline: 'Ongoing', status: 'WIP' },
    highlights: [
      {
        title: '30+ IPC Channels',
        text: 'Electron main process handles 30+ IPC channels for file system access, database operations, and system tray integration. Renderer stays thin.',
      },
      {
        title: 'AI Translation Adapter',
        text: 'Configurable AI provider (DeepSeek/OpenAI) for product listing translation. Adapter pattern allows swapping without changing business logic.',
      },
      {
        title: 'Scheduled Sync with Cron',
        text: 'node-cron schedules automated platform syncs. Background operation via system tray keeps the app running without blocking the user.',
      },
    ],
    links: {},
    isHandBuilt: false,
    featured: false,
    emoji: '📦',
  },
  {
    id: 'russiablock',
    name: 'RussiaBlock',
    category: 'frontend',
    tagline: 'Classic Tetris desktop game with Canvas rendering and Electron packaging for Windows.',
    description: 'A fully-featured Tetris game with Canvas-based rendering, dark space-themed UI, glassmorphism panels, and Electron packaging into portable EXE and NSIS installer.',
    problemStatement: 'A nostalgic game rebuilt with modern tooling — demonstrating Canvas game loop mastery and desktop packaging.',
    techStack: ['HTML5 Canvas', 'Electron 33', 'JavaScript', 'electron-builder'],
    meta: { files: '2', loc: '~1,000', timeline: '1 day', status: 'Complete' },
    highlights: [
      {
        title: 'Pure Canvas Game Loop',
        text: 'All 7 standard Tetris pieces rendered via Canvas API. Game state machine handles play/pause/game-over with blur overlay transitions.',
      },
      {
        title: 'Dual Build Targets',
        text: 'electron-builder configured for both portable EXE and NSIS installer output from a single codebase.',
      },
    ],
    links: {},
    isHandBuilt: false,
    featured: false,
    emoji: '🎮',
  },
  {
    id: 'asynsms',
    name: 'AsynSMS',
    category: 'backend',
    tagline: 'Enterprise SMS dispatch system with triple-guarantee message reliability and Docker one-click deploy.',
    description: 'An enterprise-grade bulk SMS push system with RabbitMQ dead-letter queues, Redis Lua-scripted token bucket rate limiting, and a real-time progress dashboard. 48/48 integration tests passing.',
    problemStatement: 'SMS delivery must be reliable at scale. Messages can\'t be lost, rate limits must be respected, failures must be traceable.',
    techStack: ['Spring Boot 3.5', 'Java 21', 'RabbitMQ 4.0', 'Redis 7', 'MySQL 8.0', 'Docker', 'Thymeleaf', 'Bootstrap 5'],
    meta: { files: '44 Java', loc: '~3,000', timeline: '2 weeks', status: 'Complete' },
    highlights: [
      {
        title: 'Triple-Guarantee Reliability',
        text: 'Publisher Confirm + Manual ACK + Dead Letter Queue. Every message tracked from production to consumption. Custom retry logic avoids Spring default head-of-line blocking.',
      },
      {
        title: 'Redis Token Bucket Rate Limiting',
        text: 'Atomic Lua-scripted token bucket in Redis prevents exceeding provider rate limits. Distributed-safe — works across multiple app instances.',
        code: `-- Lua script: atomic token bucket
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local tokens = tonumber(redis.call('get', key) or capacity)
if tokens > 0 then
  redis.call('set', key, tokens - 1)
  return 1
end
return 0`,
      },
      {
        title: 'Dual-Write Consistency',
        text: 'Classic producer-transaction-not-yet-committed problem solved with requeue + sleep retry. No lost messages even under concurrent writes.',
      },
      {
        title: '100% Test Pass Rate',
        text: '48/48 integration tests across all controllers and services. Docker Compose spins up full stack for testing.',
      },
    ],
    links: {},
    isHandBuilt: false,
    featured: true,
    emoji: '📨',
  },
  {
    id: 'financial-system',
    name: 'FinancialSystem',
    category: 'backend',
    tagline: 'A-share stock trading simulation with real market data, 3 strategies, and event-driven backtest engine.',
    description: 'A Python-based A-share stock and mutual fund trading simulation using free akshare data. Features event-driven backtesting, 3 built-in strategies, configurable risk controls, and a broker abstraction layer for live trading.',
    problemStatement: 'Strategy validation requires real data and realistic fee modeling. This system provides professional-grade simulation without paid data feeds.',
    techStack: ['Python 3.10+', 'akshare', 'pandas', 'numpy', 'matplotlib', 'SQLite', 'PyYAML'],
    meta: { files: '25 Python', loc: '~2,500', timeline: '1 week', status: 'Complete' },
    highlights: [
      {
        title: 'Realistic A-Share Fee Modeling',
        text: 'Full T+1 settlement with commission (min 5 CNY), stamp tax (0.1% sell only), transfer fee, and slippage. Not simplified — matches real trading costs.',
      },
      {
        title: 'Strategy Comparison Pipeline',
        text: 'demo.py runs all 3 strategies against the same data, outputs comparison table and equity curve chart. One click from data download to final report.',
      },
      {
        title: 'Broker Abstraction',
        text: 'BrokerBase abstract class allows swapping SimulatedBroker for LiveBroker without changing any strategy code.',
      },
    ],
    links: {},
    isHandBuilt: false,
    featured: false,
    emoji: '📈',
  },
  {
    id: 'content-platform',
    name: 'ContentPlatform',
    category: 'backend',
    tagline: 'AI-driven multi-platform content creation pipeline producing technical articles across 4 Chinese platforms.',
    description: 'An autonomous content operation system using Claude Code as the content engine. Produces weekly 3000-word technical articles adapted for Zhihu, Juejin, CSDN, and WeChat with branded identity and data-driven topic selection.',
    problemStatement: 'Content marketing at scale requires consistency. This pipeline automates research, writing, and adaptation while maintaining quality.',
    techStack: ['Claude Code', 'Markdown', 'JSON', 'Analytics'],
    meta: { files: '~15', loc: '~1,000', timeline: 'Ongoing', status: 'Paused' },
    highlights: [
      {
        title: 'Platform Adaptation Layer',
        text: 'Core article adapted for 4 platforms with different formatting, tone, and SEO requirements. Single source of truth.',
      },
      {
        title: 'Data-Driven Topic Queue',
        text: '10+ pre-planned articles across 4 content lines. Analytics tracking informs topic selection and style adjustments.',
      },
    ],
    links: {},
    isHandBuilt: false,
    featured: false,
    emoji: '✍️',
  },
  {
    id: 'mcpx',
    name: 'MCPX',
    category: 'cli-mcp',
    tagline: '"Next.js for MCP" — TypeScript framework reducing MCP server development complexity by 60%.',
    description: 'A TypeScript framework that reduces MCP server development from 42 lines of boilerplate to 17. One function per MCP tool, zero boilerplate, full type inference. Includes CLI scaffolding, hot reload dev server, and 4 example servers.',
    problemStatement: 'Raw MCP SDK requires repetitive boilerplate for every tool. MCPX makes server creation as simple as defining a function.',
    techStack: ['TypeScript', 'Node.js', '@modelcontextprotocol/sdk', 'Zod', 'Commander', 'Chokidar', 'Vitest'],
    meta: { files: '~15', loc: '~300', timeline: '3 days', status: 'Live' },
    highlights: [
      {
        title: '60% Less Code',
        text: 'Side-by-side comparison: 42 lines with raw SDK vs 17 with MCPX. The mcpx() factory chains .tool() calls with auto-generated Zod schemas and auto-wrapped returns.',
        code: `// Raw MCP SDK: 42 lines
const server = new Server({ name: 'my-server', version: '1.0.0' }, { capabilities: { tools: {} } });
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (name === 'add') {
    if (typeof args?.a !== 'number' || typeof args?.b !== 'number') {
      return { content: [{ type: 'text', text: 'Invalid args' }], isError: true };
    }
    return { content: [{ type: 'text', text: String(args.a + args.b) }] };
  }
  throw new Error('Unknown tool');
});

// MCPX: 17 lines
const server = mcpx('my-server', '1.0.0', 'A demo server')
  .tool('add', 'Add two numbers', {
    a: z.number(),
    b: z.number(),
  }, async ({ a, b }) => a + b)
  .serve();`,
      },
      {
        title: '111-Line Core',
        text: 'The entire framework core is 111 lines. Compact enough to audit in 5 minutes, powerful enough to build production MCP servers.',
      },
      {
        title: 'CLI with Hot Reload',
        text: 'mcpx init scaffolds a new project. mcpx dev runs with file-watching hot reload. mcpx build bundles for distribution.',
      },
    ],
    links: { source: 'https://github.com/jamie/mcpx' },
    isHandBuilt: false,
    featured: true,
    emoji: '⚡',
  },
  {
    id: 'vibeview',
    name: 'VibeView',
    category: 'cli-mcp',
    tagline: 'CLI tool giving Claude Code visual output — real-time browser whiteboard and design preview with 9 MCP tools.',
    description: 'A Go binary that embeds a web renderer and MCP server. Two modes: Whiteboard (mind maps, tables, analysis cards) and Design Preview (device-framed UI with hot reload and console forwarding).',
    problemStatement: 'Claude Code is text-only. VibeView adds visual output — whiteboards for thinking, device previews for UI work.',
    techStack: ['Go 1.23', 'WebSocket', 'Mermaid.js', 'fsnotify', 'gorilla/websocket'],
    meta: { files: '~20 Go', loc: '~2,550', timeline: '1 week', status: 'Complete' },
    highlights: [
      {
        title: '9 MCP Tools',
        text: 'preview_show, preview_clear, preview_history, preview_screenshot, preview_inspect, preview_console, preview_diff, preview_reload, preview_stop. Each tool maps to a single browser action.',
      },
      {
        title: 'Single Binary Distribution',
        text: '12 MB compiled binary with embedded renderer, Mermaid.js, and web server. Zero dependencies — download and run.',
      },
      {
        title: '37 Tests, 100% Pass',
        text: 'Full test coverage across all MCP tools and WebSocket handlers. Go 1.23+ test runner.',
      },
    ],
    links: {},
    isHandBuilt: false,
    featured: false,
    emoji: '👁',
  },
  {
    id: 'expense-tracker',
    name: 'ExpenseTracker',
    category: 'mobile',
    tagline: 'Clean personal expense tracker with cycle-based budgeting, category statistics, and Excel export.',
    description: 'A React Native + Expo mobile app for personal finance tracking. Features a custom NumberPad, cycle-based accounting, category statistics, and 3-sheet Excel export. Local-first architecture with SQLite.',
    problemStatement: 'Most finance apps are bloated or cloud-dependent. ExpenseTracker is local-first, fast, and focused on what matters — tracking spending.',
    techStack: ['React Native 0.81', 'Expo SDK 54', 'TypeScript', 'expo-sqlite', 'expo-router', 'xlsx'],
    meta: { files: '~25 TSX', loc: '~3,679', timeline: '1 week', status: 'Complete' },
    highlights: [
      {
        title: 'Custom NumberPad',
        text: 'Fully custom numeric input component designed for rapid amount entry. Slide-from-bottom modal for adding transactions.',
      },
      {
        title: 'Cycle-Based Accounting',
        text: 'Monthly or custom duration cycles with configurable start date. Historical cycle browsing with per-cycle statistics.',
      },
      {
        title: 'Excel Export with 3 Sheets',
        text: 'One-tap export generates a workbook with cycle summary, category breakdown, and full transaction detail. UTF-8 BOM for Excel compatibility.',
      },
    ],
    links: {},
    isHandBuilt: false,
    featured: false,
    emoji: '💰',
  },
  {
    id: 'weather-report',
    name: 'WeatherReport',
    category: 'mobile',
    tagline: 'Full-stack Android weather app with MVVM architecture, custom windmill animation, and 3-level city picker.',
    description: 'A graduation project Android app using Java + MVVM + Room + Retrofit. Features real-time weather from QWeather API, 7-day forecast, 9 lifestyle indices, Baidu Map auto-location, and a hand-drawn Canvas windmill animation. Entirely hand-coded without AI assistance.',
    problemStatement: 'A comprehensive Android learning project covering MVVM architecture, network layer abstraction, database migration, and custom View rendering.',
    techStack: ['Android Java', 'MVVM', 'Room 2.4', 'Retrofit 2.9', 'RxJava 2', 'Baidu Map SDK', 'QWeather API'],
    meta: { files: '62 Java', loc: '~5,530', timeline: 'Semester', status: 'Complete' },
    highlights: [
      {
        title: '4-Layer MVVM + Library Module',
        text: 'View (Activity + ViewBinding) → ViewModel (LiveData) → Repository (RxJava) → Data (Room + Retrofit). Library module enforces architecture via abstract base classes.',
      },
      {
        title: 'Hand-Drawn Windmill Animation',
        text: 'Custom WhiteWindmills View draws two windmills with three blades each on Canvas. Rotates at ~100fps via Handler with WeakReference to prevent memory leaks. Blade speed reflects real wind speed.',
      },
      {
        title: 'Hand-Built Without AI',
        text: 'All 62 Java source files written independently. Library module demonstrates architectural thinking — NetworkApi class caches Retrofit instances by base URL, enforces timeout config, and provides structured error handling.',
      },
      {
        title: 'Production Database Migration',
        text: 'Room database includes MIGRATION_1_2 that adds the myCity table via raw SQL. Demonstrates awareness of production schema evolution.',
      },
    ],
    links: {},
    isHandBuilt: true,
    featured: false,
    emoji: '🌤',
  },
  {
    id: 'music-player',
    name: 'MusicPlayer',
    category: 'mobile',
    tagline: 'Desktop local music player built with Electron + React 19, featuring sidebar navigation and persistent player bar.',
    description: 'An Electron desktop music player with React 19 frontend. Features AppShell layout with sidebar navigation, main content area, and persistent bottom player bar. Dark-themed with CSS custom properties.',
    problemStatement: 'A scaffolded desktop app demonstrating Electron + latest React integration patterns with proper security.',
    techStack: ['Electron 33', 'React 19', 'TypeScript', 'Vite 6', 'CSS Modules'],
    meta: { files: '~10', loc: '~800', timeline: 'Scaffolded', status: 'WIP' },
    highlights: [
      {
        title: 'Context Isolation by Default',
        text: 'Preload script exposes safe app info via contextBridge. No nodeIntegration — secure by design.',
      },
      {
        title: 'Latest React 19',
        text: 'Built with React 19 (latest major version). Ready-to-show optimization avoids white flash on app launch.',
      },
    ],
    links: {},
    isHandBuilt: false,
    featured: false,
    emoji: '🎵',
  },
  {
    id: 'tinyrobot',
    name: 'TinyRobot',
    category: 'embedded',
    tagline: '$11 ESP32-S3 desktop companion robot with 4 gravity-switched modes, custom TCP protocol, and interactive 3D model.',
    description: 'A low-cost desktop cubic companion robot. Gravity sensing (MPU6050) switches between animated face, NTP clock, weather display, and Pomodoro timer. PC Link mode streams screen via custom TCP protocol. Dual-core FreeRTOS architecture.',
    problemStatement: 'Can a useful desktop companion be built for $11? TinyRobot proves yes — with personality, utility, and hackability.',
    techStack: ['C++', 'ESP32-S3', 'FreeRTOS', 'PlatformIO', 'ST7789', 'MPU6050', 'WiFi', 'Custom TCP Protocol'],
    meta: { files: '17', loc: '~1,900', timeline: '2 weeks', status: 'Complete' },
    highlights: [
      {
        title: 'Custom Binary TCP Protocol',
        text: '4-byte sync word + command byte + 2-byte length + payload + CRC. Supports full RGB565 frame pushes, text overlay, and WiFi credential config. Discovered via mDNS.',
        code: `// Protocol frame structure
// AA 55 01 FF | CMD | LEN_H | LEN_L | PAYLOAD... | CRC
// sync word   | cmd | 16-bit length | data    | checksum`,
      },
      {
        title: 'Dual-Core FreeRTOS Architecture',
        text: 'Core 0: UI rendering (1Hz heartbeat LED). Core 1: 100Hz sensor poll + mode manager + TCP server + power monitor. Mutex-protected mode transitions.',
      },
      {
        title: 'Power-Aware WiFi Management',
        text: 'Reference-counted WiFi requests from subsystems. WiFi only active when needed (NTP sync, weather fetch, PC Link). Expression mode runs ~17h on 1200mAh battery.',
      },
      {
        title: 'Interactive 3D Model',
        text: 'Three.js WebGL scene in model.html shows physical assembly with OrbitControls, toggle between battery form factors, and animated wire routing.',
      },
    ],
    links: {},
    isHandBuilt: false,
    featured: true,
    emoji: '🤖',
  },
  {
    id: 'trafficlight',
    name: 'TrafficLight',
    category: 'embedded',
    tagline: 'Bare-metal STM32F103 register-level LED controller with custom linker script and dual build system.',
    description: 'A register-level CMSIS project on STM32F103VET6. Two buttons cycle RGB LED color and toggle on/off. No HAL, no standard peripheral library — every register write is explicit. Includes custom linker script, Makefile (ARM GCC), and Keil MDK project.',
    problemStatement: 'Most STM32 tutorials use HAL. This project proves understanding at the silicon level — clock configuration, GPIO registers, atomic bit operations.',
    techStack: ['C', 'STM32F103VET6', 'CMSIS', 'ARM GCC', 'Makefile', 'Keil MDK'],
    meta: { files: '~10', loc: '~200', timeline: '1 day', status: 'Complete' },
    highlights: [
      {
        title: 'Register-Level Bare Metal',
        text: 'Every peripheral configured via direct register writes. RCC clock enable, GPIO CRL/CRH mode configuration, BSRR/BRR atomic bit operations for glitch-free LED transitions.',
        code: `// Direct register manipulation — no HAL
RCC->APB2ENR |= RCC_APB2ENR_IOPBEN;  // Enable GPIOB clock
GPIOB->CRL &= ~(0xF << 0);            // Clear PB0 config
GPIOB->CRL |= (0x3 << 0);             // PB0: 50MHz push-pull output
GPIOB->BSRR = GPIO_BSRR_BS0;          // Atomic set PB0`,
      },
      {
        title: 'Custom Linker Script',
        text: 'Hand-written STM32F103VETx_FLASH.ld defining memory regions (512K Flash, 64K SRAM), section placement, and stack/heap sizing.',
      },
      {
        title: 'LSE Crystal Protection',
        text: 'PC14/PC15 explicitly configured as analog mode after GPIOC clock enable to prevent crystal noise from coupling into PA0\'s WKUP analog comparator. A hardware-aware detail most bare-metal examples overlook.',
      },
    ],
    links: {},
    isHandBuilt: false,
    featured: false,
    emoji: '💡',
  },
  {
    id: 'iot-monitor',
    name: 'IoT Monitor',
    category: 'embedded',
    tagline: 'STM32 environmental IoT system with ESP8266 cloud upload, WeChat mini-program, and self-designed PCB.',
    description: 'A complete embedded IoT environmental monitoring system. STM32F103C8T6 reads DHT11 + MQ-4 sensors, displays on LCD/OLED, triggers alarms, and uploads to Bemfa Cloud via ESP8266 WiFi for WeChat mini-program remote monitoring. Three firmware iterations, self-designed PCB.',
    problemStatement: 'A full-stack embedded project spanning hardware design, firmware (3 paradigms), cloud integration, and documentation — built manually without AI.',
    techStack: ['C', 'STM32F103C8T6', 'ESP8266', 'DHT11', 'MQ-4', 'PCB Design', 'Bemfa Cloud', 'WeChat Mini-Program'],
    meta: { files: '~30 C', loc: '~2,500', timeline: 'Semester', status: 'Complete' },
    highlights: [
      {
        title: 'Three Firmware Iterations',
        text: 'Standard Lib + LCD1602 → Standard Lib + OLED + Bemfa Cloud → HAL + CubeMX + PID light control + DMA ADC. Each iteration added capability and used different development paradigms.',
      },
      {
        title: 'Self-Designed PCB',
        text: 'Full PCB designed in both Altium Designer and EasyEDA. Bit-reversed LCD data bus required a software fix — the BitReversed() function compensates for reversed wiring without re-spinning the board.',
      },
      {
        title: 'PID Light Control',
        text: 'Three PID parameter sets for different illuminance ranges (0-500/500-750/750-900 lux). Moving average filter with outlier removal on 9 ADC channels. DMA circular mode for continuous sampling.',
      },
      {
        title: 'Hand-Built Without AI',
        text: 'All firmware written independently. ESP8266 AT-command parsing with hand-rolled strstr() checks and retry loops. No cloud SDK — raw HTTP GET strings formatted with sprintf().',
      },
    ],
    links: {},
    isHandBuilt: true,
    featured: false,
    emoji: '📡',
  },
];

export const projectsByCategory = (category: string) =>
  projects.filter((p) => p.category === category);

export const featuredProjects = projects.filter((p) => p.featured);

export const categoryMeta: Record<string, { label: string; color: string; count: number }> = {
  frontend: { label: 'Frontend', color: '#58a6ff', count: projects.filter((p) => p.category === 'frontend').length },
  backend: { label: 'Backend', color: '#7ee787', count: projects.filter((p) => p.category === 'backend').length },
  'cli-mcp': { label: 'CLI / MCP', color: '#a78bfa', count: projects.filter((p) => p.category === 'cli-mcp').length },
  mobile: { label: 'Mobile', color: '#ff6b35', count: projects.filter((p) => p.category === 'mobile').length },
  embedded: { label: 'Embedded', color: '#ffa657', count: projects.filter((p) => p.category === 'embedded').length },
};
```

- [ ] **Step 3: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/types/project.ts src/data/projects.ts
git commit -m "feat: add project types and 16-project data"
```

---

## Task 3: Shared Layout Shell

**Files:**
- Create: `src/layouts/RootLayout.tsx`
- Create: `src/components/shared/MiniTerminal.tsx`
- Create: `src/components/shared/ScrollReveal.tsx`
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Write MiniTerminal component**

Write `src/components/shared/MiniTerminal.tsx`:

```tsx
import { useState } from 'react';

export default function MiniTerminal() {
  const [input, setInput] = useState('');
  const [visible, setVisible] = useState(false);

  return (
    <div className="text-center py-16">
      <div
        className="inline-block bg-surface border border-border rounded-lg px-5 py-3 font-mono text-sm cursor-text"
        onClick={() => setVisible(!visible)}
      >
        <span className="text-frontend">~ $ </span>
        {visible ? (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent border-none outline-none text-text-secondary w-40"
            placeholder="type 'help'..."
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setInput('');
              }
            }}
          />
        ) : (
          <span className="text-text-muted">click to type...</span>
        )}
        <span className="text-frontend animate-[blink_1s_infinite]">█</span>
      </div>
      <p className="text-border text-xs mt-5">Built with React · Vite · Tailwind · Deployed on Netlify</p>
    </div>
  );
}
```

- [ ] **Step 2: Write ScrollReveal wrapper**

Write `src/components/shared/ScrollReveal.tsx`:

```tsx
import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

const variants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function ScrollReveal({ children, delay = 0, className }: Props) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={variants}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Write RootLayout**

Write `src/layouts/RootLayout.tsx`:

```tsx
import { Outlet, Link, useLocation } from 'react-router-dom';
import MiniTerminal from '../components/shared/MiniTerminal';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
];

export default function RootLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-void text-text-primary font-sans">
      {/* Fixed Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-void/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-text-primary font-semibold text-sm tracking-tight">
            Jamie
          </Link>
          <div className="flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm transition-colors ${
                  location.pathname === link.to
                    ? 'text-text-primary border-b border-frontend pb-1'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer>
        <MiniTerminal />
      </footer>
    </div>
  );
}
```

- [ ] **Step 4: Wire up App.tsx with router**

Write `src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetailPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}
```

- [ ] **Step 5: Write main.tsx**

Write `src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 6: Verify dev server renders nav + footer**

```bash
npm run dev
```

Open `http://localhost:5173`. Should see nav bar with "Jamie" + "Home" + "Projects", and footer with mini terminal.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/ src/components/shared/ src/App.tsx src/main.tsx
git commit -m "feat: add root layout with nav, footer terminal, and scroll reveal"
```

---

## Task 4: Shared UI Components

**Files:**
- Create: `src/components/ui/Tag.tsx`
- Create: `src/components/ui/StatNumber.tsx`
- Create: `src/hooks/useMouseTilt.ts`
- Create: `src/components/ui/Card.tsx`

- [ ] **Step 1: Write Tag component**

Write `src/components/ui/Tag.tsx`:

```tsx
interface Props {
  color: string;
  children: string;
  className?: string;
}

export default function Tag({ color, children, className = '' }: Props) {
  return (
    <span
      className={`text-[10px] px-2.5 py-0.5 rounded-full tracking-wide font-medium ${className}`}
      style={{
        backgroundColor: `${color}18`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Write StatNumber component**

Write `src/components/ui/StatNumber.tsx`:

```tsx
interface Props {
  value: string;
  label: string;
  color?: string;
}

export default function StatNumber({ value, label, color = '#58a6ff' }: Props) {
  return (
    <div>
      <p className="text-[40px] font-medium tracking-tight leading-none" style={{ color }}>
        {value}
      </p>
      <p className="text-text-secondary text-[11px] tracking-widest uppercase mt-1">
        {label}
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Write useMouseTilt hook**

Write `src/hooks/useMouseTilt.ts`:

```typescript
import { useCallback, useRef } from 'react';

export function useMouseTilt(maxDeg = 3) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      ref.current.style.transform =
        `perspective(1000px) rotateY(${x * maxDeg}deg) rotateX(${-y * maxDeg}deg) translateY(-4px)`;
    },
    [maxDeg]
  );

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transition = 'transform 500ms ease-out';
    ref.current.style.transform =
      'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
  }, []);

  const onMouseEnter = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transition = 'transform 150ms ease-out';
  }, []);

  return { ref, onMouseMove, onMouseLeave, onMouseEnter };
}
```

- [ ] **Step 4: Write Card component**

Write `src/components/ui/Card.tsx`:

```tsx
import type { ReactNode } from 'react';
import { useMouseTilt } from '../../hooks/useMouseTilt';

interface Props {
  children: ReactNode;
  accentColor?: string;
  className?: string;
  onClick?: () => void;
  href?: string;
}

export default function Card({ children, accentColor = '#58a6ff', className = '', onClick }: Props) {
  const { ref, onMouseMove, onMouseLeave, onMouseEnter } = useMouseTilt(3);

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`bg-surface border border-border rounded-2xl transition-[border-color,box-shadow] duration-300 cursor-pointer ${className}`}
      style={{
        transformStyle: 'preserve-3d',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = `${accentColor}40`;
        e.currentTarget.style.boxShadow = `0 8px 30px ${accentColor}10`;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = '#21262d';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 5: Verify build**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/ src/hooks/useMouseTilt.ts
git commit -m "feat: add shared Card, Tag, StatNumber components and useMouseTilt hook"
```

---

## Task 5: Homepage — Hero + Capabilities

**Files:**
- Create: `src/pages/HomePage.tsx`
- Create: `src/components/home/HeroSection.tsx`
- Create: `src/components/home/CapabilitiesSection.tsx`

- [ ] **Step 1: Write HeroSection**

Write `src/components/home/HeroSection.tsx`:

```tsx
import StatNumber from '../ui/StatNumber';
import ScrollReveal from '../shared/ScrollReveal';

export default function HeroSection() {
  return (
    <section className="relative py-28 px-8 text-center border-b border-white/5 overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-radial from-frontend/6 to-transparent rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-radial from-cli/4 to-transparent rounded-full translate-y-1/2 -translate-x-1/4" />

      <ScrollReveal>
        <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-6">
          Full-Stack Developer · AI-Native Builder
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <h1 className="text-[64px] font-light tracking-[-1.5px] leading-[1.08] mb-5 max-w-3xl mx-auto">
          I turn ideas into{' '}
          <span className="text-frontend font-medium">shipped products</span>
        </h1>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <p className="text-text-secondary text-[17px] max-w-[500px] mx-auto mb-16 leading-relaxed">
          Not just frontend. Not just backend.{' '}
          <strong className="text-text-primary font-medium">
            React → Spring Boot → Go CLI → Android → ESP32 firmware
          </strong>
          <br />I build across the entire stack spectrum.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <div className="flex justify-center gap-16">
          <StatNumber value="16" label="SHIPPED" color="#58a6ff" />
          <StatNumber value="5" label="DOMAINS" color="#7ee787" />
          <StatNumber value="6" label="LANGUAGES" color="#a78bfa" />
          <StatNumber value="1yr" label="VIBECODING" color="#ff6b35" />
        </div>
      </ScrollReveal>
    </section>
  );
}
```

- [ ] **Step 2: Write CapabilitiesSection**

Write `src/components/home/CapabilitiesSection.tsx`:

```tsx
import ScrollReveal from '../shared/ScrollReveal';

const capabilities = [
  {
    emoji: '🎯',
    title: 'Full-Stack Breadth',
    text: 'Comfortable at every layer — from CSS animations to database indexing to firmware registers.',
    tags: ['React', 'Spring Boot', 'Go', 'React Native', 'C++'],
    color: '#58a6ff',
  },
  {
    emoji: '⚡',
    title: 'AI-Native Workflow',
    text: 'Ship faster with AI co-pilots. Built 16 projects in 12 months using Claude Code. I know how to leverage AI without losing code quality.',
    tags: ['Claude Code', 'Prompt Engineering', 'MCP Development'],
    color: '#a78bfa',
  },
  {
    emoji: '🔧',
    title: 'Ship End-to-End',
    text: 'I don\'t stop at code. Docker deployment, Netlify live demos, Android APK packaging, EXE bundling — I take projects to real users.',
    tags: ['Docker', 'Netlify', 'APK Build', 'PyInstaller'],
    color: '#7ee787',
  },
];

export default function CapabilitiesSection() {
  return (
    <section className="py-24 px-8 border-b border-white/5">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-3">
            Capabilities
          </p>
          <h2 className="text-[36px] font-light tracking-[-1px] mb-16">
            What I bring to the table
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-3 gap-6">
          {capabilities.map((cap, i) => (
            <ScrollReveal key={cap.title} delay={i * 0.1}>
              <div className="bg-surface border border-border rounded-2xl p-8 h-full">
                <p className="text-2xl mb-4">{cap.emoji}</p>
                <h3 className="text-lg font-medium text-text-primary mb-3">{cap.title}</h3>
                <p className="text-text-secondary text-[13px] leading-relaxed mb-5">{cap.text}</p>
                <div className="flex flex-wrap gap-1.5">
                  {cap.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-1 rounded-md"
                      style={{ backgroundColor: `${cap.color}10`, color: cap.color }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Write HomePage (partial)**

Write `src/pages/HomePage.tsx`:

```tsx
import HeroSection from '../components/home/HeroSection';
import CapabilitiesSection from '../components/home/CapabilitiesSection';
import TechSpectrumSection from '../components/home/TechSpectrumSection';
import FeaturedWorkSection from '../components/home/FeaturedWorkSection';
import WhyMeSection from '../components/home/WhyMeSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CapabilitiesSection />
      <TechSpectrumSection />
      <FeaturedWorkSection />
      <WhyMeSection />
    </>
  );
}
```

- [ ] **Step 4: Verify renders**

```bash
npm run dev
```

Open `http://localhost:5173`. Should see hero and 3 capability cards.

- [ ] **Step 5: Commit**

```bash
git add src/pages/HomePage.tsx src/components/home/HeroSection.tsx src/components/home/CapabilitiesSection.tsx
git commit -m "feat: add homepage hero and capabilities sections"
```

---

## Task 6: Homepage — Tech Spectrum + Featured + Why Me

**Files:**
- Create: `src/components/home/TechSpectrumSection.tsx`
- Create: `src/components/home/FeaturedWorkSection.tsx`
- Create: `src/components/home/WhyMeSection.tsx`

- [ ] **Step 1: Write TechSpectrumSection**

Write `src/components/home/TechSpectrumSection.tsx`:

```tsx
import ScrollReveal from '../shared/ScrollReveal';
import { categoryMeta } from '../../data/projects';

export default function TechSpectrumSection() {
  const entries = Object.entries(categoryMeta);

  return (
    <section className="py-24 px-8 border-b border-white/5">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-3">
            Tech Spectrum
          </p>
          <h2 className="text-[36px] font-light tracking-[-1px] mb-16">
            One developer, <span className="text-frontend">five dimensions</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-5 gap-4 text-center">
          {entries.map(([key, meta], i) => (
            <ScrollReveal key={key} delay={i * 0.1}>
              <div
                className="rounded-2xl py-10 px-4"
                style={{
                  backgroundColor: `${meta.color}08`,
                  border: `1px solid ${meta.color}20`,
                }}
              >
                <p className="text-[28px] font-semibold" style={{ color: meta.color }}>
                  {meta.count}
                </p>
                <p className="text-sm font-medium mt-2" style={{ color: meta.color }}>
                  {meta.label}
                </p>
                <p className="text-text-secondary text-[11px] mt-3 leading-relaxed">
                  {key === 'frontend' && 'React · TS\nTailwind · Electron\nFramer Motion'}
                  {key === 'backend' && 'Spring Boot · Python\nRabbitMQ · Redis\nMySQL · Docker'}
                  {key === 'cli-mcp' && 'Go CLI · MCP SDK\nTypeScript · npm\nVibeView · MCPX'}
                  {key === 'mobile' && 'React Native · Expo\nAndroid Java\nCapacitor'}
                  {key === 'embedded' && 'STM32 CMSIS\nESP32-S3 RTOS\nCustom Protocol'}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write FeaturedWorkSection**

Write `src/components/home/FeaturedWorkSection.tsx`:

```tsx
import { Link } from 'react-router-dom';
import { featuredProjects, categoryMeta } from '../../data/projects';
import Card from '../ui/Card';
import Tag from '../ui/Tag';
import ScrollReveal from '../shared/ScrollReveal';

export default function FeaturedWorkSection() {
  return (
    <section className="py-24 px-8 border-b border-white/5">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-3">
            Featured Work
          </p>
          <h2 className="text-[36px] font-light tracking-[-1px] mb-16">
            Selected projects that <span className="text-frontend">demonstrate range</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-5">
          {featuredProjects.map((project, i) => {
            const catColor = categoryMeta[project.category]?.color ?? '#58a6ff';
            return (
              <ScrollReveal key={project.id} delay={i * 0.1}>
                <Link to={`/projects/${project.id}`}>
                  <Card accentColor={catColor} className="p-7">
                    <Tag color={catColor}>{categoryMeta[project.category]?.label ?? project.category}</Tag>
                    <h3 className="text-xl font-medium mt-4 mb-2">{project.name}</h3>
                    <p className="text-text-secondary text-[13px] leading-relaxed mb-4">
                      {project.tagline}
                    </p>
                    <div className="flex gap-1.5 flex-wrap">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] px-2 py-0.5 rounded bg-elevated text-text-secondary"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="text-[10px] text-text-muted">+{project.techStack.length - 4}</span>
                      )}
                    </div>
                    {project.links.live && (
                      <p className="text-frontend text-[11px] mt-4">
                        Live Demo →
                      </p>
                    )}
                  </Card>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/projects"
            className="text-frontend text-sm border-b border-frontend/30 pb-1 hover:border-frontend transition-colors"
          >
            Browse all 16 projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Write WhyMeSection**

Write `src/components/home/WhyMeSection.tsx`:

```tsx
import ScrollReveal from '../shared/ScrollReveal';

const reasons = [
  {
    emoji: '🚀',
    title: 'Speed',
    text: 'Ship a full MVP in days, not weeks. AI-accelerated without cutting corners.',
  },
  {
    emoji: '🎯',
    title: 'Breadth',
    text: 'React to STM32 registers. I connect dots across the entire tech spectrum.',
  },
  {
    emoji: '📦',
    title: 'Ship to Users',
    text: 'I don\'t stop at localhost. Live demos, APKs, EXEs — real deliverables.',
  },
  {
    emoji: '🧠',
    title: 'Deep Understanding',
    text: 'Custom linker scripts. Custom TCP protocol. I go deep when needed — with or without AI.',
  },
];

export default function WhyMeSection() {
  return (
    <section className="py-24 px-8">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-3">
            Why Me
          </p>
          <h2 className="text-[36px] font-light tracking-[-1px] mb-16">
            Not just a coder — a <span className="text-frontend">builder</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-4 gap-5">
          {reasons.map((reason, i) => (
            <ScrollReveal key={reason.title} delay={i * 0.1}>
              <div className="bg-surface border border-border rounded-2xl p-7 text-center">
                <p className="text-3xl mb-3">{reason.emoji}</p>
                <h3 className="text-base font-medium text-text-primary mb-2">{reason.title}</h3>
                <p className="text-text-secondary text-xs leading-relaxed">{reason.text}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify full homepage renders**

```bash
npm run dev
```

Scroll through all 5 sections. Verify animations trigger on scroll.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/
git commit -m "feat: add tech spectrum, featured work, and why-me sections"
```

---

## Task 7: Projects Page — Star Map

**Files:**
- Create: `src/hooks/useStarMapDrag.ts`
- Create: `src/components/projects/StarMap.tsx`

- [ ] **Step 1: Write useStarMapDrag hook**

Write `src/hooks/useStarMapDrag.ts`:

```typescript
import { useState, useCallback, useRef, useEffect } from 'react';

export function useStarMapDrag() {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const rafRef = useRef<number>(0);

  // Auto-rotation when idle
  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (!isDragging) {
        setRotation((prev) => {
          const next = prev + velocity;
          setVelocity((v) => v * 0.98); // friction
          if (Math.abs(velocity) < 0.01 && Math.abs(prev - Math.round(prev)) < 0.01) {
            return prev + 0.05 * (dt / 16); // slow auto-rotate
          }
          return next;
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isDragging, velocity]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    lastX.current = e.clientX;
    lastTime.current = performance.now();
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX.current;
      const now = performance.now();
      const dt = now - lastTime.current;
      if (dt > 0) {
        setVelocity((dx / dt) * 16); // normalize to ~60fps
      }
      setRotation((prev) => prev + dx * 0.3);
      lastX.current = e.clientX;
      lastTime.current = now;
    },
    [isDragging]
  );

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return { rotation, isDragging, onMouseDown, onMouseMove, onMouseUp };
}
```

- [ ] **Step 2: Write StarMap component**

Write `src/components/projects/StarMap.tsx`:

```tsx
import { useNavigate } from 'react-router-dom';
import { useStarMapDrag } from '../../hooks/useStarMapDrag';
import { projects, categoryMeta } from '../../data/projects';

export default function StarMap() {
  const { rotation, onMouseDown, onMouseMove, onMouseUp } = useStarMapDrag();
  const navigate = useNavigate();

  // Place nodes on 3 concentric rings
  const rings = [140, 220, 300];
  const placed = projects.slice(0, 12); // top 12 for the map

  return (
    <section className="relative py-20 px-8 overflow-hidden border-b border-white/5 select-none">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-2">
          Project Universe
        </p>
        <p className="text-text-muted text-xs font-mono">
          drag to explore · hover for details
        </p>
      </div>

      <div
        className="relative w-full h-[480px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* Orbit rings */}
        {rings.map((r) => (
          <div
            key={r}
            className="absolute rounded-full border border-white/[0.02]"
            style={{ width: r * 2, height: r * 2 }}
          />
        ))}

        {/* Rotating container */}
        <div
          className="relative"
          style={{ transform: `rotate(${rotation}deg)`, transition: 'none' }}
        >
          {/* Center node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center z-10">
            <span className="text-text-primary text-xs font-medium">Jamie</span>
          </div>

          {/* Planet nodes */}
          {placed.map((project, i) => {
            const ringIdx = Math.floor(i / 5); // 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2
            const posInRing = (i % 5) / 5; // 0, 0.2, 0.4, 0.6, 0.8
            const angle = posInRing * Math.PI * 2 + i * 0.3;
            const radius = rings[Math.min(ringIdx, rings.length - 1)];
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const catColor = categoryMeta[project.category]?.color ?? '#8b949e';
            const size = project.featured ? 20 : project.meta.loc.length > 4 ? 16 : 14;

            return (
              <div
                key={project.id}
                className="absolute rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-150 hover:z-20"
                style={{
                  width: size,
                  height: size,
                  left: `calc(50% + ${x}px - ${size / 2}px)`,
                  top: `calc(50% + ${y}px - ${size / 2}px)`,
                  backgroundColor: `${catColor}20`,
                  border: `1.5px solid ${catColor}50`,
                  boxShadow: project.featured ? `0 0 12px ${catColor}20` : 'none',
                }}
                onClick={() => navigate(`/projects/${project.id}`)}
                title={project.name}
              >
                {/* Tooltip on hover — CSS-only */}
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none text-text-secondary">
                  {project.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify star map renders and drags**

```bash
npm run dev
```

Visit `/projects`. Drag the star map. Verify rotation and inertia.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useStarMapDrag.ts src/components/projects/StarMap.tsx
git commit -m "feat: add interactive star map with drag physics and orbital animation"
```

---

## Task 8: Projects Page — Visual Gallery

**Files:**
- Create: `src/components/projects/GalleryBand.tsx`
- Create: `src/components/projects/GalleryTile.tsx`
- Modify: `src/pages/ProjectsPage.tsx`

- [ ] **Step 1: Write GalleryTile**

Write `src/components/projects/GalleryTile.tsx`:

```tsx
import { Link } from 'react-router-dom';
import { useMouseTilt } from '../../hooks/useMouseTilt';
import type { Project } from '../../types/project';
import { categoryMeta } from '../../data/projects';
import Tag from '../ui/Tag';

interface Props {
  project: Project;
  featured?: boolean;
}

export default function GalleryTile({ project, featured = false }: Props) {
  const { ref, onMouseMove, onMouseLeave, onMouseEnter } = useMouseTilt(3);
  const catColor = categoryMeta[project.category]?.color ?? '#58a6ff';
  const width = featured ? 280 : 230;
  const height = featured ? 140 : 110;

  return (
    <Link to={`/projects/${project.id}`}>
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="flex-shrink-0 bg-surface border border-border rounded-[20px] overflow-hidden transition-[border-color,box-shadow] duration-300"
        style={{
          width,
          transformStyle: 'preserve-3d',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = `${catColor}40`;
          e.currentTarget.style.boxShadow = `0 8px 30px ${catColor}10`;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = '#21262d';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Preview area */}
        <div
          className="flex items-center justify-center relative"
          style={{
            height,
            background: `linear-gradient(135deg, ${catColor}15 0%, transparent 60%)`,
          }}
        >
          <span className="text-4xl">{project.emoji}</span>
          {featured && (
            <span
              className="absolute top-3 right-3 text-[10px] px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: `${catColor}18`, color: catColor }}
            >
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-base font-medium text-text-primary mb-1">{project.name}</h3>
          <p className="text-text-secondary text-[11px] leading-relaxed mb-3">
            {project.tagline.slice(0, 80)}...
          </p>
          <div className="flex gap-1 flex-wrap">
            {project.techStack.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[9px] px-1.5 py-0.5 rounded"
                style={{ backgroundColor: `${catColor}08`, color: catColor }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Write GalleryBand**

Write `src/components/projects/GalleryBand.tsx`:

```tsx
import type { Project } from '../../types/project';
import { categoryMeta } from '../../data/projects';
import GalleryTile from './GalleryTile';
import ScrollReveal from '../shared/ScrollReveal';

interface Props {
  categoryKey: string;
  projects: Project[];
}

export default function GalleryBand({ categoryKey, projects }: Props) {
  const meta = categoryMeta[categoryKey];
  if (!meta) return null;

  return (
    <ScrollReveal>
      <div className="mb-12">
        <div className="flex items-baseline gap-4 mb-6">
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: meta.color }} />
          <h3 className="text-lg font-medium" style={{ color: meta.color }}>
            {meta.label}
          </h3>
          <span className="text-border text-xs">{meta.count} projects</span>
        </div>

        {/* Desktop: horizontal scroll. Mobile: wrap */}
        <div className="flex gap-3 overflow-x-auto pb-4 md:overflow-visible snap-x snap-mandatory">
          {projects.map((project) => (
            <div key={project.id} className="snap-start">
              <GalleryTile project={project} featured={project.featured} />
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
```

- [ ] **Step 3: Write ProjectsPage**

Write `src/pages/ProjectsPage.tsx`:

```tsx
import StarMap from '../components/projects/StarMap';
import GalleryBand from '../components/projects/GalleryBand';
import { projects, categoryMeta } from '../data/projects';

const categoryOrder = ['frontend', 'backend', 'cli-mcp', 'mobile', 'embedded'];

export default function ProjectsPage() {
  return (
    <>
      {/* Star Map */}
      <StarMap />

      {/* Gallery */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-3">
            Project Index
          </p>
          <h2 className="text-[40px] font-light tracking-[-1px] mb-3">
            What I've built
          </h2>
          <p className="text-text-muted text-sm font-mono mb-16">
            ~ $ tree projects/ --by-category
          </p>

          {categoryOrder.map((key) => {
            const catProjects = projects.filter((p) => p.category === key);
            if (catProjects.length === 0) return null;
            return (
              <GalleryBand key={key} categoryKey={key} projects={catProjects} />
            );
          })}
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 4: Verify projects page**

```bash
npm run dev
```

Visit `/projects`. Verify star map + gallery bands. Click a tile to verify navigation (will 404 for now).

- [ ] **Step 5: Commit**

```bash
git add src/components/projects/ src/pages/ProjectsPage.tsx
git commit -m "feat: add visual gallery with category bands and interactive tiles"
```

---

## Task 9: Project Detail Page

**Files:**
- Create: `src/pages/ProjectDetailPage.tsx`
- Create: `src/components/detail/DetailHero.tsx`
- Create: `src/components/detail/OverviewSection.tsx`
- Create: `src/components/detail/MindMapArchitecture.tsx`
- Create: `src/components/detail/HighlightsSection.tsx`
- Create: `src/components/detail/ProjectDataRow.tsx`
- Create: `src/components/detail/ProjectNav.tsx`

- [ ] **Step 1: Write DetailHero**

Write `src/components/detail/DetailHero.tsx`:

```tsx
import type { Project } from '../../types/project';
import { categoryMeta } from '../../data/projects';

interface Props {
  project: Project;
}

export default function DetailHero({ project }: Props) {
  const catColor = categoryMeta[project.category]?.color ?? '#58a6ff';

  return (
    <section className="relative py-24 px-8 border-b border-white/5 overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full -translate-y-1/2 translate-x-1/4"
        style={{ background: `radial-gradient(circle, ${catColor}08 0%, transparent 70%)` }}
      />

      <div className="max-w-3xl mx-auto relative">
        <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-5">
          <span style={{ color: catColor }}>{categoryMeta[project.category]?.label}</span>
          {' · '}
          {project.meta.status === 'Live' && 'Live Demo'}
          {project.meta.status === 'Complete' && 'Completed'}
          {project.meta.status === 'Prototype' && 'Prototype'}
          {project.meta.status === 'Paused' && 'Paused'}
          {project.meta.status === 'WIP' && 'Work in Progress'}
        </p>

        <h1 className="text-[56px] font-light tracking-[-1.5px] leading-[1.08] mb-5">
          {project.name}
        </h1>

        <p className="text-text-secondary text-xl font-light max-w-xl leading-relaxed mb-10">
          {project.tagline}
        </p>

        <div className="flex gap-8">
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm border-b pb-0.5 transition-colors"
              style={{ color: catColor, borderColor: `${catColor}30` }}
            >
              Live Demo →
            </a>
          )}
          {project.links.source && (
            <a
              href={project.links.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary text-sm border-b border-text-secondary/20 pb-0.5 hover:text-text-primary transition-colors"
            >
              Source ↗
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write OverviewSection**

Write `src/components/detail/OverviewSection.tsx`:

```tsx
import type { Project } from '../../types/project';

interface Props {
  project: Project;
}

export default function OverviewSection({ project }: Props) {
  return (
    <section className="py-20 px-8">
      <div className="max-w-3xl mx-auto flex gap-14 items-start">
        {/* Image placeholder */}
        <div className="flex-shrink-0 w-60 aspect-[4/3] rounded-lg bg-surface border border-border flex items-center justify-center">
          <span className="text-5xl">{project.emoji}</span>
        </div>

        <div>
          <p className="text-text-secondary text-[11px] tracking-[2px] uppercase mb-4">
            Overview
          </p>
          <p className="text-text-primary text-[17px] leading-relaxed mb-5">
            <span className="text-white font-medium">{project.problemStatement.split('.')[0]}.</span>
          </p>
          <p className="text-text-secondary text-[15px] leading-relaxed">
            {project.description}
          </p>

          {project.isHandBuilt && (
            <p className="mt-5 text-cli text-sm">
              ✦ Built entirely by hand, without AI assistance.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Write MindMapArchitecture**

Write `src/components/detail/MindMapArchitecture.tsx`:

```tsx
import type { Project } from '../../types/project';
import { categoryMeta } from '../../data/projects';

interface Props {
  project: Project;
}

// Distribute tech stack into logical branches
function deriveBranches(techStack: string[]) {
  const branches: { name: string; items: string[]; color: string }[] = [];
  const keywords: Record<string, string[]> = {
    'UI / Framework': ['React', 'Vue', 'Svelte', 'Next.js', 'WPF', 'XAML', 'Thymeleaf', 'Bootstrap', 'Ant Design', 'ECharts'],
    'State': ['Zustand', 'Redux', 'Context', 'electron-store'],
    'Language': ['TypeScript', 'JavaScript', 'Java', 'Python', 'Go', 'C#', 'C++', 'C'],
    'Platform': ['Electron', 'Capacitor', 'Expo', 'React Native', 'Android', '.NET', 'Node.js', 'Vite'],
    'Data / Backend': ['Spring Boot', 'RabbitMQ', 'Redis', 'MySQL', 'SQLite', 'better-sqlite3', 'Docker', 'akshare', 'pandas', 'MCP SDK', 'Zod'],
    'Interaction': ['Framer Motion', '@dnd-kit', 'Canvas', 'SSE', 'WebSocket', 'Commander', 'Chokidar'],
    'Hardware': ['ESP32-S3', 'STM32', 'FreeRTOS', 'PlatformIO', 'CMSIS', 'ESP8266', 'PCB Design'],
    'Cloud / Infra': ['Bemfa Cloud', 'Netlify', 'QWeather API', 'Baidu Map SDK', 'DeepSeek API', 'fsnotify'],
  };
  const colors = ['#58a6ff', '#a78bfa', '#ff6b35', '#7ee787', '#ffa657', '#c9d1d9', '#ffa657', '#7ee787'];

  Object.entries(keywords).forEach(([name, words], idx) => {
    const matched = techStack.filter((t) =>
      words.some((w) => t.toLowerCase().includes(w.toLowerCase()))
    );
    if (matched.length > 0) {
      branches.push({ name, items: matched, color: colors[idx % colors.length] });
    }
  });

  return branches.slice(0, 6); // max 6 branches
}

export default function MindMapArchitecture({ project }: Props) {
  const branches = deriveBranches(project.techStack);
  const catColor = categoryMeta[project.category]?.color ?? '#58a6ff';
  const leftBranches = branches.slice(0, Math.ceil(branches.length / 2));
  const rightBranches = branches.slice(Math.ceil(branches.length / 2));

  return (
    <section className="py-20 px-8 border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <p className="text-text-secondary text-[11px] tracking-[2px] uppercase mb-12">
          Architecture
        </p>

        <div className="flex items-center justify-center gap-0">
          {/* Left branches */}
          <div className="flex flex-col gap-6 items-end mr-8">
            {leftBranches.map((branch) => (
              <div key={branch.name} className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-medium mb-1" style={{ color: branch.color }}>
                    {branch.name}
                  </p>
                  <div className="flex gap-1 justify-end flex-wrap">
                    {branch.items.map((item) => (
                      <span
                        key={item}
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${branch.color}08`, color: branch.color }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="w-10 h-px opacity-20" style={{ backgroundColor: branch.color }} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: branch.color }} />
              </div>
            ))}
          </div>

          {/* Center node */}
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center flex-shrink-0 text-center border-2 mx-4"
            style={{
              backgroundColor: `${catColor}08`,
              borderColor: `${catColor}30`,
            }}
          >
            <span className="text-sm font-semibold" style={{ color: catColor }}>
              {project.name}
            </span>
          </div>

          {/* Right branches */}
          <div className="flex flex-col gap-6 items-start ml-8">
            {rightBranches.map((branch) => (
              <div key={branch.name} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: branch.color }} />
                <div className="w-10 h-px opacity-20" style={{ backgroundColor: branch.color }} />
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: branch.color }}>
                    {branch.name}
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    {branch.items.map((item) => (
                      <span
                        key={item}
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${branch.color}08`, color: branch.color }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Write HighlightsSection**

Write `src/components/detail/HighlightsSection.tsx`:

```tsx
import type { Project } from '../../types/project';

interface Props {
  project: Project;
}

export default function HighlightsSection({ project }: Props) {
  return (
    <section className="py-20 px-8 border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <p className="text-text-secondary text-[11px] tracking-[2px] uppercase mb-12">
          Highlights
        </p>

        <div className="space-y-14">
          {project.highlights.map((hl, i) => (
            <div key={i}>
              <h3 className="text-lg font-medium text-text-primary mb-3">
                {String(i + 1).padStart(2, '0')} — {hl.title}
              </h3>
              <p className="text-text-secondary text-[14px] leading-relaxed">
                {hl.text}
              </p>
              {hl.code && (
                <div className="mt-4 bg-surface border border-border rounded-lg p-5 font-mono text-xs leading-relaxed overflow-x-auto">
                  <pre className="text-text-secondary whitespace-pre-wrap">{hl.code}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Write ProjectDataRow**

Write `src/components/detail/ProjectDataRow.tsx`:

```tsx
import type { Project } from '../../types/project';

interface Props {
  project: Project;
}

export default function ProjectDataRow({ project }: Props) {
  const stats = [
    { label: 'Codebase', value: project.meta.files },
    { label: 'Timeline', value: project.meta.timeline },
    { label: 'Status', value: project.meta.status, color: project.meta.status === 'Live' ? '#7ee787' : undefined },
  ];

  return (
    <section className="py-14 px-8 border-t border-white/5">
      <div className="max-w-3xl mx-auto flex gap-20">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-text-muted text-[10px] tracking-[2px] uppercase mb-2">
              {s.label}
            </p>
            <p
              className="text-[28px] font-light"
              style={{ color: s.color ?? '#c9d1d9' }}
            >
              {s.value}
            </p>
          </div>
        ))}
        {/* Tech stack summary */}
        <div>
          <p className="text-text-muted text-[10px] tracking-[2px] uppercase mb-2">
            Stack
          </p>
          <p className="text-text-secondary text-[13px]">
            {project.techStack.slice(0, 6).join(' · ')}
            {project.techStack.length > 6 && ` +${project.techStack.length - 6} more`}
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Write ProjectNav**

Write `src/components/detail/ProjectNav.tsx`:

```tsx
import { Link } from 'react-router-dom';
import { projects } from '../../data/projects';

interface Props {
  currentId: string;
}

export default function ProjectNav({ currentId }: Props) {
  const idx = projects.findIndex((p) => p.id === currentId);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx < projects.length - 1 ? projects[idx + 1] : null;

  return (
    <section className="py-10 px-8 border-t border-white/5">
      <div className="max-w-3xl mx-auto flex justify-between items-center">
        {prev ? (
          <Link to={`/projects/${prev.id}`} className="text-text-secondary text-sm hover:text-text-primary transition-colors">
            ← {prev.name}
          </Link>
        ) : (
          <span />
        )}
        <Link to="/projects" className="text-text-secondary text-sm hover:text-text-primary transition-colors">
          All projects
        </Link>
        {next ? (
          <Link to={`/projects/${next.id}`} className="text-text-secondary text-sm hover:text-text-primary transition-colors">
            {next.name} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Write ProjectDetailPage**

Write `src/pages/ProjectDetailPage.tsx`:

```tsx
import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/projects';
import DetailHero from '../components/detail/DetailHero';
import OverviewSection from '../components/detail/OverviewSection';
import MindMapArchitecture from '../components/detail/MindMapArchitecture';
import HighlightsSection from '../components/detail/HighlightsSection';
import ProjectDataRow from '../components/detail/ProjectDataRow';
import ProjectNav from '../components/detail/ProjectNav';
import { motion } from 'framer-motion';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="py-40 text-center">
        <p className="text-text-secondary text-lg">Project not found</p>
        <Link to="/projects" className="text-frontend text-sm mt-4 inline-block">
          ← Back to projects
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <DetailHero project={project} />
      <OverviewSection project={project} />
      <MindMapArchitecture project={project} />
      <HighlightsSection project={project} />
      <ProjectDataRow project={project} />
      <ProjectNav currentId={project.id} />
    </motion.div>
  );
}
```

- [ ] **Step 8: Verify detail page**

```bash
npm run dev
```

Click any project from homepage or `/projects`. Verify full editorial detail renders.

- [ ] **Step 9: Commit**

```bash
git add src/pages/ProjectDetailPage.tsx src/components/detail/
git commit -m "feat: add project detail page with editorial layout and mind map architecture"
```

---

## Task 10: Final Polish

**Files:**
- Modify: `index.html` (meta tags, title, fonts)
- Check: all pages render correctly

- [ ] **Step 1: Update index.html**

Read `index.html` and update:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Jamie — Full-Stack Developer & Vibecoder. 16 projects across 5 domains." />
    <title>Jamie | Portfolio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Full build check**

```bash
npm run build
```

Expected: no errors. Verify `dist/` output exists.

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Manual smoke test**

```bash
npm run dev
```

Checklist:
- [ ] `/` — all 5 sections render, scroll reveals animate
- [ ] `/projects` — star map drags, gallery bands scroll
- [ ] `/projects/coboard` — detail page renders all sections
- [ ] `/projects/iot-monitor` — hand-built badge shows
- [ ] Nav links work between pages
- [ ] Card hover + tilt on desktop

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: complete portfolio website — 3 pages, 16 projects, editorial design"
```

---

## Task 11: Netlify Deploy

- [ ] **Step 1: Create netlify.toml**

Write `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

- [ ] **Step 2: Build and deploy**

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

Or connect to Netlify via GitHub for auto-deploy.

- [ ] **Step 3: Verify live URL**

Open the Netlify URL. Test all pages and interactions.

- [ ] **Step 4: Commit**

```bash
git add netlify.toml
git commit -m "chore: add netlify config for SPA deployment"
```
