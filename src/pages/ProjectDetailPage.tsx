import { useParams, Link } from 'react-router-dom';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="py-40 text-center">
      <p className="text-text-secondary text-lg">Project: {id}</p>
      <Link to="/projects" className="text-frontend text-sm mt-4 inline-block">
        ← Back to projects
      </Link>
    </div>
  );
}
