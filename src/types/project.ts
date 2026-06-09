export type Category = 'frontend' | 'backend' | 'cli-mcp' | 'mobile' | 'embedded';

export interface ProjectMeta {
  files: string;
  timeline: string;
  status: 'Live' | 'Complete' | 'Prototype' | 'Paused' | 'WIP';
}

export interface Highlight {
  title: string;
  text: string;
  code?: string;
}

export interface Project {
  id: string;
  name: string;
  category: Category;
  tagline: string;
  description: string;
  problemStatement: string;
  techStack: string[];
  meta: ProjectMeta;
  highlights: Highlight[];
  links: {
    live?: string;
    source?: string;
    github?: string;
  };
  isHandBuilt: boolean;
  featured: boolean;
  emoji: string;
  screenshot?: string;
  logo?: string;
  heroImage?: string;
  colorHex?: string;
}
