interface Props {
  color: string;
  children: string;
  className?: string;
}

export default function Tag({ color, children, className = '' }: Props) {
  return (
    <span
      className={`text-[10px] px-2.5 py-0.5 rounded-full tracking-wide font-medium ${className}`}
      style={{
        backgroundColor: `${color}18`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      {children}
    </span>
  );
}
