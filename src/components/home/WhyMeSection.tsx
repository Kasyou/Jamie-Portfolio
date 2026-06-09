import ScrollReveal from '../shared/ScrollReveal';

const reasons = [
  { number: '01', title: '速度', text: '几天交付完整 MVP，不是几周。AI 加速但不偷工减料。12 个月 16 个项目证明了交付速度。', color: '#58a6ff' },
  { number: '02', title: '广度', text: 'React 到 STM32 寄存器。我在整个技术光谱中连接各个节点。不只是能沟通——我能真正跨领域构建。', color: '#7ee787' },
  { number: '03', title: '交付到用户', text: '从不停止于 localhost。线上 Demo、APK、EXE——每个项目都是真正可交付物。从浏览器到裸机。', color: '#a78bfa' },
  { number: '04', title: '深度理解', text: '自定义链接脚本。自定义 TCP 协议。需要深入的时候绝不浮于表面——无论用不用 AI。', color: '#ff6b35' },
];

export default function WhyMeSection() {
  return (
    <section className="py-28 px-8">
      <div className="max-w-7xl mx-auto text-center">
        <ScrollReveal>
          <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-3">为什么是我</p>
          <h2 className="text-[44px] font-semibold tracking-[-1px] mb-4 max-w-2xl mx-auto">不只是写代码——我是{' '}<span className="text-accent">建造者</span></h2>
          <p className="text-text-secondary text-[15px] max-w-lg mx-auto mb-20 leading-relaxed">AI 原生 vibecoding 速度 + 传统手写专业功底。快速交付又不走捷径的正确组合。</p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {reasons.map((reason, i) => (
            <ScrollReveal key={reason.title} delay={i*0.1}>
              <div className="card-base p-8 h-full text-left group">
                <span className="text-[48px] font-bold block mb-4 leading-none" style={{color:`${reason.color}60`}}>{reason.number}</span>
                <h3 className="text-xl font-semibold text-text-primary mb-3">{reason.title}</h3>
                <p className="text-text-secondary text-[14px] leading-relaxed">{reason.text}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal delay={0.5}>
          <div className="text-center mt-16">
            <a href="https://github.com/Kasyou" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-surface border border-frontend/30 text-frontend px-6 py-3 rounded-lg text-sm font-medium hover:bg-frontend/10 transition-colors">在 GitHub 上查看我的作品 →</a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
