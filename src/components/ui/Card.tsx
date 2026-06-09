import type { ReactNode } from 'react';
import { useMouseTilt } from '../../hooks/useMouseTilt';

interface Props {
  children: ReactNode;
  accentColor?: string;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, accentColor = '#58a6ff', className = '', onClick }: Props) {
  const { ref, onMouseMove, onMouseLeave } = useMouseTilt(3);

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`card-base cursor-pointer ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = `${accentColor}40`;
        e.currentTarget.style.boxShadow = `0 8px 30px ${accentColor}12`;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = '#222831';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {children}
    </div>
  );
}
