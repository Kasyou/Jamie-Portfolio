import { useState } from 'react';
import type { Project } from '../../types/project';
import { categoryMeta } from '../../data/projects';
import ProjectLogo from '../shared/ProjectLogo';
import ImageViewer from '../shared/ImageViewer';

interface Props { project: Project; }
export default function OverviewSection({ project }: Props) {
  const catColor = categoryMeta[project.category]?.color ?? '#58a6ff';
  const [viewer, setViewer] = useState<{src:string;alt:string}|null>(null);
  return (
    <section className="pt-2 pb-24 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-14 items-start">
          <div className={`flex-shrink-0 w-full ${project.id==='coboard'?'md:w-[435px]':'md:w-[420px]'} flex flex-col gap-3`}>
            <div className="rounded-xl bg-surface border border-border overflow-hidden cursor-pointer" style={project.id==='weather-report'?{boxShadow:`0 0 50px ${catColor}10`,height:'409px',backgroundImage:'radial-gradient(circle,rgba(200,210,240,0.06) 1px,transparent 1px)',backgroundSize:'20px 20px'}:project.id==='coboard'?{boxShadow:`0 0 50px ${catColor}10`,height:'250px'}:project.id==='ccmonitor'?{boxShadow:`0 0 50px ${catColor}10`,height:'300px'}:{boxShadow:`0 0 50px ${catColor}10`,aspectRatio:project.id==='aiwaifu'?'16/9':'3/2'}} onClick={()=>{const src=`/screenshots/${project.id}/${project.id}-${project.id==='ccmonitor'?'menu':'main'}.png`;setViewer({src,alt:project.name})}}>
              <img src={`/screenshots/${project.id}/${project.id}-${project.id==='ccmonitor'?'menu':'main'}.png`} alt={project.name} className="w-full h-full object-cover pointer-events-none"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="w-full h-full flex items-center justify-center" style={{background:`linear-gradient(135deg,${catColor}10,transparent 60%)`}}>
                  <ProjectLogo projectId={project.id} categoryColor={catColor} name={project.name} size={80} featured={project.featured} />
                </div>
            </div>
            {project.id === 'coboard' && (
              <div className="rounded-xl border border-border overflow-hidden cursor-pointer" style={{boxShadow:`0 0 50px ${catColor}06`,height:'250px'}} onClick={()=>{const src=`/screenshots/${project.id}/${project.id}-menu.png`;setViewer({src,alt:`${project.name} menu`})}}>
                <img src={`/screenshots/${project.id}/${project.id}-menu.png`} alt={`${project.name} menu`} className="w-full h-full object-cover pointer-events-none" />
              </div>
            )}
          </div>
          <ImageViewer src={viewer?.src??''} alt={viewer?.alt??''} open={!!viewer} onClose={()=>setViewer(null)}/>
          <div className="flex-1">
            <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-6">项目概述</p>
            <div className="mb-8"><h3 className="text-xs font-semibold text-text-muted uppercase tracking-[2px] mb-3">解决的问题</h3><p className="text-text-primary text-xl font-semibold leading-relaxed">{project.problemStatement}</p></div>
            <div className="mb-8"><h3 className="text-xs font-semibold text-text-muted uppercase tracking-[2px] mb-3">解决方案</h3><p className="text-text-secondary text-[15px] leading-relaxed whitespace-pre-line">{project.description}</p></div>
            <div className={`flex flex-wrap gap-10 border-t border-white/[0.04] ${'pt-3'}`}>
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