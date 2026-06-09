import { useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../../types/project';
import { featuredProjects, categoryMeta } from '../../data/projects';
import Tag from '../ui/Tag';
import ScrollReveal from '../shared/ScrollReveal';
import ProjectLogo from '../shared/ProjectLogo';

function FeaturedCard({ project, color }: { project: Project; color: string }) {
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
    el.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-4px) scale(1.02)`;
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
    <Link to={`/projects/${project.id}`}>
      <div ref={elRef} onMouseMove={doTilt} onMouseLeave={onLeave}
        className="card-base p-7 group flex gap-5 h-full relative overflow-hidden"
        style={{'--glow':color, transformStyle:'preserve-3d'} as React.CSSProperties}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
          style={{background:`radial-gradient(circle 250px at var(--mx) var(--my), ${color}10, transparent)`}}/>
        <div className="relative z-10 flex gap-5 h-full w-full">
          <div className="flex-shrink-0 pt-1">
            <ProjectLogo projectId={project.id} categoryColor={color} name={project.name} size={52} featured />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Tag color={color}>{categoryMeta[project.category]?.label ?? project.category}</Tag>
              {project.isHandBuilt && <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-cli/15 text-cli">手写</span>}
            </div>
            <h3 className="text-lg font-semibold mb-1.5 group-hover:text-frontend transition-colors">{project.name}</h3>
            <p className="text-text-secondary text-[12px] leading-relaxed mb-4">{project.tagline}</p>
            <div className="flex gap-1 flex-wrap">
              {project.techStack.slice(0,5).map(t=><span key={t} className="text-[9px] px-2 py-0.5 rounded bg-elevated text-text-secondary">{t}</span>)}
            </div>
            {project.links.live && <p className="text-frontend text-[11px] mt-4 font-medium">在线演示 →</p>}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedWorkSection() {
  return (
    <section className="py-24 px-8 border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-3">精选项目</p>
          <h2 className="text-[40px] font-semibold tracking-[-1px] mb-16">跨越五个领域的{' '}<span className="text-accent">代表性作品</span></h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {featuredProjects.map((project, i) => (
            <ScrollReveal key={project.id} delay={i * 0.1}>
              <FeaturedCard project={project} color={categoryMeta[project.category]?.color ?? '#58a6ff'} />
            </ScrollReveal>
          ))}
        </div>
        <div className="text-center mt-12"><Link to="/projects" className="inline-flex items-center gap-2 text-frontend text-sm font-medium border-b border-frontend/30 pb-1 hover:border-frontend transition-colors">浏览全部 16 个项目 →</Link></div>
      </div>
    </section>
  );
}
