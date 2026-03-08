import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, useMotionValue } from "framer-motion";
import { useVisualEffects } from "@/hooks/useVisualEffects";

export const useParallax = (speed: number = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isAttached, setIsAttached] = useState(false);
  const { showParallax, showOrbs, getGlassClass, getGlowClass, getNoiseClass, getMeshClass, config } = useVisualEffects();

  useEffect(() => {
    if (ref.current) setIsAttached(true);
  }, []);

  const fallback = useMotionValue(0);

  const { scrollYProgress } = useScroll(
    isAttached && ref.current
      ? { target: ref, offset: ["start end", "end start"] }
      : undefined
  );

  const progress = isAttached ? scrollYProgress : fallback;
  const y = useTransform(progress, [0, 1], [-50 * speed, 50 * speed]);

  // If parallax is disabled, return zero motion
  const zeroY = useMotionValue(0);

  return {
    ref,
    y: showParallax() ? y : zeroY,
    scrollYProgress: progress,
    // Convenience helpers for components
    showOrbs: showOrbs(),
    sectionClasses: `${getNoiseClass()} ${getMeshClass()}`.trim(),
    getGlassClass,
    getGlowClass,
    config,
  };
};
