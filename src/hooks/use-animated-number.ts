import { useState, useEffect, useRef } from "react";

export function useAnimatedNumber(target: number, duration = 1200, enabled = true) {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number>();

  useEffect(() => {
    if (!enabled) { setValue(target); return; }
    startTime.current = null;
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(eased * target));
      if (progress < 1) rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, [target, duration, enabled]);

  return value;
}

export function useLiveData<T>(initialData: T, updateFn: (prev: T) => T, interval = 5000) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const id = setInterval(() => setData(prev => updateFn(prev)), interval);
    return () => clearInterval(id);
  }, [interval]);

  return data;
}
