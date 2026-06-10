import { useRef, useCallback, useEffect } from 'react';

interface Props {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
}

export default function ImageViewer({ src, alt, open, onClose }: Props) {
  const elRef = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = elRef.current;
    if (!el) return;
    const rc = el.getBoundingClientRect();
    const x = (e.clientX - rc.left) / rc.width - 0.5;
    const y = (e.clientY - rc.top) / rc.height - 0.5;
    el.style.setProperty('--ix', `${e.clientX - rc.left}px`);
    el.style.setProperty('--iy', `${e.clientY - rc.top}px`);
    el.style.transition = 'none';
    el.style.transform = `perspective(1200px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  }, []);

  const onLeave = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    el.style.transition = 'transform 600ms cubic-bezier(0.34,1.56,0.64,1)';
    el.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg) scale(1)';
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-8" onClick={onClose}>
      <div
        ref={elRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-[90vw] max-h-[90vh] rounded-2xl overflow-hidden cursor-default"
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: '0 0 100px rgba(88,166,255,0.12), 0 0 200px rgba(167,139,250,0.06)',
        }}
      >
        <div className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
          style={{ background: 'radial-gradient(circle 500px at var(--ix,50%) var(--iy,50%), rgba(88,166,255,0.06), transparent 50%)' }}/>
        <img src={src} alt={alt} className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl relative z-0" />
        <button onClick={onClose} className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  );
}
