import { useState, useCallback, useRef, useEffect } from 'react';

export function useStarMapDrag() {
  const [rotX, setRotX] = useState(25);
  const [rotY, setRotY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [velocityX, setVelocityX] = useState(0);
  const [velocityY, setVelocityY] = useState(0);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (!isDragging) {
        setRotY((prev) => {
          const next = prev + velocityY;
          setVelocityY((v) => { if (Math.abs(v) < 0.01) return 0; return v * 0.96; });
          if (Math.abs(velocityX) < 0.05 && Math.abs(velocityY) < 0.05) return prev + 0.05 * (dt / 16);
          return next;
        });
        setRotX((prev) => {
          const next = prev + velocityX;
          setVelocityX((v) => { if (Math.abs(v) < 0.01) return 0; return v * 0.96; });
          return next;
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isDragging, velocityX, velocityY]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    lastX.current = e.clientX; lastY.current = e.clientY; lastTime.current = performance.now();
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastX.current, dy = e.clientY - lastY.current;
    const now = performance.now(), dt = now - lastTime.current;
    if (dt > 0) { setVelocityX((dy / dt) * 16); setVelocityY((dx / dt) * 16); }
    setRotY((p) => p + dx * 0.2); setRotX((p) => p + dy * 0.2);
    lastX.current = e.clientX; lastY.current = e.clientY; lastTime.current = now;
  }, [isDragging]);

  const onMouseUp = useCallback(() => setIsDragging(false), []);

  return { rotX, rotY, onMouseDown, onMouseMove, onMouseUp };
}
