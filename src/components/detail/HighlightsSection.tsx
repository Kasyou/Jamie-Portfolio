import type { Project } from '../../types/project';

interface Props { project: Project; }

export default function HighlightsSection({ project }: Props) {
  return (
    <section className="py-24 px-8 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto">
        <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-3">技术亮点</p>
        <h2 className="text-[36px] font-semibold tracking-[-1px] mb-16">深入 {project.name} 的技术实现</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {project.highlights.map((hl, i) => (
            <div key={i} className={project.highlights.length % 2 !== 0 && i === project.highlights.length - 1 ? 'md:col-span-2 md:max-w-2xl' : ''}>
              <div className="flex gap-4 mb-4 items-start">
                <span className="text-[40px] font-bold text-text-muted/20 leading-none flex-shrink-0">{String(i+1).padStart(2,'0')}</span>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-3">{hl.title}</h3>
                  <p className="text-text-secondary text-[14px] leading-relaxed">{hl.text}</p>
                  {hl.code && (
                    <div className="mt-4 bg-surface border border-border rounded-xl p-5 font-mono text-[11px] leading-relaxed overflow-x-auto">
                      <pre className="text-text-secondary whitespace-pre-wrap">{hl.code}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
