import StatNumber from '../ui/StatNumber';
import ScrollReveal from '../shared/ScrollReveal';
import heroBg from '../../assets/screenshots/hero-bg.png';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] px-8 flex items-center justify-center border-b border-white/[0.04] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-[0.28]" />
        <div className="absolute inset-0 bg-gradient-to-b from-void/80 via-void/45 to-void" />
      </div>
      <div className="absolute top-0 right-0 w-[900px] h-[900px] rounded-full -translate-y-1/2 translate-x-1/4 z-0" style={{ background: 'radial-gradient(circle, rgba(88,166,255,0.12) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full translate-y-1/3 -translate-x-1/4 z-0" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)' }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full z-0 opacity-25" style={{ background: 'radial-gradient(circle, rgba(126,231,135,0.06) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 z-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <ScrollReveal><p className="text-frontend text-[11px] tracking-[4px] uppercase mb-6 font-semibold">全栈开发者 &middot; AI 原生构建者</p></ScrollReveal>
        <ScrollReveal delay={0.1}><h1 className="text-[72px] sm:text-[88px] font-bold tracking-[-2px] leading-[0.95] mb-6 max-w-5xl mx-auto">把想法变成{' '}<span className="text-accent">落地产品</span></h1></ScrollReveal>
        <ScrollReveal delay={0.2}><p className="text-text-secondary text-[18px] max-w-[540px] mx-auto mb-16 leading-relaxed">不只是前端。不只是后端。<br /><strong className="text-text-primary font-medium">React → Spring Boot → Go CLI → Android → 嵌入式软硬件</strong><br /><span className="text-[15px]">从像素到寄存器，横跨整个技术光谱。</span></p></ScrollReveal>
        <ScrollReveal delay={0.3}><div className="flex justify-center gap-20 flex-wrap"><StatNumber value="16" label="已交付" color="#58a6ff" /><StatNumber value="5" label="领域" color="#7ee787" /><StatNumber value="6" label="语言" color="#a78bfa" /><StatNumber value="12m" label="VibeCoding" color="#ff6b35" /></div></ScrollReveal>
      </div>
    </section>
  );
}
