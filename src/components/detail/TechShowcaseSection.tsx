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
      text: '俄罗斯方块使用 HTML5 Canvas 构建完整的游戏渲染引擎。每帧通过 requestAnimationFrame 驱动，先 clearRect 清空画布，再绘制背景网格、已落定的方块和当前活动方块。\n\n7 种标准方块通过 4×4 矩阵定义，每种方块包含 4 个旋转状态，存储在 SHAPES 常量数组中。碰撞检测在每次 move/drop/rotate 操作前执行，检查方块矩阵的每个填充单元是否与边界或已落定方块重叠。行消除算法扫描所有已满行，向上移动上方所有行并重置顶行为空。得分系统基于一次消除的行数（1 行 100 分、4 行 800 分——经典 Tetris 规则），加速机制在每消除 10 行后提升下落速度。',
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
      text: 'AsynSMS 通过 Docker Compose 实现一键部署完整的基础设施和应用栈。docker-compose.yml 编排 4 个服务：MySQL 8.0（短信数据持久化）、Redis 7（令牌桶限流计数器）、RabbitMQ 4.0（消息队列 + 管理控制台）和 Spring Boot 应用。\n\n应用服务依赖 MySQL、Redis、RabbitMQ 三个服务的健康检查（healthcheck），确保数据库和中间件就绪后才启动。RabbitMQ 管理控制台通过 15672 端口暴露，方便监控队列深度和消息吞吐。网络配置使用自定义 bridge 网络隔离服务间通信，应用端口 8080 映射到宿主机。多阶段 Docker 构建先使用 Maven + JDK 21 编译，再用 JRE 精简镜像运行，最终镜像体积控制在 200MB 以内。',
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
  ],
  'financial-system': [
    {
      title: '事件驱动回测引擎',
      text: 'FinancialSystem 的回测引擎采用事件驱动架构，核心是一个按交易日推进的主循环。每个交易日触发 OnBar 事件，依次通知所有已注册的策略、风控模块和记录器。\n\n引擎从 akshare 获取历史日线数据（开高低收量），按日期排序后逐日推送给策略的 on_bar() 方法。策略根据当日 K 线、当前持仓和账户状态决定买卖，返回 Order 对象。订单经风控模块校验（持仓上限、单笔金额限制、T+1 卖出限制）后由 SimulatedBroker 模拟成交——考虑佣金、印花税、滑点后更新账户权益和持仓。每笔交易记录到 SQLite 便于事后分析。回测结束后输出年化收益率、最大回撤、夏普比率、胜率等核心指标，使用 matplotlib 绘制权益曲线。新增策略只需实现 Strategy 接口的 on_bar()、on_order_filled()、on_trade() 三个回调。',
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
  ],
  'content-platform': [
    {
      title: '内容生产流水线',
      text: 'ContentPlatform 的内容生产遵循标准化的五阶段流水线，每个阶段都有明确的输入、处理和产出。\n\n阶段一——选题规划：从 10+ 选题队列中按优先级选取，同步参考知乎热榜和 CSDN 热搜词确认话题热度。阶段二——大纲生成：使用 Claude 将选题扩展为包含 3-5 个小标题的详细大纲，人工审核确认覆盖深度。阶段三——文章撰写：Claude 根据大纲生成 3000+ 字初稿，包含代码示例、对比表格和流程图。阶段四——平台适配：核心文章通过适配层转为 4 个平台的格式——知乎注重叙事和互动引导（文末提问）、掘金注重技术深度和代码高亮、CSDN 注重 SEO 标题和目录锚点、微信公众号注重排版和引导关注。阶段五——数据分析：跟踪每篇文章的阅读量、点赞收藏比、评论情感倾向，反馈数据进入选题队列调整下一期的选题优先级。',
      imageRight: false,
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
  return (
    <div className="flex-shrink-0 w-full md:w-[420px] rounded-xl overflow-hidden border border-[#30363d]" style={{ backgroundColor: '#0d1117' }}>
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
    <section className="py-24 px-8 border-t border-white/[0.04]">
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
