interface Props { projectId?: string; categoryColor: string; name: string; size?: number; featured?: boolean; }

export default function ProjectLogo({ categoryColor, name, size = 56, featured }: Props) {
  const initials = name.replace(/[a-z]/g,'').replace(/s/g,'').slice(0,2) || name.slice(0,2);
  return (
    <div className="relative flex-shrink-0" style={{width:size,height:size}}>
      <div className="w-full h-full rounded-2xl flex items-center justify-center relative overflow-hidden"
        style={{background:`linear-gradient(135deg,${categoryColor},${categoryColor}60)`,boxShadow:`0 0 ${featured?20:12}px ${categoryColor}30`}}>
        <span className="text-white font-bold select-none" style={{fontSize:size*0.32}}>{initials}</span>
      </div>
      {featured && (
        <div className="absolute -inset-1 rounded-2xl border-2 opacity-30 pointer-events-none" style={{borderColor:categoryColor}}/>
      )}
    </div>
  );
}
