import { motion } from "framer-motion";
import { Linkedin, Facebook, MessageCircle, Twitter, Github, Instagram, Youtube, ArrowUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useElementVisibility } from "@/hooks/useElementVisibility";

interface FooterLink { id: string; section: string; label: string; url: string; sort_order: number; }
interface SocialRow { id: string; provider: string; url: string; sort_order: number }

const Footer = () => {
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [socials, setSocials] = useState<SocialRow[]>([]);
  const { isElementVisible } = useElementVisibility();

  useEffect(() => {
    const load = async () => {
      try { const { data } = await supabase.from("footer_links").select("*").order("section").order("sort_order"); setLinks(data || []); } catch { setLinks([]); }
      try { const { data } = await supabase.from("social_links").select("*").order("sort_order"); setSocials(data || []); } catch { setSocials([]); }
    };
    load();
  }, []);

  const sections = useMemo(() => {
    const map = new Map<string, FooterLink[]>();
    for (const l of links) { const arr = map.get(l.section) || []; arr.push(l); map.set(l.section, arr); }
    return Array.from(map.entries());
  }, [links]);

  const year = new Date().getFullYear();

  const getIcon = (provider: string) => {
    const p = provider.toLowerCase();
    if (p.includes("linkedin")) return Linkedin;
    if (p.includes("facebook")) return Facebook;
    if (p.includes("twitter")) return Twitter;
    if (p.includes("github") || p.includes("git")) return Github;
    if (p.includes("instagram")) return Instagram;
    if (p.includes("youtube")) return Youtube;
    return MessageCircle;
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-background border-t border-border/30">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
          {isElementVisible("footer_logo") && (
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-lg font-semibold tracking-tight text-gradient">
              Portfolio
            </motion.div>
          )}

          {isElementVisible("footer_social_links") && (
            <div className="flex items-center gap-2">
              {(socials.length > 0 ? socials : [
                { id: "f-li", provider: "linkedin", url: "https://linkedin.com", sort_order: 0 },
                { id: "f-fb", provider: "facebook", url: "https://facebook.com", sort_order: 1 },
              ]).map((s, i) => {
                const Icon = getIcon(s.provider);
                return (
                  <motion.a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }} whileHover={{ scale: 1.1 }}
                    className="w-9 h-9 rounded-full flex items-center justify-center border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-300"
                    aria-label={s.provider}>
                    <Icon className="h-4 w-4" />
                  </motion.a>
                );
              })}
            </div>
          )}

          {isElementVisible("footer_back_to_top") && (
            <motion.button onClick={scrollToTop} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
              className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all">
              <ArrowUp className="h-4 w-4" />
            </motion.button>
          )}
        </div>

        {isElementVisible("footer_links_grid") && sections.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
            {sections.map(([title, items], idx) => (
              <motion.div key={title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: idx * 0.05 }}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">{title}</h4>
                <ul className="space-y-2">
                  {items.map((l) => (
                    <li key={l.id}><a href={l.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">{l.label}</a></li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        )}

        {isElementVisible("footer_copyright") && (
          <>
            <div className="h-px bg-border/30 mb-6" />
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-xs text-muted-foreground/50">
              © {year} Portfolio CMS. All rights reserved.
            </motion.div>
          </>
        )}
      </div>
    </footer>
  );
};

export default Footer;
