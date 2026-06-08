import { useNavigate } from 'react-router-dom';
import { useStarMapDrag } from '../../hooks/useStarMapDrag';
import { projects, categoryMeta } from '../../data/projects';

export default function StarMap() {
  const { rotation, onMouseDown, onMouseMove, onMouseUp } = useStarMapDrag();
  const navigate = useNavigate();

  // Place up to 12 projects on 3 concentric rings
  const rings = [140, 220, 300];
  const placed = projects.slice(0, 12);

  return (
    <section className="relative py-20 px-8 overflow-hidden border-b border-white/5 select-none">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-2">
          Project Universe
        </p>
        <p className="text-text-muted text-xs font-mono">
          drag to explore &middot; hover for details
        </p>
      </div>

      <div
        className="relative w-full h-[480px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* Orbit rings */}
        {rings.map((r) => (
          <div
            key={r}
            className="absolute rounded-full border border-white/[0.02]"
            style={{ width: r * 2, height: r * 2 }}
          />
        ))}

        {/* Rotating constellation */}
        <div
          className="relative"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Center node — Jamie */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center z-10">
            <span className="text-text-primary text-xs font-medium">Jamie</span>
          </div>

          {/* Project planet nodes */}
          {placed.map((project, i) => {
            const ringIdx = Math.floor(i / 5);
            const posInRing = (i % 5) / 5;
            const angle = posInRing * Math.PI * 2 + i * 0.3;
            const radius = rings[Math.min(ringIdx, rings.length - 1)];
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const catColor = categoryMeta[project.category]?.color ?? '#8b949e';
            const size = project.featured ? 20 : (project.meta.files.length > 5 ? 16 : 14);

            return (
              <div
                key={project.id}
                className="absolute rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-150 hover:z-20 group"
                style={{
                  width: size,
                  height: size,
                  left: `calc(50% + ${x}px - ${size / 2}px)`,
                  top: `calc(50% + ${y}px - ${size / 2}px)`,
                  backgroundColor: `${catColor}20`,
                  border: `1.5px solid ${catColor}50`,
                  boxShadow: project.featured ? `0 0 12px ${catColor}20` : 'none',
                }}
                onClick={() => navigate(`/projects/${project.id}`)}
                title={project.name}
              >
                {/* Tooltip on hover */}
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-text-secondary">
                  {project.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
