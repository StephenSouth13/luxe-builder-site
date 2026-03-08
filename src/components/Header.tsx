import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X, Globe, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "./ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const { data: cartCount = 0 } = useQuery({
    queryKey: ['cart-count'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;
      const { count } = await supabase.from('cart_items').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      return count || 0;
    }
  });

  const { data: navVisibility } = useQuery({
    queryKey: ['navigation-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('settings').select('value').eq('key', 'navigation_visibility').single();
      if (error && error.code !== 'PGRST116') return null;
      return data?.value ? JSON.parse(data.value) : null;
    }
  });

  const { data: navLabels } = useQuery({
    queryKey: ['navigation-labels'],
    queryFn: async () => {
      const { data, error } = await supabase.from('settings').select('value').eq('key', 'navigation_labels').maybeSingle();
      if (error && error.code !== 'PGRST116') return null;
      return data?.value ? JSON.parse(data.value) : null;
    }
  });

  const { data: storeName = "Cửa hàng" } = useQuery({
    queryKey: ['store-name'],
    queryFn: async () => {
      const { data, error } = await supabase.from('settings').select('value').eq('key', 'store_name').single();
      if (error && error.code !== 'PGRST116') return "Cửa hàng";
      return data?.value || "Cửa hàng";
    }
  });

  const { data: logoSettings } = useQuery({
    queryKey: ['site-logo-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('settings').select('key, value').in('key', ['site_logo', 'site_logo_text']);
      if (error) return { logo: '', text: 'TBL' };
      const logoData = data?.find(d => d.key === 'site_logo');
      const textData = data?.find(d => d.key === 'site_logo_text');
      return { logo: logoData?.value || '', text: textData?.value || 'TBL' };
    }
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const defaultLabels: Record<string, string> = {
    home: t("home"), about: t("about"), projects: t("projects"),
    blog: "Blog", store: storeName, contact: t("contact"),
  };

  const allNavItems = [
    { key: "home", label: navLabels?.home || defaultLabels.home, path: "/" },
    { key: "about", label: navLabels?.about || defaultLabels.about, path: "/about" },
    { key: "projects", label: navLabels?.projects || defaultLabels.projects, path: "/projects" },
    { key: "blog", label: navLabels?.blog || defaultLabels.blog, path: "/blog" },
    { key: "store", label: navLabels?.store || defaultLabels.store, path: "/store" },
    { key: "contact", label: navLabels?.contact || defaultLabels.contact, path: "/contact" },
  ];

  const navItems = allNavItems.filter(item => !navVisibility || navVisibility[item.key] !== false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-xl shadow-[0_1px_0_0_hsl(var(--border)/0.5)]" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo */}
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              {logoSettings?.logo ? (
                <img src={logoSettings.logo} alt="Logo" className="h-8 lg:h-9 w-auto object-contain" />
              ) : (
                <span className="text-lg lg:text-xl font-semibold tracking-tight text-gradient">
                  {logoSettings?.text || 'TBL'}
                </span>
              )}
            </motion.div>
          </Link>

          {/* Desktop Navigation - Minimalist */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center bg-muted/30 backdrop-blur-sm rounded-full px-1 py-0.5 border border-border/30">
              {navItems.map((item, index) => (
                <Link key={item.path} to={item.path}>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`relative px-3 lg:px-4 py-1.5 text-[13px] font-medium rounded-full transition-all duration-300 inline-block ${
                      location.pathname === item.path
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:inline-flex h-8 w-8 hover:bg-muted/50">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[120px]">
                <DropdownMenuItem onClick={() => setLanguage("vi")} className="text-xs">🇻🇳 Tiếng Việt</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("en")} className="text-xs">🇬🇧 English</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative h-8 w-8 hover:bg-muted/50">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8 hover:bg-muted/50">
              {theme === "dark" ? <Sun className="h-4 w-4 text-muted-foreground" /> : <Moon className="h-4 w-4 text-muted-foreground" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 hover:bg-muted/50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Minimalist */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/30"
          >
            <nav className="container mx-auto px-4 py-3 flex flex-col gap-0.5">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={closeMobileMenu}>
                  <span
                    className={`block px-3 py-2.5 text-sm rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? "text-primary bg-primary/8 font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
              <div className="flex gap-2 pt-2 px-3">
                <Button variant={language === "vi" ? "default" : "outline"} size="sm" onClick={() => setLanguage("vi")} className="flex-1 h-8 text-xs">🇻🇳 VN</Button>
                <Button variant={language === "en" ? "default" : "outline"} size="sm" onClick={() => setLanguage("en")} className="flex-1 h-8 text-xs">🇬🇧 EN</Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
