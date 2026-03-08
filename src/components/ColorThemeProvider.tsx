import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Sparkle } from "lucide-react";
import ThemeParticles from "./ThemeParticles";
import { ColorTheme } from "@/hooks/useColorTheme";

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

const themeHasParticles = (theme: ColorTheme): boolean => {
  return ['spring', 'summer', 'autumn', 'winter', 'christmas', 'tet', 'valentine', 'new-year'].includes(theme);
};

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
          <motion.div key="on" initial={{ rotate: -180, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 180, opacity: 0 }} transition={{ duration: 0.2 }}>
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>
        ) : (
          <motion.div key="off" initial={{ rotate: -180, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 180, opacity: 0 }} transition={{ duration: 0.2 }}>
            <Sparkle className="w-5 h-5 text-muted-foreground" />
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
        if (data?.value) setColorTheme(data.value as ColorTheme);
      } catch { /* default */ } finally { setIsLoading(false); }
    };
    fetchTheme();

    const channel = supabase
      .channel("color-theme-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "settings", filter: "key=eq.color_theme" },
        (payload) => { if (payload.new && "value" in payload.new) setColorTheme(payload.new.value as ColorTheme); }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const root = document.documentElement;
      // Remove all theme classes
      Array.from(root.classList).filter(c => c.startsWith('theme-')).forEach(c => root.classList.remove(c));
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
