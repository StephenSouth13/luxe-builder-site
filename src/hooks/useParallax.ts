import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, useMotionValue } from "framer-motion";

export const useParallax = (speed: number = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isAttached, setIsAttached] = useState(false);

  useEffect(() => {
    if (ref.current) setIsAttached(true);
  }, []);

  const fallback = useMotionValue(0);

  const scroll = useScroll(
    isAttached && ref.current
      ? { target: ref, offset: ["start end", "end start"] }
      : { target: ref, offset: ["start end", "end start"] }
  );

  const progress = isAttached ? (scroll?.scrollYProgress ?? fallback) : fallback;
  const y = useTransform(progress, [0, 1], [-50 * speed, 50 * speed]);

  return { ref, y, scrollYProgress: progress };
};
