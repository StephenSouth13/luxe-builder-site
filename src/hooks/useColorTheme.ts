import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ColorTheme = 
  | "gold-black" 
  | "green-white" 
  | "blue-white" 
  | "purple-white"
  | "red-white"
  // Seasons
  | "spring"
  | "summer"
  | "autumn"
  | "winter"
  // Festivals
  | "tet" 
  | "christmas" 
  | "halloween"
  | "valentine"
  | "vietnam-national"
  | "new-year";

export type ThemeCategory = "standard" | "season" | "festival";

export interface ThemeConfig {
  id: ColorTheme;
  name: string;
  nameVi: string;
  preview: {
    primary: string;
    background: string;
    accent?: string;
  };
  category: ThemeCategory;
  icon?: string;
  description?: string;
}

export const themeConfigs: ThemeConfig[] = [
  // Standard themes
  {
    id: "gold-black",
    name: "Gold & Black",
    nameVi: "Vàng & Đen",
    preview: { primary: "#B8956C", background: "#0F0F0F" },
    category: "standard"
  },
  {
    id: "green-white",
    name: "Green & White",
    nameVi: "Xanh lá & Trắng",
    preview: { primary: "#22C55E", background: "#FAFAFA" },
    category: "standard"
  },
  {
    id: "blue-white",
    name: "Blue & White",
    nameVi: "Xanh dương & Trắng",
    preview: { primary: "#3B82F6", background: "#FAFAFA" },
    category: "standard"
  },
  {
    id: "purple-white",
    name: "Purple & White",
    nameVi: "Tím & Trắng",
    preview: { primary: "#8B5CF6", background: "#FAFAFA" },
    category: "standard"
  },
  {
    id: "red-white",
    name: "Red & White",
    nameVi: "Đỏ & Trắng",
    preview: { primary: "#EF4444", background: "#FAFAFA" },
    category: "standard"
  },
  // Seasonal themes
  {
    id: "spring",
    name: "Spring",
    nameVi: "Mùa Xuân",
    preview: { primary: "#F472B6", background: "#FDF2F8", accent: "#84CC16" },
    category: "season",
    icon: "🌸",
    description: "Tươi mới, nhẹ nhàng, hy vọng"
  },
  {
    id: "summer",
    name: "Summer",
    nameVi: "Mùa Hạ",
    preview: { primary: "#0EA5E9", background: "#F0F9FF", accent: "#FBBF24" },
    category: "season",
    icon: "☀️",
    description: "Năng động, rực rỡ, tươi sáng"
  },
  {
    id: "autumn",
    name: "Autumn",
    nameVi: "Mùa Thu",
    preview: { primary: "#EA580C", background: "#1C1917", accent: "#92400E" },
    category: "season",
    icon: "🍂",
    description: "Trầm ấm, sâu lắng, cảm xúc"
  },
  {
    id: "winter",
    name: "Winter",
    nameVi: "Mùa Đông",
    preview: { primary: "#64748B", background: "#F8FAFC", accent: "#CBD5E1" },
    category: "season",
    icon: "❄️",
    description: "Lạnh, tinh tế, thanh lịch"
  },
  // Festival themes
  {
    id: "tet",
    name: "Lunar New Year",
    nameVi: "Tết Nguyên Đán",
    preview: { primary: "#DC2626", background: "#FEF2F2", accent: "#FBBF24" },
    category: "festival",
    icon: "🧧",
    description: "Lì xì, hoa mai, câu chúc"
  },
  {
    id: "christmas",
    name: "Christmas",
    nameVi: "Giáng sinh",
    preview: { primary: "#16A34A", background: "#FEF2F2", accent: "#DC2626" },
    category: "festival",
    icon: "🎄",
    description: "Tuyết rơi, đèn nhấp nháy"
  },
  {
    id: "halloween",
    name: "Halloween",
    nameVi: "Halloween",
    preview: { primary: "#F97316", background: "#1C1917", accent: "#7C3AED" },
    category: "festival",
    icon: "🎃",
    description: "Ma quái, bí ngô, sương mù"
  },
  {
    id: "valentine",
    name: "Valentine",
    nameVi: "Valentine",
    preview: { primary: "#EC4899", background: "#FDF2F8", accent: "#BE185D" },
    category: "festival",
    icon: "💘",
    description: "Tim bay, hoa hồng, lãng mạn"
  },
  {
    id: "vietnam-national",
    name: "Vietnam National Day",
    nameVi: "Quốc Khánh 2/9",
    preview: { primary: "#DC2626", background: "#FEF2F2", accent: "#FBBF24" },
    category: "festival",
    icon: "🇻🇳",
    description: "Cờ bay, sao vàng, pháo hoa"
  },
  {
    id: "new-year",
    name: "New Year",
    nameVi: "Năm Mới",
    preview: { primary: "#8B5CF6", background: "#0F0F0F", accent: "#FBBF24" },
    category: "festival",
    icon: "🎉",
    description: "Countdown, confetti, neon"
  }
];

export const useColorTheme = () => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>("gold-black");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const { data } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "color_theme")
          .single();
        
        if (data?.value) {
          setColorTheme(data.value as ColorTheme);
        }
      } catch (error) {
        // Use default theme if not found
      } finally {
        setIsLoading(false);
      }
    };

    fetchTheme();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      applyTheme(colorTheme);
    }
  }, [colorTheme, isLoading]);

  const applyTheme = (theme: ColorTheme) => {
    const root = document.documentElement;
    
    // Remove all theme classes first
    const allThemes = themeConfigs.map(t => `theme-${t.id}`);
    root.classList.remove(...allThemes);
    
    // Add the new theme class
    root.classList.add(`theme-${theme}`);
  };

  const updateColorTheme = async (newTheme: ColorTheme) => {
    setColorTheme(newTheme);
    
    // Save to database
    const { data: existing } = await supabase
      .from("settings")
      .select("id")
      .eq("key", "color_theme")
      .single();

    if (existing) {
      await supabase
        .from("settings")
        .update({ value: newTheme })
        .eq("key", "color_theme");
    } else {
      await supabase
        .from("settings")
        .insert({ key: "color_theme", value: newTheme });
    }
  };

  return { colorTheme, updateColorTheme, isLoading, themeConfigs };
};
