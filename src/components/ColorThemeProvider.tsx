import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, SparkleIcon } from "lucide-react";
import ThemeParticles from "./ThemeParticles";

type ColorTheme = 
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
  | "new-year";

interface ColorThemeContextType {
  colorTheme: ColorTheme;
  isLoading: boolean;
  particlesEnabled: boolean;
  toggleParticles: () => void;
}

const ColorThemeContext = createContext<ColorThemeContextType>({
  colorTheme: "gold-black",
  isLoading: true,
  particlesEnabled: true,
  toggleParticles: () => {},
});

export const useColorThemeContext = () => useContext(ColorThemeContext);

// Check if theme has particles
const themeHasParticles = (theme: ColorTheme): boolean => {
  return ['spring', 'summer', 'autumn', 'winter', 'christmas', 'tet', 'valentine', 'new-year'].includes(theme);
};

// Particle Toggle Button Component
const ParticleToggle = ({ enabled, onToggle, theme }: { enabled: boolean; onToggle: () => void; theme: ColorTheme }) => {
  if (!themeHasParticles(theme)) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onToggle}
      className="fixed bottom-4 left-4 z-50 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background transition-colors"
      title={enabled ? "Tắt hiệu ứng" : "Bật hiệu ứng"}
    >
      <AnimatePresence mode="wait">
        {enabled ? (
          <motion.div
            key="on"
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>
        ) : (
          <motion.div
            key="off"
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SparkleIcon className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export const ColorThemeProvider = ({ children }: { children: ReactNode }) => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>("gold-black");
  const [isLoading, setIsLoading] = useState(true);
  const [particlesEnabled, setParticlesEnabled] = useState(() => {
    const saved = localStorage.getItem('particles-enabled');
    return saved !== null ? saved === 'true' : true;
  });

  const toggleParticles = () => {
    setParticlesEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('particles-enabled', String(newValue));
      return newValue;
    });
  };

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
        "theme-spring",
        "theme-summer",
        "theme-autumn",
        "theme-winter",
        "theme-tet",
        "theme-christmas",
        "theme-halloween",
        "theme-valentine",
        "theme-vietnam-national",
        "theme-new-year"
      );
      
      // Add the new theme class
      root.classList.add(`theme-${colorTheme}`);
    }
  }, [colorTheme, isLoading]);

  return (
    <ColorThemeContext.Provider value={{ colorTheme, isLoading, particlesEnabled, toggleParticles }}>
      {particlesEnabled && <ThemeParticles theme={colorTheme} />}
      <ParticleToggle enabled={particlesEnabled} onToggle={toggleParticles} theme={colorTheme} />
      {children}
    </ColorThemeContext.Provider>
  );
};
