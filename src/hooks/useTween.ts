import { useEffect, useRef, useState } from "react";

// Smoothly counts toward `target`; snaps instantly under reduced motion.
export function useTween(target: number, duration = 380): number {
  const [value, setValue] = useState(target);
  const from = useRef(target);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = target;
      const id = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(id);
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      const v = a + (target - a) * eased;
      from.current = v;
      setValue(v);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return Math.round(value);
}
