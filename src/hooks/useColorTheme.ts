import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ColorTheme = 
  | "gold-black" 
  | "green-white" 
  | "blue-white" 
  | "purple-white"
  | "red-white"
  | "spring"
  | "summer"
  | "autumn"
  | "winter"
  | "tet" 
  | "christmas" 
  | "halloween"
  | "valentine"
  | "vietnam-national"
  | "new-year"
  | "ocean-dark"
  | "rose-gold"
  | "cyber-neon"
  | "forest-dark"
  | "sunset-warm"
  | "midnight-blue";

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
  {
    id: "ocean-dark",
    name: "Ocean Dark",
    nameVi: "Đại dương tối",
    preview: { primary: "#2DD4BF", background: "#0A1628", accent: "#33B89C" },
    category: "standard",
    icon: "🌊",
    description: "Sâu thẳm, bí ẩn, thanh lịch"
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    nameVi: "Hồng vàng",
    preview: { primary: "#D4768C", background: "#F5EDED", accent: "#C8944A" },
    category: "standard",
    icon: "🌹",
    description: "Sang trọng, nữ tính, quý phái"
  },
  {
    id: "cyber-neon",
    name: "Cyber Neon",
    nameVi: "Neon công nghệ",
    preview: { primary: "#00FF00", background: "#0A0A14", accent: "#9933FF" },
    category: "standard",
    icon: "⚡",
    description: "Tương lai, mạnh mẽ, bắt mắt"
  },
  {
    id: "forest-dark",
    name: "Forest Dark",
    nameVi: "Rừng thẳm",
    preview: { primary: "#3DA36E", background: "#0D1A12", accent: "#7AAB40" },
    category: "standard",
    icon: "🌲",
    description: "Tự nhiên, bình yên, huyền bí"
  },
  {
    id: "sunset-warm",
    name: "Sunset Warm",
    nameVi: "Hoàng hôn",
    preview: { primary: "#E8652B", background: "#FAF5F0", accent: "#D44070" },
    category: "standard",
    icon: "🌅",
    description: "Ấm áp, rực rỡ, năng lượng"
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    nameVi: "Xanh đêm",
    preview: { primary: "#4A8FD9", background: "#0B1120", accent: "#33B5D9" },
    category: "standard",
    icon: "🌙",
    description: "Thanh lịch, chuyên nghiệp, sâu lắng"
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
    const allThemes = themeConfigs.map(t => `theme-${t.id}`);
    root.classList.remove(...allThemes);
    root.classList.add(`theme-${theme}`);
  };

  const updateColorTheme = async (newTheme: ColorTheme) => {
    setColorTheme(newTheme);
    
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
