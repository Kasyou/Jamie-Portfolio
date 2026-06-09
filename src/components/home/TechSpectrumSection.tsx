import { useRef, useCallback, useState } from 'react';
import ScrollReveal from '../shared/ScrollReveal';
import { categoryMeta } from '../../data/projects';

const techDetails: Record<string, string> = {
  frontend: 'React · TS\nTailwind · Electron\nFramer Motion',
  backend: 'Spring Boot · Python\nRabbitMQ · Redis\nMySQL · Docker',
  'cli-mcp': 'Go CLI · MCP SDK\nTypeScript · npm\nVibeView · MCPX',
  mobile: 'React Native · Expo\nAndroid Java\nCapacitor',
  embedded: 'STM32 CMSIS\nESP32-S3 RTOS\n自定义协议',
};

const domainInfo: Record<string, string> = {
  frontend: '5 个前端项目，涵盖 Web 应用、桌面端、游戏，React/Electron/WPF 多框架掌控',
  backend: '2 个后端项目，企业级 SMS、量化交易系统，高可靠架构',
  'cli-mcp': '2 个 CLI/MCP 工具，框架开发 + 可视化输出，开源生态贡献',
  mobile: '3 个移动端项目，React Native/Android 原生/Electron，跨平台实战',
  embedded: '4 个嵌入式项目，ESP32/STM32/Linux，从裸机到系统级全链路',
};

function SpectrumCard({ color, count, label, details, info, delay }: { color: string; count: number; label: string; details: string; info: string; delay: number }) {
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
    el.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px) scale(1.02)`;
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
        className="card-base py-8 px-4 h-full text-center relative overflow-hidden group"
        style={{'--glow':color, transformStyle:'preserve-3d'} as React.CSSProperties}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
          style={{background:`radial-gradient(circle 180px at var(--mx) var(--my), ${color}10, transparent)`}}/>
        <div className="relative z-10">
          <p className="text-[34px] font-bold leading-none mb-2" style={{color}}>{count}</p>
          <p className="text-sm font-semibold mb-3" style={{color}}>{label}</p>
          <p className="text-text-secondary text-[12px] leading-relaxed whitespace-pre-line mb-4">{details}</p>
          <p className="text-text-secondary/60 text-[11px] leading-relaxed">{info}</p>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function TechSpectrumSection() {
  const entries = Object.entries(categoryMeta);
  return (
    <section className="py-24 px-8 border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-3">技术光谱</p>
          <h2 className="text-[40px] font-semibold tracking-[-1px] mb-16">一个开发者，<span className="text-accent">五个维度</span></h2>
        </ScrollReveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
          {entries.map(([key, meta], i) => (
            <SpectrumCard key={key} color={meta.color} count={meta.count} label={meta.label} details={techDetails[key]} info={domainInfo[key]} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
