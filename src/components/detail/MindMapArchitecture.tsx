import type { Project } from '../../types/project';
import { categoryMeta } from '../../data/projects';

interface Props { project: Project; }

interface Branch { name: string; items: string[]; color: string; }

function deriveBranches(techStack: string[]): Branch[] {
  const branches: Branch[] = [];
  const keywords: Record<string, string[]> = {
    'UI / Framework': ['React', 'Vue', 'Svelte', 'Next.js', 'WPF', 'XAML', 'Thymeleaf', 'Bootstrap', 'Ant Design', 'ECharts', 'Tailwind CSS', 'HTML5 Canvas'],
    'State / Data': ['Zustand', 'Redux', 'Context', 'electron-store', 'SQLite', 'better-sqlite3', 'MySQL'],
    'Language / Runtime': ['TypeScript', 'JavaScript', 'Java', 'Python', 'Go', 'C#', 'C++', 'C', 'Node.js'],
    'Platform / Build': ['Electron', 'Capacitor', 'Expo', 'React Native', 'Android', '.NET', 'Vite', 'electron-builder', 'Keil MDK', 'Makefile', 'PlatformIO'],
    'Backend / Infra': ['Spring Boot', 'RabbitMQ', 'Redis', 'Docker', 'akshare', 'pandas', 'MCP SDK', 'Zod', 'REST API'],
    'Interaction / Visual': ['Framer Motion', '@dnd-kit', 'Canvas', 'SSE', 'WebSocket', 'Commander', 'Chokidar', 'Mermaid.js', 'Lucide React', 'gsap'],
    'Hardware / Embedded': ['ESP32-S3', 'STM32', 'FreeRTOS', 'PlatformIO', 'CMSIS', 'ESP8266', 'PCB Design', 'DHT11', 'MQ-4', 'MPU6050', 'ST7789', 'Custom TCP Protocol', 'WiFi', 'DeepSeek API', 'Baidu Map SDK', 'QWeather API'],
  };
  const branchColors = ['#58a6ff', '#7ee787', '#a78bfa', '#ff6b35', '#ffa657', '#c9d1d9', '#ffa657'];

  Object.entries(keywords).forEach(([name, words], idx) => {
    const matched = techStack.filter((t) => words.some((w) => t.toLowerCase().includes(w.toLowerCase())));
    if (matched.length > 0) branches.push({ name, items: matched, color: branchColors[idx % branchColors.length] });
  });

  return branches.slice(0, 6);
}

export default function MindMapArchitecture({ project }: Props) {
  const branches = deriveBranches(project.techStack);
  const catColor = categoryMeta[project.category]?.color ?? '#58a6ff';
  const half = Math.ceil(branches.length / 2);
  const leftBranches = branches.slice(0, half);
  const rightBranches = branches.slice(half);

  return (
    <section className="py-20 px-8 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto">
        <p className="text-text-secondary text-[11px] tracking-[2px] uppercase mb-12">技术架构</p>
        <div className="flex items-center justify-center">
          <div className="flex flex-col gap-6 items-end mr-8">
            {leftBranches.map((branch) => (
              <div key={branch.name} className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-medium mb-1" style={{ color: branch.color }}>{branch.name}</p>
                  <div className="flex gap-1 justify-end flex-wrap max-w-[240px]">
                    {branch.items.map((item) => (
                      <span key={item} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${branch.color}08`, color: branch.color }}>{item}</span>
                    ))}
                  </div>
                </div>
                <div className="w-10 h-px opacity-20" style={{ backgroundColor: branch.color }} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: branch.color }} />
              </div>
            ))}
          </div>
          <div className="w-28 h-28 rounded-full flex items-center justify-center flex-shrink-0 text-center border-2 mx-4" style={{ backgroundColor: `${catColor}08`, borderColor: `${catColor}30` }}>
            <span className="text-sm font-semibold" style={{ color: catColor }}>{project.name}</span>
          </div>
          <div className="flex flex-col gap-6 items-start ml-8">
            {rightBranches.map((branch) => (
              <div key={branch.name} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: branch.color }} />
                <div className="w-10 h-px opacity-20" style={{ backgroundColor: branch.color }} />
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: branch.color }}>{branch.name}</p>
                  <div className="flex gap-1 flex-wrap max-w-[240px]">
                    {branch.items.map((item) => (
                      <span key={item} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${branch.color}08`, color: branch.color }}>{item}</span>
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
