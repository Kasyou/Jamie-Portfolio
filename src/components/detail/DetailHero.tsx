import type { Project } from '../../types/project';
import { categoryMeta } from '../../data/projects';

interface Props {
  project: Project;
}

export default function DetailHero({ project }: Props) {
  const catColor = categoryMeta[project.category]?.color ?? '#58a6ff';
  const catLabel = categoryMeta[project.category]?.label ?? project.category;

  return (
    <section className="relative py-24 px-8 border-b border-white/5 overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full -translate-y-1/2 translate-x-1/4"
        style={{ background: `radial-gradient(circle, ${catColor}08 0%, transparent 70%)` }}
      />

      <div className="max-w-3xl mx-auto relative">
        <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-5">
          <span style={{ color: catColor }}>{catLabel}</span>
          {' · '}
          {project.meta.status === 'Live' && 'Live Demo'}
          {project.meta.status === 'Complete' && 'Completed'}
          {project.meta.status === 'Prototype' && 'Prototype'}
          {project.meta.status === 'Paused' && 'Paused'}
          {project.meta.status === 'WIP' && 'Work in Progress'}
        </p>

        <h1 className="text-[56px] font-light tracking-[-1.5px] leading-[1.08] mb-5">
          {project.name}
        </h1>

        <p className="text-text-secondary text-xl font-light max-w-xl leading-relaxed mb-10">
          {project.tagline}
        </p>

        <div className="flex gap-8">
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm border-b pb-0.5 transition-colors"
              style={{ color: catColor, borderColor: `${catColor}30` }}
            >
              Live Demo →
            </a>
          )}
          {project.links.source && (
            <a
              href={project.links.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary text-sm border-b border-text-secondary/20 pb-0.5 hover:text-text-primary transition-colors"
            >
              Source ↗
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
