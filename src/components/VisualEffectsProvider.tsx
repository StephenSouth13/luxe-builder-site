import { useEffect } from "react";
import { useVisualEffects } from "@/hooks/useVisualEffects";

/**
 * Applies data-* attributes to <html> based on visual effects config.
 * CSS in index.css uses these to conditionally disable effects.
 */
const VisualEffectsProvider = () => {
  const { config, isLoading } = useVisualEffects();

  useEffect(() => {
    if (isLoading) return;
    const root = document.documentElement;
    root.setAttribute("data-parallax", config.parallax ? "on" : "off");
    root.setAttribute("data-glass", config.glassmorphism ? "on" : "off");
    root.setAttribute("data-orbs", config.decorativeOrbs ? "on" : "off");
    root.setAttribute("data-noise", config.noiseOverlay ? "on" : "off");
    root.setAttribute("data-mesh", config.meshGradient ? "on" : "off");
    root.setAttribute("data-glow", config.glowCards ? "on" : "off");
  }, [config, isLoading]);

  return null;
};

export default VisualEffectsProvider;
