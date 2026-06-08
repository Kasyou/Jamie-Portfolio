import type { Project } from '../../types/project';

interface Props {
  project: Project;
}

export default function OverviewSection({ project }: Props) {
  return (
    <section className="py-20 px-8">
      <div className="max-w-3xl mx-auto flex gap-14 items-start">
        <div className="flex-shrink-0 w-60 aspect-[4/3] rounded-lg bg-surface border border-border flex items-center justify-center">
          <span className="text-5xl">{project.emoji}</span>
        </div>

        <div>
          <p className="text-text-secondary text-[11px] tracking-[2px] uppercase mb-4">
            项目概述
          </p>
          <p className="text-text-primary text-[17px] leading-relaxed mb-5">
            <span className="text-white font-medium">{project.problemStatement.split('.')[0]}.</span>
          </p>
          <p className="text-text-secondary text-[15px] leading-relaxed">
            {project.description}
          </p>

          {project.isHandBuilt && (
            <p className="mt-5 text-cli text-sm">
              ✦ 全程手写代码，未使用 AI 辅助。
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
