import { Link } from 'react-router-dom';
import { useMouseTilt } from '../../hooks/useMouseTilt';
import type { Project } from '../../types/project';
import { categoryMeta } from '../../data/projects';

interface Props {
  project: Project;
  featured?: boolean;
}

export default function GalleryTile({ project, featured = false }: Props) {
  const { ref, onMouseMove, onMouseLeave } = useMouseTilt(3);
  const catColor = categoryMeta[project.category]?.color ?? '#58a6ff';
  const width = featured ? 280 : 230;
  const height = featured ? 140 : 110;

  return (
    <Link to={`/projects/${project.id}`}>
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="flex-shrink-0 bg-surface border border-border rounded-[20px] overflow-hidden transition-[border-color,box-shadow] duration-300"
        style={{
          width,
          transformStyle: 'preserve-3d',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = `${catColor}40`;
          e.currentTarget.style.boxShadow = `0 8px 30px ${catColor}10`;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = '#21262d';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Preview area with gradient */}
        <div
          className="flex items-center justify-center relative"
          style={{
            height,
            background: `linear-gradient(135deg, ${catColor}15 0%, transparent 60%)`,
          }}
        >
          <span className="text-4xl">{project.emoji}</span>
          {featured && (
            <span
              className="absolute top-3 right-3 text-[10px] px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: `${catColor}18`, color: catColor }}
            >
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-base font-medium text-text-primary mb-1">{project.name}</h3>
          <p className="text-text-secondary text-[11px] leading-relaxed mb-3 line-clamp-2">
            {project.tagline}
          </p>
          <div className="flex gap-1 flex-wrap">
            {project.techStack.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[9px] px-1.5 py-0.5 rounded"
                style={{ backgroundColor: `${catColor}08`, color: catColor }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
