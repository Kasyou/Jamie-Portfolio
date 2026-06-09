import type { Project } from '../../types/project';
import { categoryMeta } from '../../data/projects';
import ProjectLogo from '../shared/ProjectLogo';

interface Props { project: Project; }
export default function OverviewSection({ project }: Props) {
  const catColor = categoryMeta[project.category]?.color ?? '#58a6ff';
  return (
    <section className="py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-14 items-start">
          <div className="flex-shrink-0 w-full md:w-[420px] rounded-xl bg-surface border border-border overflow-hidden" style={project.id==='weather-report'?{boxShadow:`0 0 50px ${catColor}10`,height:'532px',backgroundImage:'radial-gradient(circle,rgba(200,210,240,0.06) 1px,transparent 1px)',backgroundSize:'28px 28px'}:{boxShadow:`0 0 50px ${catColor}10`,aspectRatio:project.id==='coboard'||project.id==='aiwaifu'?'16/9':'3/2'}}>
            <img src={`/screenshots/${project.id}/${project.id}-main.png`} alt={project.name} className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="w-full h-full flex items-center justify-center" style={{background:`linear-gradient(135deg,${catColor}10,transparent 60%)`}}>
                <ProjectLogo projectId={project.id} categoryColor={catColor} name={project.name} size={80} featured={project.featured} />
              </div>
          </div>
          <div className="flex-1">
            <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-6">项目概述</p>
            <div className="mb-8"><h3 className="text-xs font-semibold text-text-muted uppercase tracking-[2px] mb-3">解决的问题</h3><p className="text-text-primary text-xl font-semibold leading-relaxed">{project.problemStatement}</p></div>
            <div className="mb-8"><h3 className="text-xs font-semibold text-text-muted uppercase tracking-[2px] mb-3">解决方案</h3><p className="text-text-secondary text-[15px] leading-relaxed">{project.description}</p></div>
            <div className="flex flex-wrap gap-10 pt-8 border-t border-white/[0.04]">
              <div><p className="text-text-muted text-[10px] tracking-[2px] uppercase mb-1">代码规模</p><p className="text-lg font-semibold text-text-primary">{project.meta.files}</p></div>
              <div><p className="text-text-muted text-[10px] tracking-[2px] uppercase mb-1">开发周期</p><p className="text-lg font-semibold text-text-primary">{project.meta.timeline}</p></div>
              <div><p className="text-text-muted text-[10px] tracking-[2px] uppercase mb-1">状态</p><p className="text-lg font-semibold" style={{color:project.meta.status==='Live'?'#7ee787':'#e6edf3'}}>{project.meta.status}</p></div>
              <div><p className="text-text-muted text-[10px] tracking-[2px] uppercase mb-1">构建方式</p><p className="text-lg font-semibold" style={{color:project.isHandBuilt?'#a78bfa':'#58a6ff'}}>{project.isHandBuilt?'全程手写':'AI 辅助构建'}</p></div>
            </div>
            {project.isHandBuilt && <div className="mt-6 inline-flex items-center gap-2 bg-cli/10 text-cli text-sm px-4 py-2 rounded-lg"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>全程手写代码，未使用 AI 辅助。独立构建理解从头到尾每个细节。</div>}
          </div>
        </div>
      </div>
    </section>
  );
}