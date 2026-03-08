import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ScrollEffectType = "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in" | "zoom-out" | "flip-x" | "flip-y" | "rotate" | "slide-up" | "slide-down" | "none";

export interface SectionScrollEffect {
  effect: ScrollEffectType;
  duration: number; // seconds
  delay: number;    // seconds
  easing: string;
}

export type ScrollEffectsConfig = Record<string, SectionScrollEffect>;

const defaultEffect: SectionScrollEffect = {
  effect: "fade-up",
  duration: 0.6,
  delay: 0,
  easing: "easeOut",
};

const defaultConfig: ScrollEffectsConfig = {
  hero: { effect: "fade-up", duration: 0.8, delay: 0, easing: "easeOut" },
  about: { effect: "fade-up", duration: 0.6, delay: 0.1, easing: "easeOut" },
  skills: { effect: "fade-up", duration: 0.6, delay: 0.1, easing: "easeOut" },
  experience: { effect: "fade-left", duration: 0.6, delay: 0.1, easing: "easeOut" },
  education: { effect: "fade-right", duration: 0.6, delay: 0.1, easing: "easeOut" },
  projects: { effect: "zoom-in", duration: 0.5, delay: 0.1, easing: "easeOut" },
  certificates: { effect: "fade-up", duration: 0.6, delay: 0.1, easing: "easeOut" },
  blogs: { effect: "fade-up", duration: 0.6, delay: 0.1, easing: "easeOut" },
  contact: { effect: "fade-up", duration: 0.6, delay: 0, easing: "easeOut" },
};

// Convert effect type to framer-motion variants
export const getMotionVariants = (config: SectionScrollEffect) => {
  const { effect, duration, delay, easing } = config;
  
  const easingMap: Record<string, number[]> = {
    easeOut: [0, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    spring: [0.34, 1.56, 0.64, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
  };

  const initial: Record<string, number> = { opacity: 0 };
  const animate: Record<string, number> = { opacity: 1 };

  switch (effect) {
    case "fade-up":
      initial.y = 40; animate.y = 0; break;
    case "fade-down":
      initial.y = -40; animate.y = 0; break;
    case "fade-left":
      initial.x = -60; animate.x = 0; break;
    case "fade-right":
      initial.x = 60; animate.x = 0; break;
    case "zoom-in":
      initial.scale = 0.85; animate.scale = 1; break;
    case "zoom-out":
      initial.scale = 1.15; animate.scale = 1; break;
    case "flip-x":
      initial.rotateX = 90; animate.rotateX = 0; break;
    case "flip-y":
      initial.rotateY = 90; animate.rotateY = 0; break;
    case "rotate":
      initial.rotate = -10; initial.scale = 0.9; animate.rotate = 0; animate.scale = 1; break;
    case "slide-up":
      initial.y = 80; animate.y = 0; break;
    case "slide-down":
      initial.y = -80; animate.y = 0; break;
    case "none":
      return { initial: {}, animate: {}, transition: {} };
  }

  return {
    initial,
    animate,
    transition: {
      duration,
      delay,
      ease: easingMap[easing] || easingMap.easeOut,
    },
  };
};

export const scrollEffectOptions: { value: ScrollEffectType; label: string }[] = [
  { value: "none", label: "Không hiệu ứng" },
  { value: "fade-up", label: "Mờ lên ↑" },
  { value: "fade-down", label: "Mờ xuống ↓" },
  { value: "fade-left", label: "Mờ trái ←" },
  { value: "fade-right", label: "Mờ phải →" },
  { value: "zoom-in", label: "Phóng to" },
  { value: "zoom-out", label: "Thu nhỏ" },
  { value: "flip-x", label: "Lật ngang" },
  { value: "flip-y", label: "Lật dọc" },
  { value: "rotate", label: "Xoay" },
  { value: "slide-up", label: "Trượt lên" },
  { value: "slide-down", label: "Trượt xuống" },
];

export const easingOptions = [
  { value: "easeOut", label: "Mượt (easeOut)" },
  { value: "easeIn", label: "Tăng tốc (easeIn)" },
  { value: "easeInOut", label: "Mượt 2 chiều" },
  { value: "spring", label: "Nảy nhẹ (spring)" },
  { value: "bounce", label: "Nảy mạnh (bounce)" },
];

export const sectionNames: Record<string, string> = {
  hero: "Hero",
  about: "Về tôi",
  skills: "Kỹ năng",
  experience: "Kinh nghiệm",
  education: "Học vấn",
  projects: "Dự án",
  certificates: "Chứng chỉ",
  blogs: "Blog",
  contact: "Liên hệ",
};

export const useScrollEffects = () => {
  const [config, setConfig] = useState<ScrollEffectsConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "scroll_effects")
          .single();
        
        if (data?.value) {
          setConfig({ ...defaultConfig, ...JSON.parse(data.value) });
        }
      } catch { /* use defaults */ } finally { setIsLoading(false); }
    };
    fetchConfig();
  }, []);

  const getSectionEffect = (section: string): SectionScrollEffect => {
    return config[section] || defaultEffect;
  };

  const getSectionMotion = (section: string) => {
    return getMotionVariants(getSectionEffect(section));
  };

  const updateConfig = async (newConfig: ScrollEffectsConfig) => {
    setConfig(newConfig);
    
    const { data: existing } = await supabase
      .from("settings")
      .select("id")
      .eq("key", "scroll_effects")
      .single();

    const value = JSON.stringify(newConfig);
    if (existing) {
      await supabase.from("settings").update({ value }).eq("key", "scroll_effects");
    } else {
      await supabase.from("settings").insert({ key: "scroll_effects", value });
    }
  };

  return { config, getSectionEffect, getSectionMotion, updateConfig, isLoading };
};
