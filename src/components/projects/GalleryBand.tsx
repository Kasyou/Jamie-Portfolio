import type { Project } from '../../types/project';
import { categoryMeta } from '../../data/projects';
import GalleryTile from './GalleryTile';
import ScrollReveal from '../shared/ScrollReveal';

interface Props {
  categoryKey: string;
  projects: Project[];
}

export default function GalleryBand({ categoryKey, projects }: Props) {
  const meta = categoryMeta[categoryKey];
  if (!meta) return null;

  return (
    <ScrollReveal>
      <div className="mb-12">
        <div className="flex items-baseline gap-4 mb-6">
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: meta.color }} />
          <h3 className="text-lg font-medium" style={{ color: meta.color }}>
            {meta.label}
          </h3>
          <span className="text-border text-xs">{meta.count} projects</span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory">
          {projects.map((project) => (
            <div key={project.id} className="snap-start">
              <GalleryTile project={project} featured={project.featured} />
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
