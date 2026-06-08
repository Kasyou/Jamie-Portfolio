import type { Project } from '../types/project';

export const projects: Project[] = [
  // ── Project 1: CoBoard (frontend, featured) ──
  {
    id: 'coboard',
    name: 'CoBoard',
    category: 'frontend',
    tagline: 'Cross-department Kanban with 4-tier permissions and Framer Motion landing page.',
    description:
      'Small-to-medium dev teams often lack visibility into cross-department progress. CoBoard solves this with a shared Kanban where each department manages their own board, while anyone can submit requests or flag blockers visible to all. Built in one week to demonstrate React ecosystem mastery.',
    problemStatement:
      "Frontend doesn't know what backend is blocking on. PM can't see actual progress. CoBoard makes team work transparent.",
    techStack: [
      'React 18',
      'TypeScript',
      'Tailwind CSS',
      'Zustand',
      '@dnd-kit',
      'Framer Motion',
      'React Router v6',
      'Lucide React',
    ],
    meta: { files: '34 TSX/TS', timeline: '1 week', status: 'Live' },
    highlights: [
      {
        title: 'Landing Page Motion Design',
        text: 'Mouse-follow radial gradient orbs using useSpring, scroll parallax cards with useScroll + useTransform, and staggered entrance animations with whileInView. Every animation serves information hierarchy.',
      },
      {
        title: 'Permission Model as Pure Functions',
        text: 'All permission logic lives in 6 pure functions in src/utils/permissions.ts. Given a user role and card type, each function returns allowed operations. Testable without a browser.',
        code: "export const canEditCard = (user: User, card: Card): boolean => {\n  if (user.role === 'pm') return true;\n  if (user.role === 'leader' && user.dept === card.dept) return true;\n  return user.id === card.authorId;\n};",
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

  // ── Project 2: AiWaifu (frontend) ──
  {
    id: 'aiwaifu',
    name: 'AiWaifu',
    category: 'frontend',
    tagline:
      'AI anime character chat with streaming SSE, multimodal input, and Android APK packaging.',
    description:
      'A pure frontend AI chat app for real-time conversation with anime characters. Supports web browser and Android APK deployment with zero backend dependency. Features character creation, style learning, and location awareness.',
    problemStatement:
      'Anime fans want immersive character interactions. AiWaifu delivers streaming conversations with personality — no server needed.',
    techStack: [
      'React 18',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Zustand',
      'Capacitor 8',
      'SSE',
    ],
    meta: { files: '22 TSX/TS', timeline: '2 weeks', status: 'Live' },
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

  // ── Project 3: ccMonitor (frontend) ──
  {
    id: 'ccmonitor',
    name: 'ccMonitor',
    category: 'frontend',
    tagline:
      'Windows desktop companion for Claude Code with real-time status monitoring and DeepSeek API dashboard.',
    description:
      'A WPF desktop app that monitors Claude Code working status via file watcher, displays DeepSeek API usage and balance, and provides a terminal-style log console. Features cat-themed pixel art status indicators.',
    problemStatement:
      'Claude Code runs in terminal. ccMonitor gives it a visual dashboard — status, costs, logs — always visible on the desktop.',
    techStack: ['C#', '.NET 8', 'WPF', 'XAML', 'DeepSeek API', 'DPAPI'],
    meta: { files: '~15 files', timeline: '3 days', status: 'Complete' },
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

  // ── Project 4: CrossBorderWorkflow (frontend) ──
  {
    id: 'crossborder-workflow',
    name: 'CrossBorderWorkflow',
    category: 'frontend',
    tagline:
      'Cross-border e-commerce management desktop app with multi-platform order sync and AI translation.',
    description:
      'An Electron + React + Ant Design desktop application for managing cross-border e-commerce operations. Handles orders, inventory, products, and warehouses with AI-powered listing translation and automated logistics tracking.',
    problemStatement:
      'Cross-border sellers juggle Temu, Amazon, Shopee, TikTok. This app centralizes everything with AI assistance.',
    techStack: [
      'Electron 31',
      'React 18',
      'TypeScript',
      'Ant Design 5',
      'ECharts',
      'Zustand',
      'better-sqlite3',
      'xlsx',
    ],
    meta: { files: '~40 files', timeline: 'Ongoing', status: 'WIP' },
    highlights: [
      {
        title: '30+ IPC Channels',
        text: 'Electron main process handles 30+ IPC channels for file system access, database operations, and system tray integration.',
      },
      {
        title: 'AI Translation Adapter',
        text: 'Configurable AI provider (DeepSeek/OpenAI) for product listing translation. Adapter pattern allows swapping without changing business logic.',
      },
    ],
    links: {},
    isHandBuilt: false,
    featured: false,
    emoji: '📦',
  },

  // ── Project 5: RussiaBlock (frontend) ──
  {
    id: 'russiablock',
    name: 'RussiaBlock',
    category: 'frontend',
    tagline:
      'Classic Tetris desktop game with Canvas rendering and Electron packaging for Windows.',
    description:
      'A fully-featured Tetris game with Canvas-based rendering, dark space-themed UI, glassmorphism panels, and Electron packaging into portable EXE and NSIS installer.',
    problemStatement:
      'A nostalgic game rebuilt with modern tooling — demonstrating Canvas game loop mastery and desktop packaging.',
    techStack: ['HTML5 Canvas', 'Electron 33', 'JavaScript', 'electron-builder'],
    meta: { files: '2 files', timeline: '1 day', status: 'Complete' },
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

  // ── Project 6: AsynSMS (backend, featured) ──
  {
    id: 'asynsms',
    name: 'AsynSMS',
    category: 'backend',
    tagline:
      'Enterprise SMS dispatch system with triple-guarantee message reliability and Docker one-click deploy.',
    description:
      'An enterprise-grade bulk SMS push system with RabbitMQ dead-letter queues, Redis Lua-scripted token bucket rate limiting, and a real-time progress dashboard. 48/48 integration tests passing.',
    problemStatement:
      "SMS delivery must be reliable at scale. Messages can't be lost, rate limits must be respected, failures must be traceable.",
    techStack: [
      'Spring Boot 3.5',
      'Java 21',
      'RabbitMQ 4.0',
      'Redis 7',
      'MySQL 8.0',
      'Docker',
      'Thymeleaf',
      'Bootstrap 5',
    ],
    meta: { files: '44 Java', timeline: '2 weeks', status: 'Complete' },
    highlights: [
      {
        title: 'Triple-Guarantee Reliability',
        text: 'Publisher Confirm + Manual ACK + Dead Letter Queue. Every message tracked from production to consumption. Custom retry logic avoids Spring default head-of-line blocking.',
      },
      {
        title: 'Redis Token Bucket Rate Limiting',
        text: 'Atomic Lua-scripted token bucket in Redis prevents exceeding provider rate limits. Distributed-safe across multiple app instances.',
        code: "-- Lua script: atomic token bucket\nlocal key = KEYS[1]\nlocal capacity = tonumber(ARGV[1])\nlocal now = tonumber(ARGV[2])\nlocal tokens = tonumber(redis.call('get', key) or capacity)\nif tokens > 0 then\n  redis.call('set', key, tokens - 1)\n  return 1\nend\nreturn 0",
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

  // ── Project 7: FinancialSystem (backend) ──
  {
    id: 'financial-system',
    name: 'FinancialSystem',
    category: 'backend',
    tagline:
      'A-share stock trading simulation with real market data, 3 strategies, and event-driven backtest engine.',
    description:
      'A Python-based A-share stock and mutual fund trading simulation using free akshare data. Features event-driven backtesting, 3 built-in strategies, configurable risk controls, and a broker abstraction layer for live trading.',
    problemStatement:
      'Strategy validation requires real data and realistic fee modeling. This system provides professional-grade simulation without paid data feeds.',
    techStack: [
      'Python 3.10+',
      'akshare',
      'pandas',
      'numpy',
      'matplotlib',
      'SQLite',
      'PyYAML',
    ],
    meta: { files: '25 Python', timeline: '1 week', status: 'Complete' },
    highlights: [
      {
        title: 'Realistic A-Share Fee Modeling',
        text: 'Full T+1 settlement with commission (min 5 CNY), stamp tax (0.1% sell only), transfer fee, and slippage. Matches real trading costs.',
      },
      {
        title: 'Strategy Comparison Pipeline',
        text: 'demo.py runs all 3 strategies against the same data, outputs comparison table and equity curve chart.',
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

  // ── Project 8: ContentPlatform (backend) ──
  {
    id: 'content-platform',
    name: 'ContentPlatform',
    category: 'backend',
    tagline:
      'AI-driven multi-platform content creation pipeline producing technical articles across 4 Chinese platforms.',
    description:
      'An autonomous content operation system using Claude Code as the content engine. Produces weekly 3000-word technical articles adapted for Zhihu, Juejin, CSDN, and WeChat with branded identity and data-driven topic selection.',
    problemStatement:
      'Content marketing at scale requires consistency. This pipeline automates research, writing, and adaptation while maintaining quality.',
    techStack: ['Claude Code', 'Markdown', 'JSON', 'Analytics'],
    meta: { files: '~15 files', timeline: 'Ongoing', status: 'Paused' },
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

  // ── Project 9: MCPX (cli-mcp, featured) ──
  {
    id: 'mcpx',
    name: 'MCPX',
    category: 'cli-mcp',
    tagline:
      '"Next.js for MCP" — TypeScript framework reducing MCP server development complexity by 60%.',
    description:
      'A TypeScript framework that reduces MCP server development from 42 lines of boilerplate to 17. One function per MCP tool, zero boilerplate, full type inference. Includes CLI scaffolding, hot reload dev server, and 4 example servers.',
    problemStatement:
      'Raw MCP SDK requires repetitive boilerplate for every tool. MCPX makes server creation as simple as defining a function.',
    techStack: [
      'TypeScript',
      'Node.js',
      '@modelcontextprotocol/sdk',
      'Zod',
      'Commander',
      'Chokidar',
      'Vitest',
    ],
    meta: { files: '~15 files', timeline: '3 days', status: 'Live' },
    highlights: [
      {
        title: '60% Less Code',
        text: 'Side-by-side comparison: 42 lines with raw SDK vs 17 with MCPX. The mcpx() factory chains .tool() calls with auto-generated Zod schemas.',
      },
      {
        title: '111-Line Core',
        text: 'The entire framework core fits in 111 lines. Compact enough to audit in 5 minutes, powerful enough to build production MCP servers.',
      },
      {
        title: 'CLI with Hot Reload',
        text: 'mcpx init scaffolds a new project. mcpx dev runs with file-watching hot reload. mcpx build bundles for distribution.',
      },
    ],
    links: {},
    isHandBuilt: false,
    featured: true,
    emoji: '⚡',
  },

  // ── Project 10: VibeView (cli-mcp) ──
  {
    id: 'vibeview',
    name: 'VibeView',
    category: 'cli-mcp',
    tagline:
      'CLI tool giving Claude Code visual output — real-time browser whiteboard and design preview with 9 MCP tools.',
    description:
      'A Go binary that embeds a web renderer and MCP server. Two modes: Whiteboard (mind maps, tables, analysis cards) and Design Preview (device-framed UI with hot reload and console forwarding).',
    problemStatement:
      'Claude Code is text-only. VibeView adds visual output — whiteboards for thinking, device previews for UI work.',
    techStack: [
      'Go 1.23',
      'WebSocket',
      'Mermaid.js',
      'fsnotify',
      'gorilla/websocket',
    ],
    meta: { files: '~20 Go', timeline: '1 week', status: 'Complete' },
    highlights: [
      {
        title: '9 MCP Tools',
        text: 'preview_show, preview_clear, preview_screenshot, preview_inspect, preview_console, preview_diff, preview_reload, preview_stop — each maps to a single browser action.',
      },
      {
        title: 'Single Binary Distribution',
        text: '12 MB compiled binary with embedded renderer, Mermaid.js, and web server. Zero dependencies — download and run.',
      },
    ],
    links: {},
    isHandBuilt: false,
    featured: false,
    emoji: '👁',
  },

  // ── Project 11: ExpenseTracker (mobile) ──
  {
    id: 'expense-tracker',
    name: 'ExpenseTracker',
    category: 'mobile',
    tagline:
      'Clean personal expense tracker with cycle-based budgeting, category statistics, and Excel export.',
    description:
      'A React Native + Expo mobile app for personal finance tracking. Features a custom NumberPad, cycle-based accounting, category statistics, and 3-sheet Excel export. Local-first architecture with SQLite.',
    problemStatement:
      'Most finance apps are bloated or cloud-dependent. ExpenseTracker is local-first, fast, and focused on tracking spending.',
    techStack: [
      'React Native 0.81',
      'Expo SDK 54',
      'TypeScript',
      'expo-sqlite',
      'expo-router',
      'xlsx',
    ],
    meta: { files: '~25 TSX', timeline: '1 week', status: 'Complete' },
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
        text: 'One-tap export generates a workbook with cycle summary, category breakdown, and full transaction detail.',
      },
    ],
    links: {},
    isHandBuilt: false,
    featured: false,
    emoji: '💰',
  },

  // ── Project 12: WeatherReport (mobile, hand-built) ──
  {
    id: 'weather-report',
    name: 'WeatherReport',
    category: 'mobile',
    tagline:
      'Full-stack Android weather app with MVVM architecture, custom windmill animation, and 3-level city picker.',
    description:
      'A graduation project Android app using Java + MVVM + Room + Retrofit. Features real-time weather from QWeather API, 7-day forecast, 9 lifestyle indices, Baidu Map auto-location, and a hand-drawn Canvas windmill animation. Entirely hand-coded without AI assistance.',
    problemStatement:
      'A comprehensive Android learning project covering MVVM architecture, network layer abstraction, database migration, and custom View rendering.',
    techStack: [
      'Android Java',
      'MVVM',
      'Room 2.4',
      'Retrofit 2.9',
      'RxJava 2',
      'Baidu Map SDK',
      'QWeather API',
    ],
    meta: { files: '62 Java', timeline: 'Semester', status: 'Complete' },
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
        text: 'All 62 Java source files written independently. Library module demonstrates architectural thinking.',
      },
    ],
    links: {},
    isHandBuilt: true,
    featured: false,
    emoji: '🌤',
  },

  // ── Project 13: MusicPlayer (mobile) ──
  {
    id: 'music-player',
    name: 'MusicPlayer',
    category: 'mobile',
    tagline:
      'Desktop local music player built with Electron + React 19, featuring sidebar navigation and persistent player bar.',
    description:
      'An Electron desktop music player with React 19 frontend. Features AppShell layout with sidebar navigation, main content area, and persistent bottom player bar. Dark-themed with CSS custom properties.',
    problemStatement:
      'A scaffolded desktop app demonstrating Electron + latest React integration patterns with proper security.',
    techStack: ['Electron 33', 'React 19', 'TypeScript', 'Vite 6', 'CSS Modules'],
    meta: { files: '~10 files', timeline: 'Scaffolded', status: 'WIP' },
    highlights: [
      {
        title: 'Context Isolation by Default',
        text: 'Preload script exposes safe app info via contextBridge. No nodeIntegration — secure by design.',
      },
      {
        title: 'Latest React 19',
        text: 'Built with React 19 (latest major version at time of build). Ready-to-show optimization avoids white flash on app launch.',
      },
    ],
    links: {},
    isHandBuilt: false,
    featured: false,
    emoji: '🎵',
  },

  // ── Project 14: TinyRobot (embedded, featured) ──
  {
    id: 'tinyrobot',
    name: 'TinyRobot',
    category: 'embedded',
    tagline:
      '$11 ESP32-S3 desktop companion robot with 4 gravity-switched modes, custom TCP protocol, and interactive 3D model.',
    description:
      'A low-cost desktop cubic companion robot. Gravity sensing (MPU6050) switches between animated face, NTP clock, weather display, and Pomodoro timer. PC Link mode streams screen via custom TCP protocol. Dual-core FreeRTOS architecture.',
    problemStatement:
      'Can a useful desktop companion be built for $11? TinyRobot proves yes — with personality, utility, and hackability.',
    techStack: [
      'C++',
      'ESP32-S3',
      'FreeRTOS',
      'PlatformIO',
      'ST7789',
      'MPU6050',
      'WiFi',
      'Custom TCP Protocol',
    ],
    meta: { files: '17 files', timeline: '2 weeks', status: 'Complete' },
    highlights: [
      {
        title: 'Custom Binary TCP Protocol',
        text: '4-byte sync word + command byte + 2-byte length + payload + CRC. Supports full RGB565 frame pushes, text overlay, and WiFi credential config. Discovered via mDNS.',
        code: '// Protocol frame structure\n// AA 55 01 FF | CMD | LEN_H | LEN_L | PAYLOAD... | CRC',
      },
      {
        title: 'Dual-Core FreeRTOS Architecture',
        text: 'Core 0: UI rendering (1Hz heartbeat LED). Core 1: 100Hz sensor poll + mode manager + TCP server + power monitor. Mutex-protected mode transitions.',
      },
      {
        title: 'Power-Aware WiFi Management',
        text: 'Reference-counted WiFi requests from subsystems. WiFi only active when needed. Expression mode runs ~17h on 1200mAh battery.',
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

  // ── Project 15: TrafficLight (embedded) ──
  {
    id: 'trafficlight',
    name: 'TrafficLight',
    category: 'embedded',
    tagline:
      'Bare-metal STM32F103 register-level LED controller with custom linker script and dual build system.',
    description:
      'A register-level CMSIS project on STM32F103VET6. Two buttons cycle RGB LED color and toggle on/off. No HAL, no standard peripheral library — every register write is explicit. Includes custom linker script, Makefile (ARM GCC), and Keil MDK project.',
    problemStatement:
      'Most STM32 tutorials use HAL. This project proves understanding at the silicon level — clock configuration, GPIO registers, atomic bit operations.',
    techStack: [
      'C',
      'STM32F103VET6',
      'CMSIS',
      'ARM GCC',
      'Makefile',
      'Keil MDK',
    ],
    meta: { files: '~10 files', timeline: '1 day', status: 'Complete' },
    highlights: [
      {
        title: 'Register-Level Bare Metal',
        text: 'Every peripheral configured via direct register writes. RCC clock enable, GPIO CRL/CRH mode configuration, BSRR/BRR atomic bit operations for glitch-free LED transitions.',
        code: '// Direct register manipulation — no HAL\nRCC->APB2ENR |= RCC_APB2ENR_IOPBEN;\nGPIOB->CRL &= ~(0xF << 0);\nGPIOB->CRL |= (0x3 << 0);  // PB0: 50MHz push-pull\nGPIOB->BSRR = GPIO_BSRR_BS0;  // Atomic set',
      },
      {
        title: 'Custom Linker Script',
        text: 'Hand-written STM32F103VETx_FLASH.ld defining memory regions (512K Flash, 64K SRAM), section placement, and stack/heap sizing.',
      },
    ],
    links: {},
    isHandBuilt: false,
    featured: false,
    emoji: '💡',
  },

  // ── Project 16: IoT Monitor (embedded, hand-built) ──
  {
    id: 'iot-monitor',
    name: 'IoT Monitor',
    category: 'embedded',
    tagline:
      'STM32 environmental IoT system with ESP8266 cloud upload, WeChat mini-program, and self-designed PCB.',
    description:
      'A complete embedded IoT environmental monitoring system. STM32F103C8T6 reads DHT11 + MQ-4 sensors, displays on LCD/OLED, triggers alarms, and uploads to Bemfa Cloud via ESP8266 WiFi for WeChat mini-program remote monitoring. Three firmware iterations, self-designed PCB.',
    problemStatement:
      'A full-stack embedded project spanning hardware design, firmware, cloud integration, and documentation — built manually without AI.',
    techStack: [
      'C',
      'STM32F103C8T6',
      'ESP8266',
      'DHT11',
      'MQ-4',
      'PCB Design',
      'Bemfa Cloud',
    ],
    meta: { files: '~30 C files', timeline: 'Semester', status: 'Complete' },
    highlights: [
      {
        title: 'Three Firmware Iterations',
        text: 'Standard Lib + LCD1602 → Standard Lib + OLED + Bemfa Cloud → HAL + CubeMX + PID light control + DMA ADC. Each iteration used different development paradigms.',
      },
      {
        title: 'Self-Designed PCB',
        text: 'Full PCB designed in both Altium Designer and EasyEDA. Bit-reversed LCD data bus required a software fix — compensating for reversed wiring without re-spinning the board.',
      },
      {
        title: 'Hand-Built Without AI',
        text: 'All firmware written independently. ESP8266 AT-command parsing with hand-rolled strstr() checks. No cloud SDK — raw HTTP via sprintf().',
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

export const categoryMeta: Record<
  string,
  { label: string; color: string; count: number }
> = {
  frontend: { label: 'Frontend', color: '#58a6ff', count: 5 },
  backend: { label: 'Backend', color: '#7ee787', count: 3 },
  'cli-mcp': { label: 'CLI / MCP', color: '#a78bfa', count: 2 },
  mobile: { label: 'Mobile', color: '#ff6b35', count: 3 },
  embedded: { label: 'Embedded', color: '#ffa657', count: 3 },
};
