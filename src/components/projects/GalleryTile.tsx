import { Link } from 'react-router-dom';
import { useMouseTilt } from '../../hooks/useMouseTilt';
import type { Project } from '../../types/project';
import { categoryMeta } from '../../data/projects';
import ProjectLogo from '../shared/ProjectLogo';

interface Props { project: Project; featured?: boolean; }

export default function GalleryTile({ project, featured = false }: Props) {
  const { ref, onMouseMove, onMouseLeave } = useMouseTilt(3);
  const catColor = categoryMeta[project.category]?.color ?? '#58a6ff';
  const width = featured ? 280 : 240;

  return (
    <Link to={`/projects/${project.id}`}>
      <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
        className="card-base overflow-hidden flex-shrink-0"
        style={{width,transformStyle:'preserve-3d'}}
        onMouseOver={e=>{e.currentTarget.style.borderColor=`${catColor}40`;e.currentTarget.style.boxShadow=`0 8px 30px ${catColor}12`}}
        onMouseOut={e=>{e.currentTarget.style.borderColor='#222831';e.currentTarget.style.boxShadow='none'}}>
        <div className="flex items-center justify-center relative h-[90px]" style={{background:`linear-gradient(135deg,${catColor}15 0%,transparent 60%)`}}>
          <ProjectLogo projectId={project.id} categoryColor={catColor} name={project.name} size={44} featured={featured} />
          {featured && <span className="absolute top-3 right-3 text-[10px] px-2.5 py-0.5 rounded-full font-medium" style={{backgroundColor:`${catColor}18`,color:catColor}}>精选</span>}
        </div>
        <div className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-1.5">{project.name}</h3>
          <p className="text-text-secondary text-[11px] leading-relaxed mb-3 line-clamp-2">{project.tagline}</p>
          <span className="text-[9px] px-1.5 py-0.5 rounded font-medium" style={{backgroundColor:`${catColor}10`,color:catColor}}>{categoryMeta[project.category]?.label}</span>
        </div>
      </div>
    </Link>
  );
}
