import { useState, useCallback, useRef, useEffect } from 'react';

export function useStarMapDrag() {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const rafRef = useRef<number>(0);

  // Animation loop: apply velocity friction + slow auto-rotation when idle
  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (!isDragging) {
        setRotation((prev) => {
          const next = prev + velocity;
          setVelocity((v) => {
            if (Math.abs(v) < 0.01) return 0;
            return v * 0.97;
          });
          // Slow auto-rotation when nearly still
          if (Math.abs(velocity) < 0.05) {
            return prev + 0.03 * (dt / 16);
          }
          return next;
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isDragging, velocity]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    lastX.current = e.clientX;
    lastTime.current = performance.now();
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX.current;
      const now = performance.now();
      const dt = now - lastTime.current;
      if (dt > 0) {
        setVelocity((dx / dt) * 16);
      }
      setRotation((prev) => prev + dx * 0.3);
      lastX.current = e.clientX;
      lastTime.current = now;
    },
    [isDragging]
  );

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return { rotation, isDragging, onMouseDown, onMouseMove, onMouseUp };
}
