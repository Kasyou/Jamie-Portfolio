import type { Project } from '../../types/project';

interface Props {
  project: Project;
}

export default function ProjectDataRow({ project }: Props) {
  return (
    <section className="py-14 px-8 border-t border-white/5">
      <div className="max-w-3xl mx-auto flex gap-20">
        <div>
          <p className="text-text-muted text-[10px] tracking-[2px] uppercase mb-2">
            代码规模
          </p>
          <p className="text-[28px] font-light text-text-primary">
            {project.meta.files}
          </p>
        </div>
        <div>
          <p className="text-text-muted text-[10px] tracking-[2px] uppercase mb-2">
            开发周期
          </p>
          <p className="text-[28px] font-light text-text-primary">
            {project.meta.timeline}
          </p>
        </div>
        <div>
          <p className="text-text-muted text-[10px] tracking-[2px] uppercase mb-2">
            状态
          </p>
          <p className="text-[28px] font-light" style={{ color: project.meta.status === 'Live' ? '#7ee787' : '#c9d1d9' }}>
            {project.meta.status}
          </p>
        </div>
        <div>
          <p className="text-text-muted text-[10px] tracking-[2px] uppercase mb-2">
            技术栈
          </p>
          <p className="text-text-secondary text-[13px] max-w-xs">
            {project.techStack.slice(0, 6).join(' · ')}
            {project.techStack.length > 6 && ` +${project.techStack.length - 6} more`}
          </p>
        </div>
      </div>
    </section>
  );
}
