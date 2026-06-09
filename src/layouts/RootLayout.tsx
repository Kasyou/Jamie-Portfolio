import { Outlet, Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/projects', label: '项目' },
];

export default function RootLayout() {
  const location = useLocation();
  return (
    <div
      className="min-h-screen text-text-primary font-sans"
      style={{
        backgroundColor: 'var(--color-void, #06080c)',
        backgroundImage: `radial-gradient(circle, rgba(180,200,230,0.12) 1px, transparent 1px),
          radial-gradient(ellipse 50% 60% at 25% 15%, rgba(88,166,255,0.10) 0%, transparent 55%),
          radial-gradient(ellipse 40% 50% at 70% 50%, rgba(167,139,250,0.08) 0%, transparent 55%),
          radial-gradient(ellipse 30% 35% at 55% 80%, rgba(126,231,135,0.05) 0%, transparent 55%)`,
        backgroundSize: '22px 22px, 100% 100%, 100% 100%, 100% 100%',
        backgroundAttachment: 'scroll, fixed, fixed, fixed',
      }}
    >
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/[0.04]" style={{backgroundColor:'rgba(6,8,12,0.85)'}}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-frontend to-cli flex items-center justify-center text-xs font-semibold text-white">J</div>
            <span className="text-text-primary font-semibold text-sm tracking-tight group-hover:text-frontend transition-colors">Jamie</span>
          </Link>
          <div className="flex items-center gap-6">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className={`text-sm transition-colors ${location.pathname===l.to?'text-frontend font-medium':'text-text-secondary hover:text-text-primary'}`}>{l.label}</Link>
            ))}
            <a href="https://github.com/Kasyou" target="_blank" rel="noopener noreferrer" className="ml-2 text-text-secondary hover:text-text-primary transition-colors" title="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </nav>
      <main className="pt-16"><Outlet /></main>
      <footer className="border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 flex flex-col items-center gap-6">
          <div className="flex gap-6 text-text-secondary text-sm"><a href="https://github.com/Kasyou" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">GitHub</a><span className="text-border">|</span><span>Guangzhou</span></div>
          <p className="text-text-muted text-xs">基于 React · Vite · Tailwind 构建 · 部署于 Netlify</p>
        </div>
      </footer>
    </div>
  );
}
