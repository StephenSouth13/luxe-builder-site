import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BadgeInfo, Sparkles } from "lucide-react";
import { AboutSkeleton } from "@/components/skeletons/SectionSkeletons";
import { supabase } from "@/integrations/supabase/client";
import { useSectionLabels } from "@/hooks/useSectionLabels";
import { useLayoutTemplate, AboutLayout } from "@/hooks/useLayoutTemplate";
import { useParallax } from "@/hooks/useParallax";

interface AboutRecord { id: string; headline: string; description: string; image_url: string | null; }
interface Skill { id: string; name: string; sort_order: number | null; }

const About = () => {
  const [about, setAbout] = useState<AboutRecord | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getLabel } = useSectionLabels();
  const { layouts } = useLayoutTemplate();
  const { ref: parallaxRef, y: parallaxY } = useParallax(0.12);

  useEffect(() => {
    const load = async () => {
      try {
        const [aboutRes, skillsRes] = await Promise.all([
          supabase.from("about_section").select("*").limit(1).maybeSingle(),
          supabase.from("skills").select("*").order("sort_order", { ascending: true }),
        ]);
        if (aboutRes.data) setAbout(aboutRes.data as AboutRecord);
        if (skillsRes.data) setSkills(skillsRes.data as Skill[]);
      } catch (e) { console.error("Failed to load about/skills", e); } finally { setIsLoading(false); }
    };
    load();
  }, []);

  if (isLoading) return <AboutSkeleton />;
  if (!about) return null;

  const displayImage = about.image_url;
  const layout: AboutLayout = layouts.about;

  const SkillsGrid = () => skills.length > 0 ? (
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-6">
      {skills.map((skill, index) => (
        <motion.div key={skill.id} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
          className="group relative p-4 sm:p-6 rounded-xl glass-strong hover:border-primary/50 transition-all duration-300 glow-card">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-gold-light opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300" />
          <BadgeInfo className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-2 sm:mb-3" />
          <h3 className="font-semibold text-xs sm:text-sm md:text-base text-foreground">{skill.name}</h3>
        </motion.div>
      ))}
    </div>
  ) : null;

  const SectionTitle = () => (
    <>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
        {about.headline || getLabel("about")}
      </h2>
      <p className="text-center text-muted-foreground text-lg mb-12 lg:mb-16 max-w-2xl mx-auto">
        Tìm hiểu thêm về hành trình và đam mê của tôi
      </p>
    </>
  );

  // Side-by-side (default)
  if (layout === "side-by-side") return (
    <section id="about" ref={parallaxRef} className="py-20 lg:py-32 parallax-section noise-overlay mesh-gradient">
      <motion.div style={{ y: parallaxY }} className="parallax-bg">
        <div className="absolute top-10 -right-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 -left-10 w-64 h-64 rounded-full bg-accent/4 blur-3xl" />
      </motion.div>
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }}>
          <SectionTitle />
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {displayImage && (
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary to-gold-light rounded-2xl blur-xl opacity-30" />
                  <img src={displayImage} alt="Ảnh hồ sơ" loading="lazy" decoding="async" className="relative w-full max-w-md rounded-2xl shadow-2xl border-2 border-primary/20" />
                </div>
              </motion.div>
            )}
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }}
              className={`space-y-6 ${!displayImage ? 'md:col-span-2 max-w-3xl mx-auto' : ''}`}>
              {about.headline && <div className="flex items-center gap-2 text-primary"><Sparkles className="h-5 w-5" /><h3 className="text-xl font-semibold">{about.headline}</h3></div>}
              <p className="text-base sm:text-lg text-foreground/90 leading-relaxed">{about.description}</p>
              <SkillsGrid />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );

  // Full-width
  if (layout === "full-width") return (
    <section id="about" ref={parallaxRef} className="py-20 lg:py-32 parallax-section noise-overlay mesh-gradient">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <SectionTitle />
          {displayImage && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="mb-12">
              <div className="relative rounded-2xl overflow-hidden aspect-[21/9]">
                <img src={displayImage} alt="Ảnh hồ sơ" loading="lazy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
            </motion.div>
          )}
          <div className="space-y-6 text-center max-w-3xl mx-auto">
            <p className="text-lg text-foreground/90 leading-relaxed">{about.description}</p>
          </div>
          <div className="mt-10"><SkillsGrid /></div>
        </motion.div>
      </div>
    </section>
  );

  // Card-based
  if (layout === "card-based") return (
    <section id="about" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <SectionTitle />
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-border/50 bg-card shadow-xl overflow-hidden">
              {displayImage && (
                <div className="h-64 overflow-hidden">
                  <img src={displayImage} alt="Ảnh hồ sơ" loading="lazy" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-8 space-y-6">
                {about.headline && <div className="flex items-center gap-2 text-primary"><Sparkles className="h-5 w-5" /><h3 className="text-2xl font-semibold">{about.headline}</h3></div>}
                <p className="text-base sm:text-lg text-foreground/90 leading-relaxed">{about.description}</p>
                <SkillsGrid />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );

  // Magazine
  return (
    <section id="about" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <SectionTitle />
          <div className="grid lg:grid-cols-5 gap-10 items-start">
            {displayImage && (
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-2 lg:sticky lg:top-24">
                <img src={displayImage} alt="Ảnh hồ sơ" loading="lazy" className="w-full rounded-2xl shadow-lg border border-border/30" />
              </motion.div>
            )}
            <div className={`space-y-8 ${displayImage ? 'lg:col-span-3' : 'lg:col-span-5 max-w-3xl mx-auto'}`}>
              {about.headline && (
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                  <span className="text-xs uppercase tracking-widest text-primary font-medium">Về tôi</span>
                  <h3 className="text-3xl font-bold mt-2">{about.headline}</h3>
                </motion.div>
              )}
              <p className="text-lg text-foreground/80 leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-2 first-letter:float-left">
                {about.description}
              </p>
              <SkillsGrid />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
