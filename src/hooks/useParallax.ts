import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, useMotionValue } from "framer-motion";

export const useParallax = (speed: number = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const fallback = useMotionValue(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsHydrated(Boolean(ref.current));
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const scroll = useScroll(
    isHydrated
      ? { target: ref, offset: ["start end", "end start"] }
      : { offset: ["start end", "end start"] }
  );

  const progress = isHydrated ? scroll.scrollYProgress : fallback;
  const y = useTransform(progress, [0, 1], [-50 * speed, 50 * speed]);

  return { ref, y, scrollYProgress: progress };
};
