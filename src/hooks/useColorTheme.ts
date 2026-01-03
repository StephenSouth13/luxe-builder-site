import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ColorTheme = 
  | "gold-black" 
  | "green-white" 
  | "blue-white" 
  | "purple-white"
  | "red-white"
  | "tet" 
  | "christmas" 
  | "halloween";

export interface ThemeConfig {
  id: ColorTheme;
  name: string;
  nameVi: string;
  preview: {
    primary: string;
    background: string;
  };
  isEvent?: boolean;
}

export const themeConfigs: ThemeConfig[] = [
  {
    id: "gold-black",
    name: "Gold & Black",
    nameVi: "Vàng & Đen",
    preview: { primary: "#B8956C", background: "#0F0F0F" }
  },
  {
    id: "green-white",
    name: "Green & White",
    nameVi: "Xanh lá & Trắng",
    preview: { primary: "#22C55E", background: "#FAFAFA" }
  },
  {
    id: "blue-white",
    name: "Blue & White",
    nameVi: "Xanh dương & Trắng",
    preview: { primary: "#3B82F6", background: "#FAFAFA" }
  },
  {
    id: "purple-white",
    name: "Purple & White",
    nameVi: "Tím & Trắng",
    preview: { primary: "#8B5CF6", background: "#FAFAFA" }
  },
  {
    id: "red-white",
    name: "Red & White",
    nameVi: "Đỏ & Trắng",
    preview: { primary: "#EF4444", background: "#FAFAFA" }
  },
  {
    id: "tet",
    name: "Lunar New Year",
    nameVi: "Tết Nguyên Đán",
    preview: { primary: "#DC2626", background: "#FEF2F2" },
    isEvent: true
  },
  {
    id: "christmas",
    name: "Christmas",
    nameVi: "Giáng sinh",
    preview: { primary: "#16A34A", background: "#FEF2F2" },
    isEvent: true
  },
  {
    id: "halloween",
    name: "Halloween",
    nameVi: "Halloween",
    preview: { primary: "#F97316", background: "#1C1917" },
    isEvent: true
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
    root.classList.remove(
      "theme-gold-black",
      "theme-green-white",
      "theme-blue-white",
      "theme-purple-white",
      "theme-red-white",
      "theme-tet",
      "theme-christmas",
      "theme-halloween"
    );
    
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
