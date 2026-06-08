import { Outlet, Link, useLocation } from 'react-router-dom';
import MiniTerminal from '../components/shared/MiniTerminal';

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/projects', label: '项目' },
];

export default function RootLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-void text-text-primary font-sans">
      {/* Fixed Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-void/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-text-primary font-semibold text-sm tracking-tight">
            Jamie
          </Link>
          <div className="flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm transition-colors ${
                  location.pathname === link.to
                    ? 'text-text-primary border-b border-frontend pb-1'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer>
        <MiniTerminal />
      </footer>
    </div>
  );
}
