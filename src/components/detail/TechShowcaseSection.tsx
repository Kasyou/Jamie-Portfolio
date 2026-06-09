import { useRef, useCallback } from 'react';
import type { Project } from '../../types/project';

interface ShowcaseItem {
  title: string;
  text: string;
  image?: string;
  imageRight?: boolean;
  code?: string;
}

interface Props { project: Project; }

// Per-project showcase data
const showcaseData: Record<string, ShowcaseItem[]> = {
  'aiwaifu': [
    {
      title: 'SSE 流式对话引擎',
      text: 'AiWaifu 的核心交互基于 Server-Sent Events，通过 OpenAI 兼容 API 的 stream 模式实现逐 token 输出，前端用 ReadableStream 逐块解析 SSE 数据帧。\n\n相比 WebSocket，SSE 更轻量——单向服务器推送无需客户端心跳维护，天然支持 HTTP/2 多路复用，断线后浏览器自动重连。每个 data: 帧携带一个 JSON chunk，包含 delta.content（增量文本）和 finish_reason（结束标记）。打字机效果通过逐帧追加到 React state 实现，配合 CSS transition 产生平滑的"正在输入"视觉反馈。\n\n多模态检测通过预检模型名称实现：GPT-4o / Claude 3.5 等视觉模型自动启用以 base64 嵌入图片，纯文本模型回退为文字描述。    \n\n## Capacitor 跨平台封装\nAiWaifu 通过 Capacitor 8 实现一套 React 代码同时产出 Web 应用和 Android APK。Capacitor 作为 Web-to-Native 桥接层，将浏览器 API 映射为原生调用，同时暴露 @capacitor/app 的 backButton 事件处理 Android 返回键。构建流程为 Vite 打包 → Capacitor copy 同步 android/ → Android Studio 编译 APK，环境检测脚本自动检查 JDK 21 + Android SDK 35，阿里云 Maven 镜像加速国内构建。APK 内所有数据存储在 WebView localStorage，与浏览器版本行为完全一致。',
      imageRight: true,
      code: `// SSE streaming handler\nconst response = await fetch(apiUrl, {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ model, messages, stream: true }),\n});\n\nconst reader = response.body!.getReader();\nconst decoder = new TextDecoder();\nlet fullContent = '';\n\nwhile (true) {\n  const { done, value } = await reader.read();\n  if (done) break;\n  const chunk = decoder.decode(value, { stream: true });\n  const lines = chunk.split('\\n').filter(l => l.startsWith('data: '));\n  for (const line of lines) {\n    const json = JSON.parse(line.slice(6));\n    if (json.choices[0].finish_reason) return fullContent;\n    fullContent += json.choices[0].delta.content || '';\n    setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: fullContent }]);\n  }\n}`,
    },
    {
      title: 'Zustand 角色与对话管理',
      text: '使用 Zustand 管理角色列表和对话状态，配合 persist 中间件实现 localStorage 持久化。所有数据存于客户端——角色配置、对话历史、API 设置——零后端依赖。\n\n角色 store 管理 2 个预设角色 + 用户自定义角色，每个角色包含 System Prompt、头像（SVG 首字母 / emoji / 自定义图片）和对话历史。AI 角色生成通过调用 API 根据用户描述自动生成角色名、性格标签和 emoji 头像。对话 store 维护多角色独立会话，支持导出/导入 JSON（含格式校验和时间戳修复）。\n\n时间/位置感知通过 System Prompt 动态注入实现：当检测到用户提及时间或天气时，自动将当前日期、星期和 GPS 坐标插入上下文，让角色拥有"真实世界感知"。\n\n## 时间与位置感知系统\nAiWaifu 的 System Prompt 具备动态上下文注入能力。当用户消息包含时间关键词（"几点"、"今天几号"）或天气关键词（"天气"、"下雨"）时，系统自动附加当前日期、星期和 GPS 坐标。位置通过浏览器 Geolocation API 获取，反向地理编码转为城市名嵌入 Prompt。时间精确到分钟并标注 UTC+8 时区。注入逻辑全在前端完成，System Prompt 在发送请求前动态拼接，无需后端支持。',
      imageRight: false,
      code: `// characterStore.ts\nimport { create } from 'zustand';\nimport { persist } from 'zustand/middleware';\n\nexport const useCharacterStore = create<CharacterState>()(\n  persist((set, get) => ({\n    characters: [...PRESET_CHARACTERS],\n    activeId: PRESET_CHARACTERS[0].id,\n    \n    createCharacter: (name, persona) => set(s => ({\n      characters: [...s.characters, {\n        id: nanoid(), name, persona,\n        avatar: generateEmojiAvatar(persona),\n        systemPrompt: buildSystemPrompt(name, persona),\n        createdAt: Date.now(),\n      }],\n    })),\n    \n    updateSystemPrompt: (id, suggestion) => set(s => ({\n      characters: s.characters.map(c =>\n        c.id === id\n          ? { ...c, systemPrompt: optimizePrompt(c.systemPrompt, suggestion) }\n          : c),\n    })),\n  }), { name: 'aiwaifu-characters' })\n);`,
    },
  ],
  'ccmonitor': [
    {
      title: 'WPF 状态监控系统',
      text: 'ccMonitor 通过文件监听机制实时监控 Claude Code 的运行状态。Claude Code 在运行时将当前状态写入 claude_status.txt 文件，ccMonitor 以可配置间隔（500-2000ms）轮询该文件，解析状态字段并更新 UI 四个状态态——Idle（空闲）、Working（工作中）、Alert（警报）、Done（完成）。\n\n状态检测基于文件内容变化而非简单的文件存在性判断，避免了临时文件写入导致的误判。轮询间隔动态调整：Idle 状态时降至 2000ms 降低资源占用，Working 状态时提升至 500ms 保证响应速度。应用程序最小化到系统托盘时仍保持后台监控，任务栏图标随状态变化实时更新。\n\n手动覆盖命令支持 idle/busy/alert/refresh 四种状态切换，用于调试或者 Claude Code 未运行时独立展示状态面板。\n\n## 猫咪主题 UI 设计\nccMonitor 的界面围绕四只定制像素猫咪构建——每只猫对应一个工作状态，Idle 时猫咪打盹、Working 时猫咪忙碌、Alert 时猫咪警戒、Done 时猫咪完成。猫咪像素艺术通过 16×16 网格手绘，使用有限的调色板保持复古像素风格。主窗口采用 WPF 的透明背景和圆角设计，配合 DropShadowEffect 实现现代桌面应用的悬浮感。状态切换时猫咪图标带淡入淡出过渡动画，避免突兀跳变。主窗口、设置窗口和日志窗口各自独立但共享同一 ViewModel 实例，确保状态在所有窗口间同步。',
      imageRight: true,
      code: `// Status monitoring via file watcher\npublic class StatusMonitor\n{\n    private FileSystemWatcher? _watcher;\n    private Timer? _pollTimer;\n\n    public void StartMonitoring(string statusFilePath)\n    {\n        _pollTimer = new Timer(async _ =>\n        {\n            if (File.Exists(statusFilePath))\n            {\n                var content = await File.ReadAllTextAsync(statusFilePath);\n                var status = ParseStatus(content);\n                UpdateUI(status);\n                _pollTimer.Change(\n                    status == Status.Idle ? 2000 : 500,\n                    Timeout.Infinite);\n            }\n        }, null, 0, 500);\n    }\n\n    private Status ParseStatus(string content) => content.Trim() switch\n    {\n        \"working\" => Status.Working,\n        \"alert\" => Status.Alert,\n        \"done\" => Status.Done,\n        _ => Status.Idle\n    };\n}`,
    },
    {
      title: 'DeepSeek API 集成',
      text: 'ccMonitor 内置 DeepSeek API 用量监控面板，实时展示当日 Token 消耗和账户余额。API 密钥通过 Windows DPAPI（ProtectedData.Protect）加密后存储在本地，解密时使用当前用户上下文（DataProtectionScope.CurrentUser），确保其他用户或进程无法读取。\n\n用量数据通过 DeepSeek API 的 /user/balance 和 /usage 端点获取，按模型类型（V4 Flash / V4 Pro）分别展示 Token 消耗量。Settings 窗口提供密钥管理界面：绑定/更换 API Key、配置状态文件路径、调整轮询间隔。Claude Code 版本和模型通过解析 settings.json 自动检测，无需手动配置。\n\n日志控制台支持 500 条缓冲，带时间戳和状态标签的格式化输出，支持滚动查看历史记录。系统声音集成 Windows SystemSounds，Alert 状态触发 Exclamation，Done 状态触发 Asterisk。\n\n## Settings 配置系统\nccMonitor 提供独立的设置窗口管理所有可配置项：API Key 绑定与更换、状态文件路径自定义、轮询间隔调整（100-5000ms）。所有设置通过 WPF 的 Properties.Settings 持久化到本地 app.config，应用启动时自动加载。设置窗口与主窗口通过事件总线通信——修改配置后主窗口无需重启即可即时生效。Claude Code 版本和当前模型通过解析 settings.json 自动检测，显示在主窗口底部的状态栏中，让用户一目了然地知道正在监控的 Claude Code 实例信息。',
      imageRight: false,
      code: `// DPAPI encryption for API key storage\npublic static class ApiKeyManager\n{\n    private static readonly byte[] Entropy =\n        Encoding.UTF8.GetBytes(\"ccMonitorKey\");\n\n    public static void SaveApiKey(string key)\n    {\n        var bytes = Encoding.UTF8.GetBytes(key);\n        var encrypted = ProtectedData.Protect(\n            bytes, Entropy,\n            DataProtectionScope.CurrentUser);\n        File.WriteAllBytes(\n            Path.Combine(AppData, \"apikey.dat\"), encrypted);\n    }\n\n    public static string LoadApiKey()\n    {\n        var encrypted = File.ReadAllBytes(\n            Path.Combine(AppData, \"apikey.dat\"));\n        var bytes = ProtectedData.Unprotect(\n            encrypted, Entropy,\n            DataProtectionScope.CurrentUser);\n        return Encoding.UTF8.GetString(bytes);\n    }\n}`,
    },
  ],
  'coboard': [
    {
      title: 'Framer Motion 动效系统',
      text: '落地页使用 Framer Motion 构建了三层动效体系，每个动画都服务于信息层级而非纯装饰。\n\n第一层——鼠标跟随光球：通过 useSpring 绑定鼠标坐标，两个径向渐变光球实时跟踪光标位置移动，营造出页面在"呼吸"的沉浸感。第二层——滚动视差卡片：useScroll 获取页面滚动进度，useTransform 将滚动值映射为卡片的 Y 轴位移和缩放，三张特性卡片以不同速率移动，产生深度视差效果。第三层——交错入场动画：whileInView 触发，每个元素以 100ms 的延迟差依次淡入上移，引导视线按设计意图逐层扫描内容。\n\n所有动画均配置了 reduced-motion 媒体查询的降级方案，尊重用户的系统无障碍偏好。整个动效系统的核心代码不到 80 行，但覆盖了从微交互到页面级转场的完整需求。',
      imageRight: true,
      code: `// 鼠标跟随光球\nconst springX = useSpring(x, { stiffness: 100, damping: 30 });\nconst springY = useSpring(y, { stiffness: 100, damping: 30 });\n\n// 滚动视差卡片\nconst { scrollY } = useScroll();\nconst y1 = useTransform(scrollY, [0, 500], [0, -100]);\nconst opacity = useTransform(scrollY, [0, 300], [1, 0]);\n\n// 交错入场\n<motion.div\n  initial={{ opacity: 0, y: 40 }}\n  whileInView={{ opacity: 1, y: 0 }}\n  transition={{ delay: index * 0.1, duration: 0.5 }}\n/>`,
    },
    {
      title: 'Zustand 状态管理',
      text: '选择 Zustand 而非 Redux——CoBoard 的状态管理需求适中（5 个 store），不需要 Redux 的样板代码开销。\n\nZustand 的 API 极简：一个 create() 函数定义 store，直接在组件中按需订阅单个字段，避免了 React Context 的全量重渲染问题。配合 persist 中间件，所有 store 自动同步 localStorage，用户刷新页面后看板状态、卡片位置、部门配置全部保留。\n\n5 个 store（board / user / card / dashboard / settings）各自独立管理领域，互不依赖，修改一个不影响其他。TypeScript 泛型推导让 dispatch 调用拥有完整的类型提示，无需额外定义 action type。选择 Zustand 的另一个关键原因是 bundle size——仅 1.1KB gzipped，比 Redux Toolkit 小 10 倍。',
      imageRight: false,
      code: `// stores/boardStore.ts\nimport { create } from 'zustand';\nimport { persist } from 'zustand/middleware';\n\nexport const useBoardStore = create<BoardState>()(\n  persist(\n    (set) => ({\n      cards: [],\n      moveCard: (id, to) => set((s) => ({\n        cards: s.cards.map((c) =>\n          c.id === id ? { ...c, column: to } : c),\n      })),\n      toggleBlocked: (id) => set((s) => ({\n        cards: s.cards.map((c) =>\n          c.id === id ? { ...c, blocked: !c.blocked } : c),\n      })),\n    }),\n    { name: 'coboard-board' }\n  )\n);`,
    },
    {
      title: '权限矩阵设计',
      text: 'CoBoard 的权限系统是整个应用的核心，设计耗时超过编码。采用纯函数架构，所有权限判断集中在 6 个函数中，输入用户角色和卡片类型，输出布尔值——无副作用、无全局状态、可独立测试。\n\n三个角色（PM / Leader / Member）× 三种卡片类型（需求 / Bug / 任务）× 六种操作（查看 / 创建 / 编辑 / 删除 / 移动 / 评论）= 54 种权限组合。但通过纯函数分层（通用规则 → 角色规则 → 特殊规则），实际代码仅 80 行。任何组件调用同一个函数，权限规则的单点变更立即在全站生效。\n\n类型安全方面，User 和 UserSafe 类型分离确保密码永远不会到达前端——TypeScript 在编译期强制执行了代码审查才能发现的安全问题。',
      imageRight: true,
      code: `// src/utils/permissions.ts — 6 个纯函数，零依赖\n\nexport const canEditCard = (user: User, card: Card): boolean => {\n  if (user.role === 'pm') return true;\n  if (user.role === 'leader' && user.dept === card.dept) return true;\n  return user.id === card.authorId;\n};\n\nexport const canDeleteCard = (user: User, card: Card): boolean =>\n  user.role === 'pm' || user.id === card.authorId;\n\nexport const canMoveCard = (user: User, card: Card): boolean =>\n  user.role === 'pm' || user.role === 'leader';\n\nexport const canToggleBlock = (user: User, card: Card): boolean =>\n  user.role === 'pm' || (user.role === 'leader' && user.dept === card.dept);`,
    },
    {
      title: '@dnd-kit 拖拽系统',
      text: '拖拽是 Kanban 的核心交互，选型时对比了 react-beautiful-dnd（维护停滞）和 @dnd-kit（活跃开发、TypeScript 优先），最终选择后者。\n\n使用 closestCorners 碰撞检测算法——当卡片拖到两列交界处时，算法根据卡片中心点与各列四角的距离判断目标列，比 closestCenter 更精准。SortableContext 包裹每列的卡片列表，确保拖拽时卡片间有流畅的位移动画。pointer sensor 适配移动端触摸操作，keyboard sensor 提供完整的键盘无障碍支持（Tab 切换卡片、Space 提起、方向键移动、Space 放下）。\n\n每个部门拥有独立的 DndContext 和 SortableContext，互不干扰。跨部门拖拽时，源列和目标列通过全局回调通信，自动更新卡片所属部门和权限上下文。',
      imageRight: false,
      code: `// BoardColumn.tsx — 单列拖拽容器\nimport { useDroppable } from '@dnd-kit/core';\nimport { SortableContext } from '@dnd-kit/sortable';\n\nconst BoardColumn = ({ column, cards }: Props) => {\n  const { setNodeRef, isOver } = useDroppable({ id: column.id });\n\n  return (\n    <div ref={setNodeRef} className={isOver ? 'drop-active' : ''}>\n      <h3>{column.title} ({cards.length})</h3>\n      <SortableContext items={cards.map((c) => c.id)}>\n        {cards.map((card) => <SortableCard key={card.id} card={card} />)}\n      </SortableContext>\n    </div>\n  );\n};`,
    },
  ],
  'crossborder-workflow': [
    {
      title: 'Electron IPC 架构',
      text: 'CrossBorderWorkflow 基于 Electron 31 构建，主进程（Main Process）与渲染进程（Renderer）通过 IPC（Inter-Process Communication）通信。主进程负责所有系统级操作——文件系统读写（订单 Excel 导入导出）、SQLite 数据库操作、系统托盘管理、自动更新检测——渲染进程仅处理 UI 渲染和用户交互。\n\n30+ IPC 通道通过 electron-vite 的 preload 脚本暴露给渲染进程，使用 contextBridge 安全地桥接 API，避免直接暴露 Node.js 能力。每个 IPC 通道有明确的请求-响应契约，主进程端的 handler 统一处理错误并返回标准化结果。数据库操作通过 better-sqlite3 同步 API 执行，利用 Electron 的多进程架构避免阻塞 UI 线程。\n\n系统托盘集成让应用最小化后仍在后台运行，托盘菜单提供快速操作入口（查看今日订单、同步数据、打开主窗口）。每日自动备份通过 node-cron 定时任务将 SQLite 数据库文件复制到备份目录，保留最近 7 天的历史版本。\n\n## Zustand 状态管理\n应用使用 7 个 Zustand store 分别管理各业务领域（dashboard、inventory、order、platform、product、settings、warehouse），每个 store 独立负责自己的状态和操作，互不依赖。store 通过 persist 中间件将关键配置（如平台 API 密钥、仓库默认设置）持久化到 localStorage，UI 状态（如当前选中的订单、筛选条件）保持在内存中。组件通过细粒度选择器订阅状态字段，避免不必要的重渲染——例如订单列表组件只订阅 orders 数组，不会因为 inventory 状态变化而重新渲染。',
      imageRight: true,
      code: `// main.ts — Electron 主进程 + 30+ IPC handlers\nconst mainWindow = new BrowserWindow({\n  webPreferences: {\n    preload: join(__dirname, 'preload.js'),\n    contextIsolation: true,\n    nodeIntegration: false,\n  },\n});\n\n// Order management IPC\nipcMain.handle('orders:list', async (_, filter) =>\n  dbRepo.orders.findAll(filter));\nipcMain.handle('orders:import', async (_, filePath) =>\n  xlsxParser.parse(filePath));\nipcMain.handle('orders:merge', async (_, orderIds) =>\n  dbRepo.orders.merge(orderIds));\n\n// Inventory IPC\nipcMain.handle('inventory:list', async (_, whId) =>\n  dbRepo.inventory.getByWarehouse(whId));\nipcMain.handle('inventory:checkLow', async () =>\n  dbRepo.inventory.getLowStock());\n\n// System tray\nconst tray = new Tray(join(__dirname, 'icon.png'));\ntray.setContextMenu(Menu.buildFromTemplate([\n  { label: '今日订单', click: () => mainWindow.show() },\n  { label: '同步数据', click: () => syncAll() },\n  { type: 'separator' },\n  { label: '退出', click: () => app.quit() },\n]));`,

    },
    {
      title: 'AI 翻译适配器模式',
      text: '产品 listing 翻译功能采用适配器模式设计，将不同 AI 提供商的 API 统一抽象为 Translator 接口。当前支持 DeepSeek 和 OpenAI 两个提供商，新增提供商只需实现 translate() 方法即可接入，无需修改业务代码。\n\n翻译请求通过 IPC 从渲染进程发送到主进程执行，避免在浏览器端暴露 API 密钥。主进程根据用户设置中配置的提供商类型，从适配器工厂获取对应的 Translator 实例。翻译结果缓存到 SQLite，相同原文+目标语言的组合直接从缓存返回，减少 API 调用成本。\n\nxlsx 库用于解析 Temu 导出的订单 Excel 文件，自动提取订单号、SKU、数量、收件地址等字段并结构化存储到 SQLite 数据库。导入过程带进度反馈（通过 IPC 推送百分比到渲染进程的进度条），支持增量导入避免重复订单。\n\n## ECharts 数据可视化\n运营仪表盘基于 ECharts 构建四大图表模块：营收指标卡片展示当日/当月/当季度的 GMV、订单量和利润率；销售趋势折线图对比不同时间段的数据变化；平台占比饼图直观展示各平台（Temu/Amazon/Shopee/TikTok）的营收贡献比例；SKU 盈利排行柱状图帮助卖家快速识别高利润和低利润商品。所有图表通过 React ref 绑定 ECharts 实例，数据从 Zustand dashboard store 获取，筛选条件变化时图表自动重新渲染。',
      imageRight: false,
      code: `// Translator adapter pattern\ninterface Translator {\n  translate(text: string, target: string): Promise<string>;\n}\n\nclass DeepSeekTranslator implements Translator {\n  async translate(text: string, target: string) {\n    const res = await fetch(this.apiUrl, {\n      body: JSON.stringify({ model: 'deepseek-chat',\n        messages: [{ role: 'user',\n          content: \`Translate to \${target}: \${text}\` }]\n      }),\n    });\n    return (await res.json()).choices[0].message.content;\n  }\n}\n\nclass TranslatorFactory {\n  static create(type: 'deepseek' | 'openai'): Translator {\n    return type === 'deepseek'\n      ? new DeepSeekTranslator()\n      : new OpenAITranslator();\n  }\n}`,
    },
  ],
  'russiablock': [
    {
      title: 'Canvas 游戏渲染引擎',
      text: '俄罗斯方块使用 HTML5 Canvas 构建完整的游戏渲染引擎。每帧通过 requestAnimationFrame 驱动，先 clearRect 清空画布，再绘制背景网格、已落定的方块和当前活动方块。\n\n7 种标准方块通过 4×4 矩阵定义，每种方块包含 4 个旋转状态，存储在 SHAPES 常量数组中。碰撞检测在每次 move/drop/rotate 操作前执行，检查方块矩阵的每个填充单元是否与边界或已落定方块重叠。行消除算法扫描所有已满行，向上移动上方所有行并重置顶行为空。得分系统基于一次消除的行数（1 行 100 分、4 行 800 分——经典 Tetris 规则），加速机制在每消除 10 行后提升下落速度。\n\n## Electron 打包与分发\n游戏通过 Electron 33 封装为 Windows 桌面应用，electron-builder 配置双构建目标——portable EXE 免安装便携版和 NSIS 安装器版。应用窗口固定 400×700 像素，禁止缩放以保证游戏画面精确渲染。主进程仅约 30 行代码，负责窗口创建和 ready-to-show 优化避免白屏闪烁。应用内无任何外部依赖——游戏逻辑、渲染、音效全部在单个 HTML 文件和 Canvas API 中完成。\n\n## 深空主题视觉设计\n游戏 UI 采用深空风格：CSS radial-gradient 伪元素生成随机星场背景，半透明黑底面板通过 backdrop-filter blur 实现毛玻璃模糊效果。CSS 自定义属性 --block-size 和 --preview-block 统一管理游戏区和预览区的方块尺寸，改变一个变量即可全局缩放。游戏结束界面使用 backdrop-filter blur 模糊游戏画面并叠加半透明遮罩，最终得分以大字显示在画面中央。侧边预览面板实时展示下一块方块，配合分数动画提升反馈感。',
      imageRight: true,
      code: `// Game loop & piece rendering
function gameLoop() {
  if (state !== 'playing') return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawLockedPieces();

  if (shouldDrop()) {
    currentY++;
  } else {
    lockPiece();
    clearRows();
    spawnPiece();
  }

  drawPiece(currentPiece, currentX, currentY);
  requestAnimationFrame(gameLoop);
}

function drawPiece(piece, x, y) {
  piece.shape.forEach((row, dy) => {
    row.forEach((cell, dx) => {
      if (cell) {
        ctx.fillStyle = COLORS[piece.type];
        ctx.fillRect(
          (x + dx) * BLOCK,
          (y + dy) * BLOCK,
          BLOCK - 1, BLOCK - 1
        );
      }
    });
  });
}`,
    },
  ],
  'asynsms': [
    {
      title: 'Docker Compose 编排',
      text: 'AsynSMS 通过 Docker Compose 实现一键部署完整的基础设施和应用栈。docker-compose.yml 编排 4 个服务：MySQL 8.0（短信数据持久化）、Redis 7（令牌桶限流计数器）、RabbitMQ 4.0（消息队列 + 管理控制台）和 Spring Boot 应用。\n\n应用服务依赖 MySQL、Redis、RabbitMQ 三个服务的健康检查（healthcheck），确保数据库和中间件就绪后才启动。RabbitMQ 管理控制台通过 15672 端口暴露，方便监控队列深度和消息吞吐。网络配置使用自定义 bridge 网络隔离服务间通信，应用端口 8080 映射到宿主机。多阶段 Docker 构建先使用 Maven + JDK 21 编译，再用 JRE 精简镜像运行，最终镜像体积控制在 200MB 以内。\n\n## 数据库设计与 JPA 自动建表\n系统包含 6 张核心表：短信任务表（task）、消息明细表（message）、黑名单表（blacklist）、退订表（unsubscribe）、发送日志表（send_log）和虚拟用户表（virtual_user）。JPA + Hibernate 自动 DDL 在应用启动时创建表结构，开发环境使用 create-drop 策略，生产环境使用 validate 策略确保实体与表结构一致。Spring Data JPA Repository 提供开箱即用的 CRUD 和分页查询，自定义 JPQL 查询支持按状态、时间范围和手机号筛选消息记录。',
      imageRight: true,
      code: `# docker-compose.yml — 4 services
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: asynsms
    ports: ["3306:3306"]
    healthcheck:
      test: ["CMD","mysqladmin","ping","-h","localhost"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  rabbitmq:
    image: rabbitmq:4.0-management
    ports: ["5672:5672","15672:15672"]

  app:
    build: .
    ports: ["8080:8080"]
    depends_on:
      mysql: { condition: service_healthy }
      redis: { condition: service_started }
      rabbitmq: { condition: service_started }`,
    },
    {
      title: 'RabbitMQ 消息可靠性',
      text: 'AsynSMS 的消息可靠性通过三重机制保障：Publisher Confirm 确认消息成功投递到 Broker，Manual ACK 确保消费者处理完成后才从队列移除，死信队列捕获超时或拒绝的消息供人工处理。\n\n自定义重试逻辑替代 Spring 默认的 RetryTemplate——失败消息不会无限重试阻塞队列，而是在 3 次重试（间隔 5s/15s/30s 指数退避）后转入死信队列。死信队列的管理界面可通过 RabbitMQ Management Plugin（端口 15672）查看和手动重新投递。\n\n生产者-消费者解耦设计使得 API 接收层和短信发送层完全独立——API 只需将消息投递到队列即可返回响应，后台 Worker 从队列拉取消息批量发送。这种架构在短信供应商响应慢时不会阻塞 API 接口，吞吐量由 Worker 实例数量线性扩展。\n\n## 实时进度 Dashboard\n系统内置 Thymeleaf + Bootstrap 5 构建的实时进度看板，通过 3 秒自动轮询 Ajax 请求刷新任务进度条。每个短信任务显示总数量、已发送、成功、失败四个数字，进度条随发送进度实时填充。Dashboard 页面按 Tab 分为活跃任务和历史任务两个视图，历史任务支持按时间和状态筛选。失败明细页面以表格展示每条失败记录的原因（号码无效、黑名单、限流拒绝等），支持 CSV 导出（UTF-8 BOM 编码兼容 Excel 中文显示）。',
      imageRight: false,
      code: `// RabbitMQ config — triple guarantee\n@Configuration\npublic class RabbitConfig {\n  @Bean\n  public Queue smsQueue() {\n    return QueueBuilder.durable("sms.queue")\n      .deadLetterExchange("sms.dlx")\n      .deadLetterRoutingKey("sms.dead")\n      .build();\n  }\n\n  @Bean\n  public RabbitTemplate template(ConnectionFactory cf) {\n    var t = new RabbitTemplate(cf);\n    t.setConfirmCallback((correlation, ack, reason) -> {\n      if (!ack) log.warn("Publisher confirm failed: {}", reason);\n    });\n    return t;\n  }\n}`,
    },
    {
      title: 'Redis 令牌桶限流',
      text: '短信供应商通常有严格的每秒发送速率限制，AsynSMS 通过 Redis 原子 Lua 脚本实现分布式令牌桶算法。\n\n令牌桶配置容量和填充速率——例如每令牌 = 1 条短信，桶容量 100 令牌，填充速率 10 令牌/秒（匹配供应商 QPS 限制）。每次发送前执行 Lua 脚本检查并消耗一个令牌：如果桶中有令牌则消耗并通过，无令牌则拒绝并返回建议重试时间。\n\nLua 脚本在 Redis 服务端原子执行，杜绝了"检查-消耗"之间的竞态条件，多应用实例环境下也是安全的。令牌桶状态通过 Redis key 持久化，重启不丢失。监控端点 /actuator/health 实时返回当前令牌余量和限流拒绝次数，便于运维排查。\n\n## RESTful API 设计\n系统暴露 12+ RESTful 端点，按功能分为短信任务管理（创建、查询、暂停、恢复、删除）、黑名单管理（添加、移除、查询）和数据导出（CSV 下载）。控制器层使用 @RestController + @Validated 注解实现请求参数校验，统一异常处理器 @RestControllerAdvice 将业务异常映射为标准 JSON 错误响应。Swagger/OpenAPI 文档自动生成，开发环境通过 Swagger UI 可直接测试所有接口。短信发送接口异步处理——接收请求后立即返回任务 ID 和预估时间，后台 Worker 异步消费队列执行实际发送。',
      imageRight: true,
      code: `-- Lua script: atomic token bucket in Redis\nlocal key = KEYS[1]\nlocal capacity = tonumber(ARGV[1])\nlocal rate = tonumber(ARGV[2])\nlocal now = tonumber(ARGV[3])\n\nlocal bucket = redis.call('hmget', key, 'tokens', 'last_refill')\nlocal tokens = tonumber(bucket[1]) or capacity\nlocal last = tonumber(bucket[2]) or now\n\nlocal elapsed = (now - last) / 1000.0\nlocal refill = math.floor(elapsed * rate)\ntokens = math.min(capacity, tokens + refill)\n\nif tokens > 0 then\n  redis.call('hmset', key, 'tokens', tokens - 1, 'last_refill', now)\n  return 1 -- allowed\nend\nreturn 0 -- rate limited`,
    },
  ],
  'financial-system': [
    {
      title: '事件驱动回测引擎',
      text: 'FinancialSystem 的回测引擎采用事件驱动架构，核心是一个按交易日推进的主循环。每个交易日触发 OnBar 事件，依次通知所有已注册的策略、风控模块和记录器。\n\n引擎从 akshare 获取历史日线数据（开高低收量），按日期排序后逐日推送给策略的 on_bar() 方法。策略根据当日 K 线、当前持仓和账户状态决定买卖，返回 Order 对象。订单经风控模块校验（持仓上限、单笔金额限制、T+1 卖出限制）后由 SimulatedBroker 模拟成交——考虑佣金、印花税、滑点后更新账户权益和持仓。每笔交易记录到 SQLite 便于事后分析。回测结束后输出年化收益率、最大回撤、夏普比率、胜率等核心指标，使用 matplotlib 绘制权益曲线。新增策略只需实现 Strategy 接口的 on_bar()、on_order_filled()、on_trade() 三个回调。\n\n## 风控模块与绩效评估\n风控模块在每笔订单执行前进行多层校验：单只股票持仓上限（默认 20%）、行业集中度限制（同行业不超过 30%）、全局最大回撤熔断（回撤超 20% 强制清仓）、单笔止损（亏损 8% 强制卖出）。回测结束后自动生成绩效报告：年化收益率、夏普比率、索提诺比率、卡玛比率、最大回撤、胜率、盈亏比、利润因子——并与沪深 300 基准对比。demo.py 提供一键体验：数据加载 → 三策略对比 → 最优策略详细报告 → 权益曲线图导出为 PNG。',
      imageRight: true,
      code: `# Event-driven backtest loop
class BacktestEngine:
    def run(self) -> dict:
        for date, bar in self.data.iterrows():
            self.current_date = date
            self._update_portfolio_value()

            # Notify all strategies
            signals = []
            for strategy in self.strategies:
                signal = strategy.on_bar(bar,
                                        self.portfolio)
                if signal:
                    signals.append(signal)

            # Risk check + execute orders
            for signal in signals:
                if self.risk_mgr.check(signal,
                                       self.portfolio):
                    order = signal.to_order()
                    fill = self.broker.execute(order, bar)
                    self.portfolio.update(fill)
                    self.recorder.record(date, fill)

        return self.analytics.summarize()`,
    },
    {
      title: '内置交易策略',
      text: '系统内置三种经典量化策略，覆盖趋势跟踪和均值回归两大流派。\n\n双均线交叉策略（MACross）：计算短期均线（默认 MA5）和长期均线（默认 MA20），短线上穿长线产生金叉买入信号，短线下穿长线产生死叉卖出信号。策略参数（均线周期、仓位比例）可在 YAML 配置文件中调整。\n\nRSI 超买超卖策略：当 14 日 RSI 低于 30（超卖）时买入，高于 70（超买）时卖出，适合震荡市。\n\n网格交易策略：在预设价格区间内以固定间隔挂单，价格触及网格线自动成交，赚取震荡波动收益。策略通过 YAML 驱动配置——初始资金、手续费率、印花税率、滑点等参数统一在 config.yaml 中管理，切换策略无需修改代码。',
      imageRight: false,
      code: `# config.yaml — strategy configuration
initial_capital: 100000
commission:
  rate: 0.0003      # 佣金 万分之三
  min_fee: 5.0      # 最低 5 元
stamp_tax:
  rate: 0.001       # 印花税 千分之一
  side: sell        # 仅卖出征收
slippage: 0.001     # 滑点 千分之一

strategies:
  macross:
    short_window: 5
    long_window: 20
    position_pct: 0.3
  rsi:
    period: 14
    oversold: 30
    overbought: 70`,
    },
    {
      title: '数据管道与 SQLite 缓存',
      text: 'FinancialSystem 使用 akshare 作为免费数据源，覆盖 A 股日线行情（开高低收量）、股票基本信息、指数数据。数据获取后自动缓存到本地 SQLite 数据库，避免重复网络请求。\n\nSQLite 缓存采用 EAV 模式存储——每张表对应一个数据维度（日线表、基本信息表、指数表），以股票代码 + 日期作为联合主键保证幂等性。CLI 工具提供 10 个命令管理数据生命周期：init 初始化数据库、add 添加股票到关注列表、remove 移除、list 列出所有跟踪标的、backtest 执行回测、sim 启动模拟交易、status 查看持仓、order 手动下单、risk 查看风控状态、report 生成绩效报告。所有命令共享同一个 SQLite 实例，通过 argparse 子命令路由。',
      imageRight: true,
      code: `# CLI commands via argparse
$ python -m src.cli.main init          # 初始化数据库
$ python -m src.cli.main add 600519    # 添加茅台
$ python -m src.cli.main add 000858    # 添加五粮液
$ python -m src.cli.main list          # 列出跟踪标的
  1. 600519  贵州茅台
  2. 000858  五粮液

$ python -m src.cli.main backtest \\
    --strategy macross \\
    --start 2024-01-01 \\
    --end 2025-12-31

# Output:
# 年化收益率: +18.7%
# 夏普比率:   1.42
# 最大回撤:   -12.3%
# 胜率:      58.2%
# 权益曲线已保存: backtest_result.png`,
    },
  ],
  'vibeview': [
    {
      title: 'Go 内嵌资源与 MCP 工具',
      text: 'VibeView 的核心架构基于 Go 1.23 的 embed 特性，将前端资源（HTML、CSS、JS）和 Mermaid.js 渲染引擎编译进单一二进制文件。编译产物约 12MB，无需任何外部依赖——下载即可运行。\n\nMCP 服务器注册 9 个工具，每个工具映射一个浏览器操作。preview_show 推送 HTML 内容到浏览器白板，支持思维导图（Mermaid mindmap）、对比表格、语法高亮代码块和带时间戳的分析卡片。preview_screenshot 截取当前浏览器视口并返回 base64。preview_console 转发浏览器控制台日志到 Claude Code 终端。preview_diff 渲染代码差异对比视图。preview_reload 触发热重载，配合 fsnotify 监听文件变化自动刷新。preview_inspect 返回当前页面的 DOM 结构快照。工具间通过 WebSocket 与浏览器通信，每个请求带唯一 ID 实现请求-响应匹配。',
      imageRight: true,
      code: `//go:embed all:web/dist
var staticFiles embed.FS

type McpServer struct {
    tools []Tool
}

func (s *McpServer) RegisterTools() {
    s.tools = []Tool{
        {Name: "preview_show",
         Handler: s.handlePreviewShow},
        {Name: "preview_screenshot",
         Handler: s.handleScreenshot},
        {Name: "preview_console",
         Handler: s.handleConsole},
        {Name: "preview_reload",
         Handler: s.handleReload},
        {Name: "preview_inspect",
         Handler: s.handleInspect},
    }
}`,
    },
  ],
  'expense-tracker': [
    {
      title: 'SQLite 本地存储',
      text: '记账本使用 expo-sqlite 实现完整的本地优先数据层。数据库包含 transactions（交易记录）、categories（分类）和 budgets（预算）三张核心表，通过外键关联确保数据完整性。\n\n交易记录表以 ISO 8601 格式存储日期，支持按年/月/自定义周期范围查询。分类表预置 12 个分类（8 个支出 + 4 个收入），每个分类有 name、emoji、color 和 type 字段。软删除通过 deleted_at 时间戳字段实现，删除的分类数据保留但查询时自动过滤。预算表支持月度或自定义周期，包含起始日期和金额上限。\n\n所有数据库操作在 Web SQLite 的同步 API 上包装为 Promise，通过事务保证批量操作的原子性。Excel 导出功能读取三张表的数据，使用 xlsx 库生成包含周期摘要、分类明细、交易详情三个工作表的 workbook，UTF-8 BOM 编码确保在 Excel 中正确显示中文。',
      imageRight: false,
      code: `// expo-sqlite CRUD operations
import * as SQLite from 'expo-sqlite';

const db = await SQLite.openDatabaseAsync('ledger.db');

await db.execAsync(\`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    type TEXT CHECK(type IN ('income','expense')),
    category_id INTEGER REFERENCES categories(id),
    date TEXT NOT NULL,
    note TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, emoji TEXT, color TEXT,
    type TEXT, deleted_at TEXT
  );
\`);`,
    },
  ],
  'music-player': [
    {
      title: 'Electron 安全架构',
      text: 'MusicPlayer 的 Electron 架构严格遵循安全最佳实践。主进程 BrowserWindow 配置中 contextIsolation: true 和 nodeIntegration: false 是硬性要求——渲染进程无法直接访问 Node.js API。\n\npreload 脚本是渲染进程与主进程之间的唯一桥梁，通过 contextBridge.exposeInMainWorld 安全地暴露有限 API。每个暴露的方法内部调用 ipcRenderer.invoke 向主进程发送请求，主进程 handler 验证参数后执行操作并返回结果。这种间接调用确保渲染进程即使被 XSS 攻击也无法执行任意系统命令。\n\nready-to-show 事件在窗口内容渲染完成后触发，在此之前窗口保持隐藏——这消除了 Electron 应用常见的启动白屏闪烁。窗口关闭时通过 before-quit 事件保存播放状态（当前曲目、播放进度、音量）到 electron-store，下次启动自动恢复。暗色主题通过 CSS 自定义属性（--bg-primary、--text-primary 等）统一管理，所有颜色值集中定义在 :root 伪类中。',
      imageRight: true,
      code: `// preload.ts — Secure context bridge
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () =>
    ipcRenderer.invoke('get-app-version'),

  readMusicDir: (path: string) =>
    ipcRenderer.invoke('read-music-dir', path),

  getAudioDuration: (filePath: string) =>
    ipcRenderer.invoke('get-audio-duration', filePath),

  onPlayerAction: (callback: (a: string) => void) => {
    ipcRenderer.on('player-action',
      (_event, action) => callback(action));
  },
});`,
    },
  ],
  'tinyrobot': [
    {
      title: '自定义 TCP 协议',
      text: 'TinyRobot 与 PC 之间的通信使用一套自定义二进制 TCP 协议。协议帧由 4 字节同步头（AA 55 01 FF）+ 1 字节命令码 + 2 字节大端长度 + N 字节数据载荷 + 1 字节 CRC 校验组成。\n\n4 字节同步头确保接收端在字节流中准确定位帧边界——当检测到连续匹配的同步序列时开始解析后续字段。命令码定义帧类型：0x01 推送屏幕画面（RGB565 格式，320×240 分辨率，约 150KB/帧）、0x02 文字叠加、0x03 配置 WiFi 凭据、0x04 心跳检测。数据载荷长度字段允许最大 65535 字节，CRC-8 校验覆盖命令码到数据载荷末尾的所有字节，检测传输错误。\n\nESP32 端使用 FreeRTOS 任务运行 TCP 服务器，accept 连接后创建独立任务处理每个客户端。帧解析器使用状态机：WAIT_SYNC → READ_CMD → READ_LEN → READ_PAYLOAD → CHECK_CRC，每个状态下读取指定字节数后转移到下一个状态。mDNS 广播让 PC 客户端自动发现设备 IP，无需手动输入地址。',
      imageRight: false,
      code: `// Binary protocol frame structure
// AA 55 01 FF | CMD | LEN_H | LEN_L |
//    PAYLOAD...    | CRC
// Sync(4B) | Cmd(1B) | Len(2B BE) |
//    Payload(0-65535B) | CRC(1B)

typedef struct {
  uint8_t  sync[4]; // 0xAA,0x55,0x01,0xFF
  uint8_t  cmd;
  uint16_t len;     // big-endian
  uint8_t* payload;
  uint8_t  crc;
} Frame;

uint8_t calc_crc(const Frame* f) {
  uint8_t crc = 0;
  crc = crc8(&f->cmd, 1, crc);
  crc = crc8((uint8_t*)&f->len, 2, crc);
  crc = crc8(f->payload, f->len, crc);
  return crc;
}`,
    },
    {
      title: 'FreeRTOS 双核任务调度',
      text: 'TinyRobot 运行在 ESP32-S3 双核处理器上，Xia 核心 0 负责 UI 渲染（TFT 屏幕驱动 + 表情动画帧推送），核心 1 负责 100Hz 传感器轮询、模式管理和 TCP 服务器 I/O。\n\n两个核心通过 FreeRTOS 任务调度器独立运行，任务间通信使用互斥锁（Mutex）保护共享的模式状态变量。核心 0 的 UI 任务以 30fps 速率刷新屏幕，核心 1 的传感器任务每 10ms 读取 MPU6050 加速度数据并计算倾斜角度。模式切换由核心 1 检测倾斜变化触发，通过 xSemaphoreTake 获取互斥锁后更新全局模式枚举，核心 0 在下一帧渲染时读取新模式并切换 UI 界面。WiFi 连接管理通过引用计数实现：每个需要网络的模块（NTP 同步、天气获取、PC Link）调用 wifi_request() / wifi_release()，计数归零时自动断开 WiFi 以节省功耗。',
      imageRight: true,
      code: `// Dual-core task creation in FreeRTOS
void setup() {
  // Core 0: UI rendering
  xTaskCreatePinnedToCore(
    uiTask, "UI", 8192, NULL, 1, NULL, 0);

  // Core 1: sensor + network
  xTaskCreatePinnedToCore(
    sensorTask, "Sensor", 4096, NULL, 2, NULL, 1);

  // Mutex for mode state
  modeMutex = xSemaphoreCreateMutex();
}

void sensorTask(void* pv) {
  TickType_t lastWake = xTaskGetTickCount();
  while (1) {
    sensors.poll();          // 100Hz
    modeManager.update();    // check tilt
    tcpServer.handleClient();
    vTaskDelayUntil(&lastWake, pdMS_TO_TICKS(10));
  }
}`,
    },
    {
      title: '重力感应与模式切换',
      text: 'MPU6050 六轴传感器作为 TinyRobot 的核心交互方式——通过倾斜立方体切换四种工作模式。传感器每 10ms 读取一次加速度数据，通过 atan2 函数将 X/Y/Z 三轴加速度转换为欧拉角（俯仰角和翻滚角）。\n\n模式判定逻辑：Z 轴朝上（立方体正面朝上）→ 表情模式，Z 轴朝下 → 时钟模式，X 轴朝上（左侧倾斜）→ 天气模式，X 轴朝下（右侧倾斜）→ 番茄钟模式。为防止抖动，状态切换需要方向持续稳定 300ms 且角度偏差不超过 10°。10° 死区确保微小的桌面震动不会误触发切换。\n\n番茄钟模式内置 25 分钟工作 + 5 分钟休息循环，屏幕显示径向进度条——通过绘制从圆心出发的扇形线段实现，每段覆盖 6° 弧（共 60 段对应 30 分钟），随时间推进逐段填充。',
      imageRight: false,
      code: `// MPU6050 tilt detection
void ModeManager::update() {
  float ax, ay, az;
  mpu.getAccel(&ax, &ay, &az);

  float pitch = atan2(ax, sqrt(ay*ay + az*az));
  float roll  = atan2(ay, sqrt(ax*ax + az*az));

  Direction dir = NONE;
  if (az > 0.8f)  dir = FACE_UP;    // ~35° from vertical
  if (az < -0.8f) dir = FACE_DOWN;
  if (ax > 0.8f)  dir = TILT_LEFT;
  if (ax < -0.8f) dir = TILT_RIGHT;

  if (dir == lastDir && millis() - lastChange > 300)
    switchMode(dir);
}`,
    },
  ],
  'trafficlight': [
    {
      title: '寄存器编程',
      text: 'TrafficLight 是 STM32F103 的寄存器级裸机项目——不使用 HAL 库，不使用标准外设库，每个外设操作直接读写硬件寄存器。\n\n时钟配置通过 RCC 寄存器完成：启用 HSE 外部晶振（8MHz），等待就绪后切换到 PLL 倍频至 72MHz，配置 APB1/APB2 预分频器确定外设时钟。GPIO 初始化通过 CRL/CRH 寄存器设定每个引脚的 4 位模式（模拟输入/浮空输入/推挽输出/开漏输出等）和 2 位最大速度（10/2/50MHz）。LED 切换使用 BSRR（位设置/复位寄存器）实现原子操作——写入低 16 位使引脚置高，写入高 16 位使引脚复位——避免读-修改-写导致的毛刺。按键消抖通过软件定时器延迟 20ms 后二次确认电平状态，过滤机械触点抖动。自定义链接脚本 STM32F103VETx_FLASH.ld 精确定义 Flash（512K）和 SRAM（64K）的起止地址，以及 .text/.data/.bss 段的布局。',
      imageRight: true,
      code: `// Direct register manipulation — no HAL
// Clock: 8MHz HSE -> PLL x9 = 72MHz
RCC->CR   |=  RCC_CR_HSEON;
while (!(RCC->CR & RCC_CR_HSERDY));

RCC->CFGR |=  RCC_CFGR_PLLSRC;
RCC->CFGR |=  RCC_CFGR_PLLMULL9;
RCC->CR   |=  RCC_CR_PLLON;
while (!(RCC->CR & RCC_CR_PLLRDY));

// GPIOB PB0-PB2: push-pull, 50MHz
RCC->APB2ENR |= RCC_APB2ENR_IOPBEN;
GPIOB->CRL &= ~(0xFFF << 0);
GPIOB->CRL |=  (0x333 << 0);

// Atomic LED toggle — no glitch
GPIOB->BSRR = GPIO_BSRR_BS0;  // Set PB0
GPIOB->BRR  = GPIO_BRR_BR0;   // Reset PB0`,
    },
    {
      title: 'Makefile 双构建系统',
      text: '项目同时支持 ARM GCC Makefile 和 Keil MDK 两种构建方式，方便在不同开发环境间切换。\n\nMakefile 构建使用 arm-none-eabi-gcc 工具链，手动指定 MCU 标志（-mcpu=cortex-m3 -mthumb）、链接脚本（STM32F103VETx_FLASH.ld）和启动文件（startup_stm32f10x_hd.s）。构建流程分为编译（C 文件→.o）、链接（.o+ld→.elf）、转换（.elf→.bin/.hex）三个阶段。make flash 通过 OpenOCD 连接 ST-Link 调试器烧录固件，make size 输出 Flash 和 SRAM 使用量。\n\nKeil MDK 项目文件（.uvprojx）包含完整的工程配置——芯片型号（STM32F103VET6）、调试器设置（ST-Link SWD）、优化级别（-O0 debug / -Os release）和文件分组。双构建系统确保项目不绑定特定 IDE，符合开源协作的最佳实践。',
      imageRight: true,
      code: `# Makefile — ARM GCC build
CC = arm-none-eabi-gcc
CFLAGS = -mcpu=cortex-m3 -mthumb -O0 -g
LDFLAGS = -T STM32F103VETx_FLASH.ld

SRC = $(wildcard Src/*.c) $(wildcard Startup/*.s)
OBJ = $(SRC:.c=.o)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

firmware.elf: $(OBJ)
	$(CC) $(LDFLAGS) $^ -o $@

flash: firmware.bin
	openocd -f interface/stlink.cfg \\
	  -f target/stm32f1x.cfg \\
	  -c "program firmware.bin \\
	  0x08000000 verify reset exit"`,
    },
    {
      title: '按键消抖与状态机',
      text: '两个物理按键（PA0 KEY1 和 PC13 KEY2）通过 GPIO 输入模式读取。PA0 配置为上拉输入（默认高电平，按下为低），PC13 配置为浮空输入。\n\n软件消抖采用"延迟+二次确认"模式：首次检测到电平变化后延时 20ms（过滤机械触点抖动期），再次读取同一引脚——若电平与首次一致则确认有效，否则视为抖动丢弃。这种简单方案在 72MHz MCU 上可靠工作，无需定时器中断——SysTick 的 HAL_Delay 提供毫秒级延时。\n\n颜色状态管理通过全局 color_state 枚举（RED=0 / GREEN=1 / BLUE=2）实现。KEY1 每次短按使 color_state 循环递增（0→1→2→0），KEY2 控制 LED 开关——关闭时记忆当前颜色状态（保存到 last_color），重新打开时恢复到之前颜色。BSRR/BRR 原子操作确保 LED 切换无毛刺。',
      imageRight: false,
      code: `// Button debounce with state machine
uint8_t read_key1(void) {
  if (!(GPIOA->IDR & GPIO_IDR_IDR0)) {
    HAL_Delay(20);           // debounce
    if (!(GPIOA->IDR & GPIO_IDR_IDR0)) {
      while (!(GPIOA->IDR & GPIO_IDR_IDR0)); // wait release
      return 1;
    }
  }
  return 0;
}

// Color state cycle
if (read_key1()) {
  if (led_on) {
    color_state = (color_state + 1) % 3;
    set_led_color(color_state);
  } else {
    led_on = 1;
    set_led_color(last_color);
  }
}`,
    },
  ],
  'iot-monitor': [
    {
      title: '传感器驱动',
      text: 'IoT Monitor 的 DHT11 温湿度传感器驱动采用位脉冲（bit-banging）方式在 STM32 上实现单总线（One-Wire）协议，不使用任何硬件外设。\n\nDHT11 的通信包含三个阶段：主机发起起始信号（拉低总线 18ms、拉高 20-40us）、DHT11 响应（拉低 80us、拉高 80us）、40 位数据传输。每位数据的编码方式为：起始 50us 低电平 + 高电平持续时间区分 0（26-28us）和 1（70us）。驱动使用 SysTick 定时器实现微秒级延时，在 GPIO 引脚上精确控制时序。数据校验采用 8 位校验和——前 4 字节（湿度整数、湿度小数、温度整数、温度小数）相加等于第 5 字节。校验失败自动重试，最多 3 次。\n\nMQ-4 天然气传感器输出模拟电压，通过 STM32 ADC 采样后线性映射为浓度百分比。ADC 使用 DMA 连续模式，无需 CPU 干预自动将转换结果传输到内存缓冲区。ESP8266 通过 AT 指令集与 STM32 通信，数据上传使用 sprintf 拼装 HTTP GET 请求字符串，直接通过 UART 发送——不使用任何云 SDK。',
      imageRight: false,
      code: `// DHT11 one-wire bit-banging driver
uint8_t DHT11_Read(uint8_t* hum, uint8_t* temp) {
    uint8_t buf[5] = {0};

    // Host start signal
    DHT11_OUT(); DHT11_LOW(); delay_us(18000);
    DHT11_HIGH(); delay_us(30);
    DHT11_IN();

    // Wait DHT11 response
    while (DHT11_READ() == 1);
    while (DHT11_READ() == 0);

    // Read 40 bits (5 bytes)
    for (int i = 0; i < 5; i++) {
        for (int b = 7; b >= 0; b--) {
            while (DHT11_READ() == 0);
            delay_us(30);
            if (DHT11_READ() == 1)
                buf[i] |= (1 << b);
            while (DHT11_READ() == 1);
        }
    }

    // Checksum verification
    if (buf[4] != (buf[0]+buf[1]+buf[2]+buf[3]))
        return 0;
    *hum = buf[0]; *temp = buf[2];
    return 1;
}`,
    },
    {
      title: 'PID 光控与 DMA ADC',
      text: '自设版本中实现了基于 PID 控制器的光照自动调节系统。光敏电阻通过 ADC 采集环境光照度，PID 控制器根据目标值与实际值的偏差计算 PWM 输出占空比，驱动 LED 实现亮度闭环控制。\n\nPID 参数分为三档——高照度（0-500 lux, kp=0.06/ki=0.005/kd=0.002）、中照度（500-750 lux, kp=0.04/ki=0.003/kd=0.001）、低照度（750-900 lux, kp=0.02/ki=0.002/kd=0.001）——不同工作点使用不同的参数集以适应系统非线性。ADC 采集使用 DMA 循环模式，6 通道连续扫描无需 CPU 干预。滑动窗口滤波器对每通道保留最近 10 个采样值，剔除最大最小值后取平均，有效抑制电源噪声和传感器抖动。',
      imageRight: true,
      code: `// PID controller with multi-range parameters
typedef struct {
  float kp, ki, kd;
  float integral, prev_error;
  float integral_max;
} PID;

float PID_Compute(PID* pid, float target, float actual) {
  float error = target - actual;
  pid->integral += error;
  pid->integral = constrain(pid->integral,
    -pid->integral_max, pid->integral_max);

  float deriv = error - pid->prev_error;
  pid->prev_error = error;

  return pid->kp * error +
         pid->ki * pid->integral +
         pid->kd * deriv;
}

// DMA ADC continuous scan (6 channels)
HAL_ADC_Start_DMA(&hadc1,
  (uint32_t*)adc_buf, 6 * 10); // 10 samples/ch`,
    },
    {
      title: 'ESP8266 WiFi 云通信',
      text: 'IoT Monitor 通过 ESP8266-01S WiFi 模块将传感器数据上传到巴法云 IoT 平台，用户可通过微信小程序远程查看实时数据。\n\nESP8266 与 STM32 通过 UART 连接（TX/RX 交叉），通信协议使用 AT 指令集。初始化序列为：AT（测试连接）→ AT+CWMODE=2（设置 AP 模式）→ AT+CWSAP 设置 SSID 和密码 → AT+CIPMUX=1（启用多连接）→ AT+CIPSERVER=1,8080（启动 TCP 服务器）。所有 AT 指令均通过 sprintf 拼装命令字符串，USART 发送后使用 strstr 解析响应中的 "OK" 或 "ERROR" 关键字判断执行结果。\n\n云平台通信格式为 HTTP GET 请求的简化版：通过 TCP 连接向巴法云服务器发送 cmd=2&uid={设备ID}&topic={主题}&msg={数据} 格式的字符串。三个数据主题分别上传温度、湿度和烟雾浓度。微信小程序端通过订阅相同主题实时接收数据推送，支持历史数据查询和远程阈值设置。',
      imageRight: false,
      code: `// ESP8266 AT command init with retry
uint8_t ESP8266_Init(void) {
  char cmd[128];
  for (int retry = 0; retry < 3; retry++) {
    UART_Send("AT\\r\\n");
    if (ESP_WaitOK(2000)) break;
    if (retry == 2) return 0;
  }

  sprintf(cmd, "AT+CWSAP=\\"%s\\",\\"%s\\",1,3\\r\\n",
    WIFI_SSID, WIFI_PASS);
  UART_Send(cmd);
  if (!ESP_WaitOK(5000)) return 0;

  UART_Send("AT+CIPSERVER=1,8080\\r\\n");
  if (!ESP_WaitOK(2000)) return 0;
  return 1;
}

// Cloud data upload
sprintf(buf, "GET /api?cmd=2&uid=%s"
  "&topic=Temp&msg=%.1f\\r\\n",
  DEVICE_UID, temperature);
ESP_SendData(buf);`,
    },
  ],
  'digital-photo-frame': [
    {
      title: 'Framebuffer 直接渲染',
      text: '数码相册的核心渲染通过 Linux framebuffer 设备（/dev/fb0）实现。Lcd_Init() 打开设备文件后调用 mmap() 将 800×480×4 字节的显存映射到进程地址空间，后续所有像素操作退化为普通内存写入——无需任何图形 API。\n\nBMP 图片解析完全手工实现：定义 packed 结构体对齐 BMP 文件头的 54 字节布局，通过 read() 逐字段解析文件大小、像素偏移、宽高和色深。像素数据为 BGR 格式，逐字节读取后通过位操作转换为 ARGB 写入 framebuffer。17 种图片切换动画全部手写像素级算法——百叶窗效果逐列/逐行步进渲染、圆形收缩通过距离公式 (x-w/2)²+(y-h/2)² 与递增半径比较、对角线滑动使用自适应步长实现缓入加速曲线。',
      imageRight: true,
      code: `// Framebuffer init + mmap
int Lcd_Init() {
  fb_fd = open("/dev/fb0", O_RDWR);
  if (fb_fd < 0) return -1;

  fb_ptr = (int*)mmap(NULL,
    800 * 480 * 4, // screen size
    PROT_READ | PROT_WRITE,
    MAP_SHARED, fb_fd, 0);

  return (fb_ptr == MAP_FAILED) ? -1 : 0;
}

// BMP header parsing (packed struct)
typedef struct {
  uint16_t type;       // "BM"
  uint32_t size;
  uint16_t reserved1, reserved2;
  uint32_t offbits;    // pixel offset
} __attribute__((packed)) BmpHeader;`,
    },
    {
      title: '触摸手势与锁屏',
      text: '触摸输入通过 Linux input 子系统（/dev/input/event0）读取原始 struct input_event 结构体，包含类型（EV_ABS 表示触摸坐标）、代码（ABS_X/ABS_Y）和数值。\n\n手势识别通过记录触摸按下和释放的坐标差值实现：|ΔX| > 50px 且 |ΔX| > |ΔY| 判定为水平滑动（ΔX > 0 右滑上一张、ΔX < 0 左滑下一张），|ΔY| > 100px 且向下则为下滑返回主页。图片浏览支持循环滚动——在第一张左滑跳到末尾，在最后一张右滑回到开头。\n\n锁屏界面在 framebuffer 上直接绘制 3 列×4 行数字键盘（1-9 + 0），每个数字的触摸区域通过硬编码像素边界 if-else 判断。密码验证通过后转入主界面。',
      imageRight: false,
      code: `// Touch input parsing
struct input_event ev;
int fd = open("/dev/input/event0", O_RDONLY);

while (read(fd, &ev, sizeof(ev)) > 0) {
  if (ev.type == EV_ABS) {
    if (ev.code == ABS_X) touch_x = ev.value;
    if (ev.code == ABS_Y) touch_y = ev.value;
  }
  if (ev.type == EV_KEY && ev.code == BTN_TOUCH) {
    if (ev.value == 1) { // press
      slide_x1 = touch_x;
      slide_y1 = touch_y;
    } else { // release
      slide_x2 = touch_x;
      slide_y2 = touch_y;
      detectSwipe(); // compare deltas
    }
  }
}`,
    },
    {
      title: 'mplayer FIFO 音乐控制',
      text: '音频播放通过 system() 启动 mplayer 并传入 slave 模式和 FIFO 路径参数。mplayer 在 slave 模式下进入交互控制状态，持续读取 FIFO 的命令行。应用通过 write() 向命名管道写入控制字符串，实现播放、暂停、音量调节、跳转和退出。\n\n7 首 MP3 音乐与图片同步切换——滑动到新图片时自动切换到对应的音乐文件。FIFO 在首次使用时通过 access() 检测是否存在，不存在则调用 mkfifo() 创建。所有 mplayer 输出重定向到 /dev/null 避免干扰终端。',
      imageRight: true,
      code: `// mplayer FIFO control
int Music_Init() {
  if (access("/tmp/fifo", F_OK) != 0)
    mkfifo("/tmp/fifo", 0666);

  system("mplayer -slave -quiet"
    " -input file=/tmp/fifo &");

  fifo_fd = open("/tmp/fifo", O_WRONLY);
  return (fifo_fd < 0) ? -1 : 0;
}

void Music_Control(const char* cmd) {
  write(fifo_fd, cmd, strlen(cmd));
  write(fifo_fd, "\\n", 1);
}

// Usage:
Music_Control("pause");
Music_Control("volume 50 1");
Music_Control("seek 10 1");`,
    },
  ],
  'mcpx': [
    {
      title: '链式 API 设计',
      text: 'MCPX 的核心设计哲学是"让 MCP 服务器开发像定义函数一样简单"。mcpx() 工厂函数返回一个 server 对象，通过 .tool().tool().resource() 链式调用注册工具和资源，每个 .tool() 调用自动生成 Zod Schema、封装 JSON-RPC 响应格式。\n\n工具 handler 的返回值支持三种类型：string 自动包装为 text content、object 自动 JSON.stringify 后包装、CallToolResult 直接透传（兼容原生 MCP SDK）。参数系统支持 5 种类型（string/number/boolean/array/object），定义在 tool 的 params 数组中，框架自动推导 Zod Schema 并生成 JSON Schema 用于 MCP 协议的能力协商。内置错误处理确保 handler 抛出的 Error 自动转为 MCP error result，不会导致静默失败。resource() 方法将配置、文档等静态内容暴露为 Claude 的上下文，支持自定义 URI 或框架自动生成。整个框架核心仅 111 行 TypeScript，但足以构建生产级 MCP 服务器——附带 Calculator、Filesystem、GitHub、Web Fetch 四个完整示例。',
      imageRight: true,
      code: `// mcpx() chainable API — 17 lines
import { mcpx } from 'mcpx';

const server = mcpx({ name: 'my-server' });

server
  .tool({
    name: 'greet',
    description: 'Greet a user by name',
    params: [
      { name: 'name', type: 'string',
        required: true },
      { name: 'lang', type: 'string',
        default: 'en' },
    ],
    handler: async ({ name, lang }) => {
      const greeting = lang === 'zh'
        ? \`你好，\${name}！\`
        : \`Hello, \${name}!\`;
      return greeting; // auto-wrapped
    },
  })
  .tool({
    name: 'add',
    description: 'Add two numbers',
    params: [
      { name: 'a', type: 'number',
        required: true },
      { name: 'b', type: 'number',
        required: true },
    ],
    handler: async ({ a, b }) =>
      ({ result: a + b }),
  });`,
    },
  ],

  'weather-report': [
    {
      title: 'OkHttp + Retrofit 网络层',
      text: '基于 OkHttp 和 Retrofit 构建的 RESTful API 网络层，完整封装了和风天气 API 的 4 个端点（城市搜索、实时天气、7 日预报、生活指数）。\n\nOkHttp 作为底层 HTTP 引擎，提供连接池复用机制减少 TCP 握手开销，支持最多 5 个并发连接、每个连接存活 5 分钟。拦截器链分为应用拦截器和网络拦截器两层：应用层添加 API Key 认证头和 User-Agent 标识，网络层统一处理重定向和重试逻辑，并通过日志拦截器输出请求耗时、响应码和 Body 大小用于调试。缓存策略采用 LRU 磁盘缓存（10MB），对天气数据设置 30 分钟 Cache-Control 过期时间，避免重复请求消耗 API 配额。\n\nRetrofit 通过 @GET、@Query 等注解将 HTTP 接口声明为 Java 方法，结合 Gson 自动完成 JSON 反序列化。RxJava 2 的 Scheduler 切换确保网络 I/O 在 io 线程池执行，结果通过 observeOn(AndroidSchedulers.mainThread()) 安全回到主线程更新 LiveData。NetworkApi 工厂类按 ApiType 枚举（城市搜索 vs 天气数据）缓存不同 base URL 的 Retrofit 单例，避免重复创建。统一超时配置（连接 10s、读取 20s、写入 15s）经过实际网络环境调优，弱网场景下通过 retryWhen 操作符实现指数退避重试（最多 3 次，间隔 1s/2s/4s）。',
      image: '/screenshots/weather-report/okhttp的测试展示.jpg',
      imageRight: true,
    },
    {
      title: 'MVVM 架构设计',
      text: '采用 Google 推荐的 MVVM 架构，严格分为 View → ViewModel → Repository → Data 四层，各层单向依赖，仅通过接口通信。\n\nView 层由 3 个 Activity 组成，全部使用 ViewBinding 替代 findViewById，编译期绑定视图消除空指针。所有 Activity 继承自 Library 模块的 NetworkActivity 抽象类，强制拆分 UI 初始化与 LiveData 观察逻辑。\n\nViewModel 层通过 MutableLiveData 暴露状态，不持有 View 引用，配置变更时自动存活。Repository 层封装数据来源决策：优先 Room 缓存（15 分钟有效期），未命中则通过 Retrofit 网络获取并回写。Data 层包含 Room（支持 Migration）、Retrofit 和 MMKV（mmap 机制比 SharedPreferences 快 100 倍）。\n\nLibrary 模块提炼了可复用的架构基类：BaseActivity → BaseVBActivity → NetworkActivity 逐层增强，BaseViewModel 统一错误处理。新 Activity 只需关注业务逻辑，样板代码几乎为零。',
      image: '/screenshots/weather-report/MVVM架构图.jpg',
      imageRight: false,
    },
  ],
};

