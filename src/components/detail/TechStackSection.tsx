import type { Project } from '../../types/project';
import { categoryMeta } from '../../data/projects';

interface Props { project: Project; }

export default function TechStackSection({ project }: Props) {
  const catColor = categoryMeta[project.category]?.color ?? '#58a6ff';

  return (
    <section className="py-[50px] px-8 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto">
        <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-12">技术栈详情</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {project.techStack.map((tech) => (
            <div key={tech} className="card-base p-4 text-center group overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-0.5 transition-all duration-300 group-hover:h-full" style={{background:`linear-gradient(180deg,${catColor}15,${catColor}05)`}}/>
              <span className="relative z-10 text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">{tech}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
