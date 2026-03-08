import { useRef } from "react";
import { useScroll, useTransform, MotionValue } from "framer-motion";

export const useParallax = (speed: number = 0.2) => {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-50 * speed, 50 * speed]);

  return { ref, y, scrollYProgress };
};
