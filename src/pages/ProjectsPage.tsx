import StarMap from '../components/projects/StarMap';
import GalleryBand from '../components/projects/GalleryBand';
import { projects } from '../data/projects';

const categoryOrder = ['frontend', 'backend', 'cli-mcp', 'mobile', 'embedded'];

export default function ProjectsPage() {
  return (
    <>
      <StarMap />

      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-3">
            项目索引
          </p>
          <h2 className="text-[40px] font-light tracking-[-1px] mb-3">
            我构建过的项目
          </h2>
          <p className="text-text-muted text-sm font-mono mb-16">
            ~ $ tree projects/ --by-category
          </p>

          {categoryOrder.map((key) => {
            const catProjects = projects.filter((p) => p.category === key);
            if (catProjects.length === 0) return null;
            return (
              <GalleryBand key={key} categoryKey={key} projects={catProjects} />
            );
          })}
        </div>
      </section>
    </>
  );
}
