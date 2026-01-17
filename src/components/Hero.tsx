import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Download, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const { data } = await supabase
        .from("hero_section")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (data) {
        setHeroData({
          name: data.name,
          title: data.title,
          quote: data.quote,
          profile_image_url: data.profile_image_url,
          background_image_url: data.background_image_url,
          show_contact_button: data.show_contact_button !== false,
          show_cv_button: data.show_cv_button !== false,
          cv_file_url: data.cv_file_url,
        });
      }
    } catch (error) {
      console.error("Error fetching hero data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </section>
    );
  }

  // If no data from CMS, show placeholder message
  if (!heroData) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          <p>Chưa có dữ liệu Hero. Vui lòng cập nhật trong Admin.</p>
        </div>
      </section>
    );
  }

  const displayProfileImage = heroData.profile_image_url;
  const displayBackgroundImage = heroData.background_image_url;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: displayBackgroundImage 
          ? `linear-gradient(rgba(15, 15, 15, 0.85), rgba(15, 15, 15, 0.85)), url(${displayBackgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: !displayBackgroundImage ? "hsl(var(--background))" : undefined,
      }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Profile Image */}
          {displayProfileImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-gold-light rounded-full blur-lg opacity-75 animate-float" />
              <img
                src={displayProfileImage}
                alt={heroData.name}
                className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full object-cover border-4 border-primary glow-gold"
              />
            </motion.div>
          )}

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gradient"
          >
            {heroData.name}
          </motion.h1>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground/90"
          >
            {heroData.title}
          </motion.h2>

          {/* Quote */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl italic border-l-4 border-primary pl-4 sm:pl-6"
          >
            "{heroData.quote}"
          </motion.p>

          {/* CTA Buttons */}
          {(heroData.show_contact_button || heroData.show_cv_button) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              {heroData.show_contact_button && (
                <Button
                  size="lg"
                  onClick={scrollToContact}
                  className="gold-gradient hover:opacity-90 transition-opacity text-background font-semibold px-8"
                >
                  Liên hệ ngay
                </Button>
              )}
              {heroData.show_cv_button && heroData.cv_file_url && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 px-8"
                  onClick={() => window.open(heroData.cv_file_url!, "_blank")}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Tải CV
                </Button>
              )}
            </motion.div>
          )}

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <ArrowDown className="h-6 w-6 text-primary animate-bounce" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
