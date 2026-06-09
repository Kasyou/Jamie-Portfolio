import StarMap from '../components/projects/StarMap';
import { Link } from 'react-router-dom';
import { projects, categoryMeta } from '../data/projects';
import { useMouseTilt } from '../hooks/useMouseTilt';
import ScrollReveal from '../components/shared/ScrollReveal';
import type { Project } from '../types/project';

const catOrder = ['frontend', 'backend', 'cli-mcp', 'mobile', 'embedded'];

function WideCard({ project }: { project: Project }) {
  const { ref, onMouseMove, onMouseLeave } = useMouseTilt(2);
  const cc = categoryMeta[project.category]?.color ?? '#58a6ff';
  return (
    <Link to={`/projects/${project.id}`}>
      <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className="card-base overflow-hidden group flex"
        style={{transformStyle:'preserve-3d'}} onMouseOver={e=>{e.currentTarget.style.borderColor=`${cc}50`; e.currentTarget.style.boxShadow=`0 8px 30px ${cc}10`}} onMouseOut={e=>{e.currentTarget.style.borderColor='#222831';e.currentTarget.style.boxShadow='none'}}>
        <div className="w-32 flex-shrink-0 relative overflow-hidden" style={{background:`linear-gradient(135deg,${cc}12,transparent 50%)`}}>
          {project.logo && <img src={project.logo} alt="" className="w-full h-full object-cover absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity" />}
          
        </div>
        <div className="flex-1 p-5 flex items-center gap-4 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-base font-semibold text-text-primary group-hover:text-frontend transition-colors">{project.name}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{backgroundColor:`${cc}12`,color:cc}}>{categoryMeta[project.category]?.label}</span>
              {project.isHandBuilt&&<span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-cli/15 text-cli">手写</span>}
              {project.featured&&<span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{backgroundColor:`${cc}12`,color:cc}}>精选</span>}
            </div>
            <p className="text-text-secondary text-[13px] leading-relaxed mb-2">{project.tagline}</p>
            <div className="flex gap-1.5 flex-wrap">{project.techStack.map(t=><span key={t} className="text-[10px] px-2 py-0.5 rounded bg-elevated text-text-secondary">{t}</span>)}</div>
            {project.links.live&&<p className="text-frontend text-[11px] mt-2 font-medium">在线演示 →</p>}
          </div>
          <div className="flex-shrink-0 text-right"><p className="text-text-muted text-[10px]">{project.meta.timeline}</p><p className="text-xs font-medium mt-0.5" style={{color:project.meta.status==='Live'?'#7ee787':'#8b949e'}}>{project.meta.status}</p></div>
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsPage() {
  return (
    <>
      <StarMap />
      <section className="py-12 px-8"><div className="max-w-7xl mx-auto"><div className="section-divider mb-10"/>
        {catOrder.map(key=>{const cp=projects.filter(p=>p.category===key);if(!cp.length)return null;const m=categoryMeta[key];return(
          <ScrollReveal key={key}><div className="mb-12"><div className="flex items-baseline gap-3 mb-4"><div className="w-3 h-3 rounded-sm" style={{backgroundColor:m.color}}/><h2 className="text-xl font-semibold" style={{color:m.color}}>{m.label}</h2><span className="text-text-muted text-xs font-mono">{m.count} 个项目</span></div><div className="space-y-2.5">{cp.map(p=><WideCard key={p.id} project={p}/>)}</div></div></ScrollReveal>
        );})}
      </div></section>
    </>
  );
}