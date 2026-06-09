import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStarMapDrag } from '../../hooks/useStarMapDrag';
import { projects, categoryMeta } from '../../data/projects';

function rot3d(x: number, y: number, z: number, rx: number, ry: number) {
  const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
  const x1 = x * cy + z * sy; const z1 = -x * sy + z * cy;
  const y1 = y * cx - z1 * sx; const z2 = y * sx + z1 * cx;
  const p = 650;
  return { sx: x1 * p/(p+z2), sy: y1 * p/(p+z2), scale: p/(p+z2), z: z2 };
}

const catOrder = ['frontend', 'backend', 'cli-mcp', 'mobile', 'embedded'] as const;
const radii = [150, 180, 210, 240, 270];

export default function StarMap() {
  const { rotX, rotY, onMouseDown, onMouseMove, onMouseUp } = useStarMapDrag();
  const nav = useNavigate();
  const rx = rotX * Math.PI / 180, ry = rotY * Math.PI / 180;

  const nodes = useMemo(() => {
    const result: { project: typeof projects[0]; x: number; y: number; z: number }[] = [];
    for (let ci = 0; ci < catOrder.length; ci++) {
      const cat = catOrder[ci];
      const catProjs = projects.filter(p => p.category === cat);
      const inclination = ci * Math.PI / 5;
      const startAngle = ci * Math.PI / 10; // staggered starts
      for (let pi = 0; pi < catProjs.length; pi++) {
        const theta = startAngle + (pi * Math.PI * 2) / catProjs.length;
        result.push({
          project: catProjs[pi],
          x: Math.cos(theta) * radii[ci],
          y: Math.sin(inclination) * Math.sin(theta) * radii[ci],
          z: Math.cos(inclination) * Math.sin(theta) * radii[ci],
        });
      }
    }
    return result;
  }, []);

  const projected = nodes
    .map(n => { const p = rot3d(n.x, n.y, n.z, rx, ry); return { ...n, ...p }; })
    .sort((a, b) => a.z - b.z);

  return (
    <section className="relative py-14 px-8 overflow-hidden select-none border-b border-white/[0.04]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full opacity-50 z-0"
        style={{background:'radial-gradient(circle,rgba(88,166,255,0.10)0%,rgba(167,139,250,0.06)20%,rgba(126,231,135,0.03)50%,transparent 70%)'}}/>

      <div className="relative z-10 text-center mb-1">
        <p className="text-text-muted text-[10px] tracking-[4px] uppercase mb-1">Interactive Constellation</p>
        <h1 className="text-[56px] sm:text-[68px] font-bold tracking-[-1.5px]"><span className="text-accent">项目宇宙</span></h1>
        <p className="text-text-secondary text-[13px] mt-2 font-mono text-xs">拖动旋转探索 · 悬停查看详情 · 点击进入项目</p>
      </div>

      <div className="relative w-full h-[600px] flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>

        {/* Orbit ring traces */}
        {catOrder.map((cat, ci) => (
          <div key={cat} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              width: radii[ci]*2, height: radii[ci]*2,
              border: `1px solid rgba(255,255,255,${0.04-ci*0.005})`,
              transform: `rotateX(${65+ci*5}deg)`,
            }}/>
        ))}

        {projected.map(({project, sx, sy, scale, z}) => {
          const cc = categoryMeta[project.category]?.color ?? '#8b949e';
          const baseSize = project.featured ? 50 : 40;
          const op = 0.4 + scale * 0.6;
          return (
            <div key={project.id} className="absolute cursor-pointer group"
              style={{
                width: baseSize, height: baseSize,
                left: `calc(50% + ${sx}px - ${baseSize/2}px)`,
                top: `calc(50% + ${sy}px - ${baseSize/2}px)`,
                zIndex: 10 + Math.round(scale * 40),
                opacity: op,
              }}
              onClick={() => nav(`/projects/${project.id}`)}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.4)'; e.currentTarget.style.zIndex = '200'; e.currentTarget.style.opacity = '1';
                const orb = e.currentTarget.querySelector('.star-orb') as HTMLElement;
                if (orb) { orb.style.boxShadow = `0 0 30px ${cc}90,0 0 60px ${cc}35`; orb.style.borderColor=cc; orb.style.backgroundColor=`${cc}55`; }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.zIndex=`${10+Math.round(scale*40)}`; e.currentTarget.style.opacity=`${op}`;
                const orb = e.currentTarget.querySelector('.star-orb') as HTMLElement;
                if (orb) { orb.style.boxShadow=`0 0 ${project.featured?18:12}px ${cc}50`; orb.style.borderColor=`${cc}70`; orb.style.backgroundColor=`${cc}35`; }
              }}>
              <div className="star-orb w-full h-full rounded-full border-2 flex items-center justify-center transition-all duration-300"
                style={{backgroundColor:`${cc}35`,borderColor:`${cc}70`,boxShadow:`0 0 ${project.featured?18:12}px ${cc}50`}}>
                <span className="text-[10px] font-bold text-white/90 text-center leading-tight pointer-events-none px-1">
                  {project.name.replace(/[a-z]/g,'').slice(0,3)||project.name.slice(0,2)}
                </span>
              </div>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface border border-border px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
                <p className="text-[10px] font-semibold text-text-primary">{project.name}</p>
                <p className="text-[8px]" style={{color:cc}}>{categoryMeta[project.category]?.label}</p>
              </div>
            </div>
          );
        })}

        {/* Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full z-40 flex items-center justify-center pointer-events-none"
          style={{background:'radial-gradient(circle at 40% 35%, rgba(88,166,255,0.85), rgba(88,166,255,0.4) 45%, rgba(167,139,250,0.2) 80%, transparent)',border:'2px solid rgba(88,166,255,0.7)',boxShadow:'0 0 30px rgba(88,166,255,0.5), 0 0 80px rgba(167,139,250,0.3), 0 0 6px rgba(88,166,255,0.7) inset'}}>
          <span className="text-[13px] font-bold text-white drop-shadow-lg">Jamie</span>
        </div>
      </div>
    </section>
  );
}
