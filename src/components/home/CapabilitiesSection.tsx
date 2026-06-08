import ScrollReveal from '../shared/ScrollReveal';

const capabilities = [
  {
    emoji: '\u{1F3AF}',
    title: '全栈广度',
    text: '每一层都游刃有余——从 CSS 动画到数据库索引到固件寄存器。',
    tags: ['React', 'Spring Boot', 'Go', 'React Native', 'C++'],
    color: '#58a6ff',
  },
  {
    emoji: '⚡',
    title: 'AI 原生工作流',
    text: '用 AI 协作极速交付。12 个月用 Claude Code 完成了 16 个项目。知道如何利用 AI 而不牺牲代码质量。',
    tags: ['Claude Code', 'Prompt Engineering', 'MCP Development'],
    color: '#a78bfa',
  },
  {
    emoji: '\u{1F527}',
    title: '端到端交付',
    text: '代码写完只是开始。Docker 部署、Netlify 线上 Demo、Android APK 打包、EXE 封装——把项目真正送到用户手中。',
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
            核心能力
          </p>
          <h2 className="text-[36px] font-light tracking-[-1px] mb-16">
            我能带来什么
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
