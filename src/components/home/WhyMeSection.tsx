import ScrollReveal from '../shared/ScrollReveal';

const reasons = [
  {
    emoji: '\u{1F680}',
    title: '速度',
    text: '几天交付完整 MVP，不是几周。AI 加速但不偷工减料。',
  },
  {
    emoji: '\u{1F3AF}',
    title: '广度',
    text: 'React 到 STM32 寄存器。我在整个技术光谱中连接各个节点。',
  },
  {
    emoji: '\u{1F4E6}',
    title: '交付给用户',
    text: '从不止于 localhost。线上 Demo、APK、EXE——真正的可交付物。',
  },
  {
    emoji: '\u{1F9E0}',
    title: '深度理解',
    text: '自定义链接脚本。自定义 TCP 协议。需要深入的时候绝不浮于表面——无论用不用 AI。',
  },
];

export default function WhyMeSection() {
  return (
    <section className="py-24 px-8">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-3">
            为什么是我
          </p>
          <h2 className="text-[36px] font-light tracking-[-1px] mb-16">
            不只是写代码——我是<span className="text-frontend">建造者</span>
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
