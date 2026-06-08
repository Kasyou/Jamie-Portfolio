import StatNumber from '../ui/StatNumber';
import ScrollReveal from '../shared/ScrollReveal';

export default function HeroSection() {
  return (
    <section className="relative py-28 px-8 text-center border-b border-white/5 overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full -translate-y-1/2 translate-x-1/4" style={{ background: 'radial-gradient(circle, rgba(88,166,255,0.06) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full translate-y-1/2 -translate-x-1/4" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)' }} />

      <ScrollReveal>
        <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-6">
          全栈开发者 · AI 原生构建者
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <h1 className="text-[64px] font-light tracking-[-1.5px] leading-[1.08] mb-5 max-w-3xl mx-auto">
          把想法变成{' '}
          <span className="text-frontend font-medium">落地的产品</span>
        </h1>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <p className="text-text-secondary text-[17px] max-w-[500px] mx-auto mb-16 leading-relaxed">
          不只是前端。不只是后端。{' '}
          <strong className="text-text-primary font-medium">
            React → Spring Boot → Go CLI → Android → ESP32 固件
          </strong>
          <br />从 React 到 STM32，横跨整个技术光谱。
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <div className="flex justify-center gap-16">
          <StatNumber value="16" label="已交付" color="#58a6ff" />
          <StatNumber value="5" label="领域" color="#7ee787" />
          <StatNumber value="6" label="语言" color="#a78bfa" />
          <StatNumber value="1yr" label="VIBECODING" color="#ff6b35" />
        </div>
      </ScrollReveal>
    </section>
  );
}
