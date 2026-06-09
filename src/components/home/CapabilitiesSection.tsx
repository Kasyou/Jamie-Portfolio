import { useRef, useCallback, useState } from 'react';
import ScrollReveal from '../shared/ScrollReveal';

const capabilities = [
  {
    icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>),
    title: '全栈广度',
    text: '每一层都游刃有余——从 CSS 动画到数据库索引到固件寄存器。横跨整个技术栈。',
    tags: ['React', 'Spring Boot', 'Go', 'React Native', 'C++'],
    color: '#58a6ff',
  },
  {
    icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>),
    title: 'AI 原生工作流',
    text: '12 个月 Claude Code 协作，16 个项目交付。深知如何用 AI 加速而不牺牲质量。',
    tags: ['Claude Code', 'Prompt Engineering', 'MCP 开发'],
    color: '#a78bfa',
  },
  {
    icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>),
    title: '端到端交付',
    text: '代码写完只是开始。Docker、Netlify、APK、EXE——把项目真正送到用户手中。',
    tags: ['Docker', 'Netlify', 'APK 构建', 'PyInstaller'],
    color: '#7ee787',
  },
];

function CapCard({ cap, delay }: { cap: typeof capabilities[0]; delay: number }) {
  const elRef = useRef<HTMLDivElement>(null);
  const hovered = useRef(false);
  const [,setTick] = useState(0);

  const doTilt = useCallback((e: React.MouseEvent) => {
    const el = elRef.current;
    if (!el) return;
    const rc = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rc.left}px`);
    el.style.setProperty('--my', `${e.clientY - rc.top}px`);
    const x = (e.clientX - rc.left) / rc.width - 0.5;
    const y = (e.clientY - rc.top) / rc.height - 0.5;
    if (!hovered.current) {
      hovered.current = true;
      setTick(t => t + 1);
      el.style.transition = 'transform 200ms cubic-bezier(0.34,1.56,0.64,1)';
    } else {
      el.style.transition = 'transform 100ms ease-out';
    }
    el.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-6px) scale(1.03)`;
    el.style.zIndex = '20';
  }, []);

  const onLeave = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    hovered.current = false;
    el.style.transition = 'transform 600ms cubic-bezier(0.34,1.56,0.64,1)';
    el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0px) scale(1)';
    el.style.zIndex = '0';
  }, []);

  return (
    <ScrollReveal delay={delay}>
      <div ref={elRef} onMouseMove={doTilt} onMouseLeave={onLeave}
        className="card-base p-8 h-full group relative overflow-hidden"
        style={{'--glow':cap.color, transformStyle:'preserve-3d'} as React.CSSProperties}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
          style={{background:`radial-gradient(circle 200px at var(--mx) var(--my), ${cap.color}12, transparent)`}}/>
        <div className="relative z-10">
          <div className="mb-5" style={{color:cap.color}}>{cap.icon}</div>
          <h3 className="text-lg font-semibold text-text-primary mb-3">{cap.title}</h3>
          <p className="text-text-secondary text-[13px] leading-relaxed mb-6">{cap.text}</p>
          <div className="flex flex-wrap gap-1.5">
            {cap.tags.map(t=>(
              <span key={t} className="text-[10px] px-2.5 py-1 rounded-md font-medium transition-transform duration-200 hover:scale-110"
                style={{backgroundColor:`${cap.color}12`,color:cap.color}}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function CapabilitiesSection() {
  return (
    <section className="py-24 px-8 border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal><p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-3">核心能力</p><h2 className="text-[40px] font-semibold tracking-[-1px] mb-16">我能带来什么</h2></ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {capabilities.map((cap,i)=>(
            <CapCard key={cap.title} cap={cap} delay={i*0.15}/>
          ))}
        </div>
      </div>
    </section>
  );
}
