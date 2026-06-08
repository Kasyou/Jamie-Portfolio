import ScrollReveal from '../shared/ScrollReveal';
import { categoryMeta } from '../../data/projects';

export default function TechSpectrumSection() {
  const entries = Object.entries(categoryMeta);

  return (
    <section className="py-24 px-8 border-b border-white/5">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-3">
            Tech Spectrum
          </p>
          <h2 className="text-[36px] font-light tracking-[-1px] mb-16">
            One developer, <span className="text-frontend">five dimensions</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-5 gap-4 text-center">
          {entries.map(([key, meta], i) => (
            <ScrollReveal key={key} delay={i * 0.1}>
              <div
                className="rounded-2xl py-10 px-4"
                style={{
                  backgroundColor: `${meta.color}08`,
                  border: `1px solid ${meta.color}20`,
                }}
              >
                <p className="text-[28px] font-semibold" style={{ color: meta.color }}>
                  {meta.count}
                </p>
                <p className="text-sm font-medium mt-2" style={{ color: meta.color }}>
                  {meta.label}
                </p>
                <p className="text-text-secondary text-[11px] mt-3 leading-relaxed whitespace-pre-line">
                  {key === 'frontend' && 'React · TS\nTailwind · Electron\nFramer Motion'}
                  {key === 'backend' && 'Spring Boot · Python\nRabbitMQ · Redis\nMySQL · Docker'}
                  {key === 'cli-mcp' && 'Go CLI · MCP SDK\nTypeScript · npm\nVibeView · MCPX'}
                  {key === 'mobile' && 'React Native · Expo\nAndroid Java\nCapacitor'}
                  {key === 'embedded' && 'STM32 CMSIS\nESP32-S3 RTOS\nCustom Protocol'}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
