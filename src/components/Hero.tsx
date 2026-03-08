import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Download } from "lucide-react";
import { HeroSkeleton } from "@/components/skeletons/SectionSkeletons";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useElementVisibility } from "@/hooks/useElementVisibility";
import { useLayoutTemplate, HeroLayout } from "@/hooks/useLayoutTemplate";

const Hero = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [heroData, setHeroData] = useState<{
    name: string;
    title: string;
    quote: string;
    profile_image_url: string | null;
    background_image_url: string | null;
    show_contact_button: boolean;
    show_cv_button: boolean;
    cv_file_url: string | null;
  } | null>(null);
  const { isElementVisible } = useElementVisibility();
  const { layouts } = useLayoutTemplate();

  useEffect(() => { fetchHeroData(); }, []);

  const fetchHeroData = async () => {
    try {
      const { data } = await supabase.from("hero_section").select("*").limit(1).maybeSingle();
      if (data) {
        setHeroData({
          name: data.name, title: data.title, quote: data.quote,
          profile_image_url: data.profile_image_url, background_image_url: data.background_image_url,
          show_contact_button: data.show_contact_button !== false, show_cv_button: data.show_cv_button !== false,
          cv_file_url: data.cv_file_url,
        });
      }
    } catch (error) { console.error("Error fetching hero data:", error); } finally { setIsLoading(false); }
  };

  const scrollToContact = () => { document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); };

  if (isLoading) return <HeroSkeleton />;
  if (!heroData) return (
    <section className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center text-muted-foreground"><p>Chưa có dữ liệu Hero. Vui lòng cập nhật trong Admin.</p></div>
    </section>
  );

  const displayProfileImage = heroData.profile_image_url;
  const displayBackgroundImage = heroData.background_image_url;
  const layout: HeroLayout = layouts.hero;
  const showProfile = isElementVisible("hero_profile_image") && displayProfileImage;
  const showContact = isElementVisible("hero_contact_button") && heroData.show_contact_button;
  const showCV = isElementVisible("hero_cv_button") && heroData.show_cv_button && heroData.cv_file_url;
  const showQuote = isElementVisible("hero_quote");
  const showScroll = isElementVisible("hero_scroll_indicator");

  const ProfileImage = () => showProfile ? (
    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-gold-light rounded-full blur-lg opacity-75 animate-float" />
      <img src={displayProfileImage!} alt={heroData.name} loading="eager" fetchPriority="high" decoding="async"
        className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full object-cover border-4 border-primary glow-gold" />
    </motion.div>
  ) : null;

  const TextContent = ({ align = "center" }: { align?: string }) => (
    <div className={`space-y-6 ${align === "center" ? "text-center items-center" : "text-left items-start"} flex flex-col`}>
      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
        className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gradient drop-shadow-lg">
        {heroData.name}
      </motion.h1>
      <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
        className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground">
        {heroData.title}
      </motion.h2>
      {showQuote && (
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
          className="text-base sm:text-lg lg:text-xl text-foreground/80 max-w-3xl italic border-l-4 border-primary pl-4 sm:pl-6">
          "{heroData.quote}"
        </motion.p>
      )}
      <CTAButtons />
    </div>
  );

  const CTAButtons = () => (showContact || showCV) ? (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }} className="flex flex-col sm:flex-row gap-4 pt-4">
      {showContact && <Button size="lg" onClick={scrollToContact} className="gold-gradient hover:opacity-90 transition-opacity text-background font-semibold px-8">Liên hệ ngay</Button>}
      {showCV && <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 px-8" onClick={() => window.open(heroData.cv_file_url!, "_blank")}><Download className="mr-2 h-5 w-5" />Tải CV</Button>}
    </motion.div>
  ) : null;

  const ScrollIndicator = () => showScroll ? (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.2 }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
      <ArrowDown className="h-6 w-6 text-primary animate-bounce" />
    </motion.div>
  ) : null;

  const bgStyle = {
    backgroundImage: displayBackgroundImage ? `linear-gradient(rgba(15, 15, 15, 0.85), rgba(15, 15, 15, 0.85)), url(${displayBackgroundImage})` : undefined,
    backgroundSize: "cover", backgroundPosition: "center",
    backgroundColor: !displayBackgroundImage ? "hsl(var(--background))" : undefined,
  };

  // Layout: Centered (default)
  if (layout === "centered") return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={bgStyle}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5" />
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <ProfileImage />
          <TextContent align="center" />
          <ScrollIndicator />
        </div>
      </div>
    </section>
  );

  // Layout: Split Left
  if (layout === "split-left") return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden" style={bgStyle}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5" />
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <ProfileImage />
          </div>
          <div className="order-1 lg:order-2">
            <TextContent align="left" />
          </div>
        </div>
      </div>
      <ScrollIndicator />
    </section>
  );

  // Layout: Split Right
  if (layout === "split-right") return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden" style={bgStyle}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5" />
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <TextContent align="left" />
          </div>
          <div className="flex justify-center lg:justify-end">
            <ProfileImage />
          </div>
        </div>
      </div>
      <ScrollIndicator />
    </section>
  );

  // Layout: Minimal
  if (layout === "minimal") return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-4xl">
        <div className="flex flex-col items-center text-center space-y-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} className="w-16 h-px bg-primary" />
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-light tracking-tight text-foreground">
            {heroData.name}
          </motion.h1>
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}
            className="text-lg sm:text-xl text-muted-foreground font-light tracking-widest uppercase">
            {heroData.title}
          </motion.h2>
          {showQuote && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}
              className="text-base text-foreground/60 max-w-2xl italic font-light">
              {heroData.quote}
            </motion.p>
          )}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }} className="w-16 h-px bg-primary" />
          <CTAButtons />
        </div>
      </div>
      <ScrollIndicator />
    </section>
  );

  // Layout: Parallax
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={bgStyle}>
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
      <motion.div className="absolute inset-0 z-0" style={{ backgroundImage: displayBackgroundImage ? `url(${displayBackgroundImage})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}
        initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 2 }} />
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <ProfileImage />
          <TextContent align="center" />
        </div>
      </div>
      <ScrollIndicator />
    </section>
  );
};

export default Hero;
