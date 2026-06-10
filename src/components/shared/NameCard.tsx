import { useRef, useCallback } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NameCard({ open, onClose }: Props) {
  const elRef = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = elRef.current;
    if (!el) return;
    const rc = el.getBoundingClientRect();
    const x = (e.clientX - rc.left) / rc.width - 0.5;
    const y = (e.clientY - rc.top) / rc.height - 0.5;
    el.style.setProperty('--cx', `${e.clientX - rc.left}px`);
    el.style.setProperty('--cy', `${e.clientY - rc.top}px`);
    el.style.transition = 'none';
    el.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  }, []);

  const onLeave = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    el.style.transition = 'transform 600ms cubic-bezier(0.34,1.56,0.64,1)';
    el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        ref={elRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={(e) => e.stopPropagation()}
        className="relative w-[500px] rounded-2xl py-10 px-8 flex gap-8"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(180,200,230,0.08) 0.5px, transparent 0.5px),
            linear-gradient(145deg, rgba(88,166,255,0.04) 0%, transparent 40%),
            linear-gradient(220deg, rgba(167,139,250,0.04) 0%, transparent 40%),
            linear-gradient(145deg, #0c1016 0%, #141a22 50%, #0e1219 100%)`,
          backgroundSize: '16px 16px, 100% 100%, 100% 100%, 100% 100%',
          border: '1px solid rgba(88,166,255,0.15)',
          boxShadow: '0 0 60px rgba(88,166,255,0.08), 0 0 120px rgba(167,139,250,0.05), 0 0 30px rgba(88,166,255,0.04) inset',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Edge glow */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle 400px at var(--cx,50%) var(--cy,50%), rgba(88,166,255,0.06), transparent 60%)',
          }}
        />

        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        {/* Left: info */}
        <div className="flex-1 relative z-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-text-primary mb-1">Jamie</h2>
          <p className="text-text-muted text-sm tracking-[2px] uppercase mb-6">全栈工程师<span className="text-frontend ml-2">Vibecoder</span></p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-text-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
              <span>1657690975@qq.com</span>
            </div>
            <div className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              <a href="https://github.com/Kasyou" target="_blank" rel="noopener noreferrer" className="text-frontend hover:underline">github.com/Kasyou</a>
            </div>
            <div className="flex items-center gap-3 text-text-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="10" r="3"/><path d="M12 2C7 2 3 6 3 10c0 4.5 3 8 9 10 6-2 9-5.5 9-10 0-4-4-8-9-8z"/></svg>
              <span>Guangzhou, China</span>
            </div>
          </div>
        </div>

        {/* Right: QR code */}
        <div className="flex-shrink-0 relative z-10 flex flex-col items-center justify-center">
          <div className="w-[140px] h-[140px] rounded-xl overflow-hidden border border-border" style={{boxShadow:'0 0 20px rgba(88,166,255,0.08)'}}>
            <img src="/profile/QRcode.jpg" alt="WeChat QR" className="w-full h-full object-contain scale-[1.75] -translate-y-[9px]" />
          </div>
          <p className="text-text-muted text-[10px] mt-2 tracking-wide">微信扫码联系</p>
        </div>
      </div>
    </div>
  );
}
