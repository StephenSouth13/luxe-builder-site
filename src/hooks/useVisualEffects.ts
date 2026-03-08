import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface VisualEffectsConfig {
  parallax: boolean;
  glassmorphism: boolean;
  decorativeOrbs: boolean;
  noiseOverlay: boolean;
  meshGradient: boolean;
  glowCards: boolean;
}

const defaultConfig: VisualEffectsConfig = {
  parallax: true,
  glassmorphism: true,
  decorativeOrbs: true,
  noiseOverlay: true,
  meshGradient: true,
  glowCards: true,
};

const SETTINGS_KEY = "visual_effects";

export const useVisualEffects = () => {
  const [config, setConfig] = useState<VisualEffectsConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase
          .from("settings")
          .select("value")
          .eq("key", SETTINGS_KEY)
          .single();
        if (data?.value) {
          setConfig({ ...defaultConfig, ...JSON.parse(data.value) });
        }
      } catch { /* defaults */ } finally { setIsLoading(false); }
    };
    fetch();
  }, []);

  const updateConfig = async (newConfig: VisualEffectsConfig) => {
    setConfig(newConfig);
    const value = JSON.stringify(newConfig);
    const { data: existing } = await supabase
      .from("settings")
      .select("id")
      .eq("key", SETTINGS_KEY)
      .single();

    if (existing) {
      await supabase.from("settings").update({ value }).eq("key", SETTINGS_KEY);
    } else {
      await supabase.from("settings").insert({ key: SETTINGS_KEY, value });
    }
  };

  // Helper: get CSS classes conditionally
  const getGlassClass = (variant: "glass" | "glass-strong" | "glass-subtle" | "glass-primary" = "glass") => {
    return config.glassmorphism ? variant : "bg-card border border-border";
  };

  const getGlowClass = () => config.glowCards ? "glow-card" : "";
  const getNoiseClass = () => config.noiseOverlay ? "noise-overlay" : "";
  const getMeshClass = () => config.meshGradient ? "mesh-gradient" : "";
  const showParallax = () => config.parallax;
  const showOrbs = () => config.decorativeOrbs;

  return {
    config, updateConfig, isLoading,
    getGlassClass, getGlowClass, getNoiseClass, getMeshClass,
    showParallax, showOrbs,
  };
};
