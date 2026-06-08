import ScrollReveal from '../shared/ScrollReveal';

const capabilities = [
  {
    emoji: '\u{1F3AF}',
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
    emoji: '\u{1F527}',
    title: 'Ship End-to-End',
    text: "I don't stop at code. Docker deployment, Netlify live demos, Android APK packaging, EXE bundling — I take projects to real users.",
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
