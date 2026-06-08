import { Link } from 'react-router-dom';
import { featuredProjects, categoryMeta } from '../../data/projects';
import Card from '../ui/Card';
import Tag from '../ui/Tag';
import ScrollReveal from '../shared/ScrollReveal';

export default function FeaturedWorkSection() {
  return (
    <section className="py-24 px-8 border-b border-white/5">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-text-secondary text-[11px] tracking-[3px] uppercase mb-3">
            Featured Work
          </p>
          <h2 className="text-[36px] font-light tracking-[-1px] mb-16">
            Selected projects that <span className="text-frontend">demonstrate range</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-5">
          {featuredProjects.map((project, i) => {
            const catColor = categoryMeta[project.category]?.color ?? '#58a6ff';
            return (
              <ScrollReveal key={project.id} delay={i * 0.1}>
                <Link to={`/projects/${project.id}`}>
                  <Card accentColor={catColor} className="p-7">
                    <Tag color={catColor}>{categoryMeta[project.category]?.label ?? project.category}</Tag>
                    <h3 className="text-xl font-medium mt-4 mb-2">{project.name}</h3>
                    <p className="text-text-secondary text-[13px] leading-relaxed mb-4">
                      {project.tagline}
                    </p>
                    <div className="flex gap-1.5 flex-wrap">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] px-2 py-0.5 rounded bg-elevated text-text-secondary"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="text-[10px] text-text-muted">+{project.techStack.length - 4}</span>
                      )}
                    </div>
                    {project.links.live && (
                      <p className="text-frontend text-[11px] mt-4">
                        Live Demo →
                      </p>
                    )}
                  </Card>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/projects"
            className="text-frontend text-sm border-b border-frontend/30 pb-1 hover:border-frontend transition-colors"
          >
            Browse all 16 projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
