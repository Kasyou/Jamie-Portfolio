import type { Project } from '../../types/project';

interface Props {
  project: Project;
}

export default function HighlightsSection({ project }: Props) {
  return (
    <section className="py-20 px-8 border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <p className="text-text-secondary text-[11px] tracking-[2px] uppercase mb-12">
          Highlights
        </p>

        <div className="space-y-14">
          {project.highlights.map((hl, i) => (
            <div key={i}>
              <h3 className="text-lg font-medium text-text-primary mb-3">
                {String(i + 1).padStart(2, '0')} — {hl.title}
              </h3>
              <p className="text-text-secondary text-[14px] leading-relaxed">
                {hl.text}
              </p>
              {hl.code && (
                <div className="mt-4 bg-surface border border-border rounded-lg p-5 font-mono text-xs leading-relaxed overflow-x-auto">
                  <pre className="text-text-secondary whitespace-pre-wrap">{hl.code}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
