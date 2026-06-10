import { useState } from 'react';
import type { Project } from '../../types/project';
import { categoryMeta } from '../../data/projects';
import ImageViewer from '../shared/ImageViewer';

interface Props { project: Project; }

export default function DetailHero({ project }: Props) {
  const catColor = categoryMeta[project.category]?.color ?? '#58a6ff';
  const [viewer, setViewer] = useState<{src:string;alt:string}|null>(null);
  const catLabel = categoryMeta[project.category]?.label ?? project.category;
  const statusMap: Record<string,string> = {Live:'在线',Complete:'已完成',Prototype:'原型',Paused:'暂停',WIP:'开发中'};

  return (
    <section className="relative py-32 px-8 border-b border-white/[0.04] overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.05]" style={{backgroundImage:'radial-gradient(circle,rgba(200,210,230,0.5) 1px,transparent 1px)',backgroundSize:'20px 20px'}}/>
      <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full -translate-y-1/2 translate-x-1/3 z-0" style={{background:`radial-gradient(circle,${catColor}12 0%,transparent 70%)`}}/>

      <div className="max-w-7xl mx-auto relative z-10 flex gap-12 items-start">
        <div className="flex-1">
          <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-5">
            <span style={{color:catColor}} className="font-semibold">{catLabel}</span>{' · '}{statusMap[project.meta.status]||project.meta.status}
            {project.isHandBuilt && <span className="ml-3 text-xs bg-cli/15 text-cli px-2 py-0.5 rounded-full">全程手写</span>}
          </p>
          <h1 className="text-[56px] font-bold tracking-[-1.5px] leading-[1.05] mb-4">{project.name}</h1>
          <p className="text-text-secondary text-xl font-light max-w-xl leading-relaxed mb-6">{project.tagline}</p>
          <div className="flex gap-10 mb-6">
            <div><p className="text-text-muted text-[10px] tracking-[2px] uppercase mb-1">规模</p><p className="text-2xl font-semibold text-text-primary">{project.meta.files}</p></div>
            <div><p className="text-text-muted text-[10px] tracking-[2px] uppercase mb-1">周期</p><p className="text-2xl font-semibold text-text-primary">{project.meta.timeline}</p></div>
            <div><p className="text-text-muted text-[10px] tracking-[2px] uppercase mb-1">状态</p><p className="text-2xl font-semibold" style={{color:project.meta.status==='Live'?'#7ee787':'#e6edf3'}}>{project.meta.status}</p></div>
          </div>
          <div className="flex gap-8">
            {project.links.github && <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium border-b pb-0.5 transition-colors" style={{color:catColor,borderColor:`${catColor}30`}}>在 Github 中查看</a>}
            {project.links.live && <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="text-sm font-medium border-b pb-0.5 transition-colors" style={{color:"#7ee787",borderColor:"#7ee78730"}}>在线演示 →</a>}
            {project.links.source && <a href={project.links.source} target="_blank" rel="noopener noreferrer" className="text-text-secondary text-sm font-medium border-b border-text-secondary/20 pb-0.5 hover:text-text-primary transition-colors">源代码 →</a>}
          </div>
        </div>
        <div className={`flex-shrink-0 w-[400px] rounded-xl bg-surface border border-border overflow-hidden self-start mt-[40px] cursor-pointer ${project.id==='ccmonitor'?'h-[261px]':'h-[225px]'}`} style={{boxShadow:`0 0 50px ${catColor}10`}} onClick={()=>{if(project.heroImage||project.logo)setViewer({src:(project.heroImage||project.logo)!,alt:project.name})}}>
          {project.heroImage || project.logo ? <img src={project.heroImage || project.logo} alt={project.name} className="w-full h-full object-cover pointer-events-none" /> : (
            <div className="w-full h-full flex items-center justify-center" style={{background:`linear-gradient(135deg,${catColor}15,transparent 60%)`}}>
              <span className="text-5xl">{project.emoji}</span>
            </div>
          )}
        </div>
      </div>
      <ImageViewer src={viewer?.src??''} alt={viewer?.alt??''} open={!!viewer} onClose={()=>setViewer(null)}/>
    </section>
  );
}