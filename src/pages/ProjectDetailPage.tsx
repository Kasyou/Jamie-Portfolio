import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/projects';
import DetailHero from '../components/detail/DetailHero';
import OverviewSection from '../components/detail/OverviewSection';
import TechStackSection from '../components/detail/TechStackSection';
import MindMapArchitecture from '../components/detail/MindMapArchitecture';
import HighlightsSection from '../components/detail/HighlightsSection';
import ProjectDataRow from '../components/detail/ProjectDataRow';
import ProjectNav from '../components/detail/ProjectNav';
import { motion } from 'framer-motion';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="py-40 text-center">
        <p className="text-lg text-text-secondary">项目未找到</p>
        <Link to="/projects" className="text-frontend text-sm mt-4 inline-block">返回项目列表</Link>
      </div>
    );
  }

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.3}}>
      <DetailHero project={project} />
      <OverviewSection project={project} />
      <TechStackSection project={project} />
      <MindMapArchitecture project={project} />
      <HighlightsSection project={project} />
      <ProjectDataRow project={project} />
      <ProjectNav currentId={project.id} />
    </motion.div>
  );
}
