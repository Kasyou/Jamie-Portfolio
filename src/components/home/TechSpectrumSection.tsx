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
  backend: '3 个后端项目，企业级 SMS、量化交易、AI 内容流水线，高可靠架构',
  'cli-mcp': '2 个 CLI/MCP 工具，框架开发 + 可视化输出，开源生态贡献',
  mobile: '3 个移动端项目，React Native/Android 原生/Electron，跨平台实战',
  embedded: '3 个嵌入式项目，ESP32/STM32 裸机编程，从固件到 PCB 全链路',
};

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
            <ScrollReveal key={key} delay={i * 0.1}>
              <div className="card-base py-8 px-4 h-full">
                <p className="text-[34px] font-bold leading-none mb-2" style={{ color: meta.color }}>{meta.count}</p>
                <p className="text-sm font-semibold mb-3" style={{ color: meta.color }}>{meta.label}</p>
                <p className="text-text-secondary text-[12px] leading-relaxed whitespace-pre-line mb-4">{techDetails[key]}</p>
                <p className="text-text-secondary/60 text-[11px] leading-relaxed">{domainInfo[key]}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
