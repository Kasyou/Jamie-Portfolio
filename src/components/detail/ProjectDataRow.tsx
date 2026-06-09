import type { Project } from '../../types/project';

interface Props { project: Project; }

export default function ProjectDataRow({ project }: Props) {
  return (
    <section className="py-12 px-8 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        <div><p className="text-text-muted text-[10px] tracking-[2px] uppercase mb-2">代码规模</p><p className="text-2xl font-semibold text-text-primary">{project.meta.files}</p></div>
        <div><p className="text-text-muted text-[10px] tracking-[2px] uppercase mb-2">开发周期</p><p className="text-2xl font-semibold text-text-primary">{project.meta.timeline}</p></div>
        <div><p className="text-text-muted text-[10px] tracking-[2px] uppercase mb-2">状态</p><p className="text-2xl font-semibold" style={{ color: project.meta.status === 'Live' ? '#7ee787' : '#e6edf3' }}>{project.meta.status}</p></div>
        <div><p className="text-text-muted text-[10px] tracking-[2px] uppercase mb-2">技术栈</p><p className="text-text-secondary text-[13px] leading-relaxed max-w-[200px]">{project.techStack.slice(0, 5).join(' · ')}{project.techStack.length > 5 && ` +${project.techStack.length - 5} more`}</p></div>
      </div>
    </section>
  );
}
