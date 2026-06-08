import { Link } from 'react-router-dom';
import { projects } from '../../data/projects';

interface Props {
  currentId: string;
}

export default function ProjectNav({ currentId }: Props) {
  const idx = projects.findIndex((p) => p.id === currentId);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx < projects.length - 1 ? projects[idx + 1] : null;

  return (
    <section className="py-10 px-8 border-t border-white/5">
      <div className="max-w-3xl mx-auto flex justify-between items-center">
        {prev ? (
          <Link to={`/projects/${prev.id}`} className="text-text-secondary text-sm hover:text-text-primary transition-colors">
            ← {prev.name}
          </Link>
        ) : (
          <span />
        )}
        <Link to="/projects" className="text-text-secondary text-sm hover:text-text-primary transition-colors">
          All projects
        </Link>
        {next ? (
          <Link to={`/projects/${next.id}`} className="text-text-secondary text-sm hover:text-text-primary transition-colors">
            {next.name} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </section>
  );
}
