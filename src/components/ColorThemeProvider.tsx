import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type ColorTheme = 
  | "gold-black" 
  | "green-white" 
  | "blue-white" 
  | "purple-white"
  | "red-white"
  | "tet" 
  | "christmas" 
  | "halloween";

interface ColorThemeContextType {
  colorTheme: ColorTheme;
  isLoading: boolean;
}

const ColorThemeContext = createContext<ColorThemeContextType>({
  colorTheme: "gold-black",
  isLoading: true,
});

export const useColorThemeContext = () => useContext(ColorThemeContext);

export const ColorThemeProvider = ({ children }: { children: ReactNode }) => {
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

    // Subscribe to realtime changes
    const channel = supabase
      .channel("color-theme-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "settings",
          filter: "key=eq.color_theme",
        },
        (payload) => {
          if (payload.new && "value" in payload.new) {
            setColorTheme(payload.new.value as ColorTheme);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
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
      root.classList.add(`theme-${colorTheme}`);
    }
  }, [colorTheme, isLoading]);

  return (
    <ColorThemeContext.Provider value={{ colorTheme, isLoading }}>
      {children}
    </ColorThemeContext.Provider>
  );
};