function Terminal({ code }: { code: string }) {
  const elRef = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent) => {
    const el = elRef.current;
    if (!el) return;
    const rc = el.getBoundingClientRect();
    const x = (e.clientX - rc.left) / rc.width - 0.5;
    const y = (e.clientY - rc.top) / rc.height - 0.5;
    el.style.transition = 'none';
    el.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-2px)`;
  }, []);
  const onLeave = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    el.style.transition = 'transform 500ms ease-out';
    el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0px)';
  }, []);

  return (
    <div ref={elRef} onMouseMove={onMove} onMouseLeave={onLeave}
      className="flex-shrink-0 w-full md:w-[420px] rounded-xl overflow-hidden border border-[#30363d]"
      style={{ backgroundColor: '#0d1117', transformStyle: 'preserve-3d' }}>
      <div className="px-4 py-2 flex items-center gap-2 border-b border-[#30363d]" style={{ backgroundColor: '#161b22' }}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff5f56' }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ffbd2e' }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#27c93f' }} />
        </div>
        <span className="text-[10px] ml-3" style={{ color: '#484f58' }}>code</span>
      </div>
      <pre className="p-5 font-mono text-[12px] leading-relaxed overflow-x-auto whitespace-pre-wrap" style={{ color: '#c9d1d9' }}>{code}</pre>
    </div>
  );
}

export default function TechShowcaseSection({ project }: Props) {
  const showcases = showcaseData[project.id];
  if (!showcases || showcases.length === 0) return null;

  return (
    <section className="py-[58px] px-8 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto">
        <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-12">技术深挖</p>

        <div className="space-y-20">
          {showcases.map((item, i) => {
            const isRight = item.imageRight;
            const hasSide = !!(item.image || item.code); // text-only = no side content

            return (
              <div key={i} className={hasSide ? `flex flex-col ${isRight ? 'md:flex-row' : 'md:flex-row-reverse'} gap-14 items-start` : ''}>
                <div className={hasSide ? 'flex-1' : ''}>
                  <h3 className="text-xl font-semibold text-text-primary mb-4">{item.title}</h3>
                  {item.text.split(/(?=## )/).map((block, j) => {
                    if (block.startsWith('## ')) {
                      const lines = block.split('\n');
                      const heading = lines[0].replace('## ', '');
                      const body = lines.slice(1).join('\n');
                      return (
                        <div key={j}>
                          <h4 className="text-lg font-semibold text-text-primary mt-6 mb-3">{heading}</h4>
                          {body && <p className="text-text-secondary text-[15px] leading-relaxed whitespace-pre-line">{body}</p>}
                        </div>
                      );
                    }
                    return <p key={j} className="text-text-secondary text-[15px] leading-relaxed whitespace-pre-line">{block}</p>;
                  })}
                </div>

                {item.image ? (
                  <div className="flex-shrink-0 w-full md:w-[420px] rounded-xl bg-surface border border-border overflow-hidden" style={{ boxShadow: '0 0 50px rgba(88,166,255,0.06)' }}>
                    <img src={item.image} alt={item.title} className="w-full h-auto object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                ) : item.code ? (
                  <Terminal code={item.code} />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
