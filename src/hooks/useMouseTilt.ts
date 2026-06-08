import { useCallback, useRef } from 'react';

export function useMouseTilt(maxDeg = 3) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      ref.current.style.transition = 'none';
      ref.current.style.transform =
        `perspective(1000px) rotateY(${x * maxDeg}deg) rotateX(${-y * maxDeg}deg) translateY(-4px)`;
    },
    [maxDeg]
  );

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transition = 'transform 500ms ease-out';
    ref.current.style.transform =
      'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
