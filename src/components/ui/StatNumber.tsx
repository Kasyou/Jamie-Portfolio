interface Props {
  value: string;
  label: string;
  color?: string;
}

export default function StatNumber({ value, label, color = '#58a6ff' }: Props) {
  return (
    <div>
      <p className="text-[40px] font-medium tracking-tight leading-none" style={{ color }}>
        {value}
      </p>
      <p className="text-text-secondary text-[11px] tracking-widest uppercase mt-1">
        {label}
      </p>
    </div>
  );
}
