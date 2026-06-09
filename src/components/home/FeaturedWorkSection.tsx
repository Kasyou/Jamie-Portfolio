import { Link } from 'react-router-dom';
import { featuredProjects, categoryMeta } from '../../data/projects';
import Tag from '../ui/Tag';
import ScrollReveal from '../shared/ScrollReveal';
import ProjectLogo from '../shared/ProjectLogo';

export default function FeaturedWorkSection() {
  return (
    <section className="py-24 px-8 border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-3">精选项目</p>
          <h2 className="text-[40px] font-semibold tracking-[-1px] mb-16">跨越五个领域的{' '}<span className="text-accent">代表性作品</span></h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {featuredProjects.map((project,i)=>{
            const c=categoryMeta[project.category]?.color??'#58a6ff';
            return (
              <ScrollReveal key={project.id} delay={i*0.1}>
                <Link to={`/projects/${project.id}`}>
                  <div className="card-base p-7 group flex gap-5 h-full" style={{'--card-accent':c} as React.CSSProperties}>
                    <div className="flex-shrink-0 pt-1">
                      <ProjectLogo projectId={project.id} categoryColor={c} name={project.name} size={52} featured />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag color={c}>{categoryMeta[project.category]?.label??project.category}</Tag>
                        {project.isHandBuilt && <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-cli/15 text-cli">手写</span>}
                      </div>
                      <h3 className="text-lg font-semibold mb-1.5 group-hover:text-frontend transition-colors">{project.name}</h3>
                      <p className="text-text-secondary text-[12px] leading-relaxed mb-4">{project.tagline}</p>
                      <div className="flex gap-1 flex-wrap">
                        {project.techStack.slice(0,5).map(t=><span key={t} className="text-[9px] px-2 py-0.5 rounded bg-elevated text-text-secondary">{t}</span>)}
                      </div>
                      {project.links.live&&<p className="text-frontend text-[11px] mt-4 font-medium">在线演示 →</p>}
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
        <div className="text-center mt-12"><Link to="/projects" className="inline-flex items-center gap-2 text-frontend text-sm font-medium border-b border-frontend/30 pb-1 hover:border-frontend transition-colors">浏览全部 16 个项目 →</Link></div>
      </div>
    </section>
  );
}
