import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Linkedin, Mail, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface AuthorInfo {
  name: string;
  title: string;
  image_url: string | null;
  description: string;
}

interface SocialLink {
  provider: string;
  url: string;
}

const AuthorCard = () => {
  const [author, setAuthor] = useState<AuthorInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetchAuthorInfo();
  }, []);

  const fetchAuthorInfo = async () => {
    try {
      const [heroRes, aboutRes, socialRes] = await Promise.all([
        supabase.from("hero_section").select("name, title, profile_image_url").single(),
        supabase.from("about_section").select("description").single(),
        supabase.from("social_links").select("provider, url").limit(4),
      ]);

      if (heroRes.data) {
        setAuthor({
          name: heroRes.data.name,
          title: heroRes.data.title,
          image_url: heroRes.data.profile_image_url,
          description: aboutRes.data?.description || "",
        });
      }

      if (socialRes.data) {
        setSocialLinks(socialRes.data);
      }
    } catch (error) {
      console.error("Error fetching author info:", error);
    }
  };

  const getSocialIcon = (provider: string) => {
    const p = provider.toLowerCase();
    if (p.includes("linkedin")) return Linkedin;
    if (p.includes("email") || p.includes("mail")) return Mail;
    return Globe;
  };

  if (!author) return null;

  // Truncate description - strip HTML and limit
  const cleanDescription = author.description
    .replace(/<[^>]*>/g, "")
    .slice(0, 200);
  const shortDescription = cleanDescription.length >= 200 
    ? cleanDescription + "..." 
    : cleanDescription;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-border/50 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-4 ring-primary/20 ring-offset-2 ring-offset-background">
                <AvatarImage src={author.image_url || undefined} alt={author.name} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                  {author.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
                Tác giả
              </p>
              <h3 className="font-bold text-xl mb-1">{author.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{author.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {shortDescription}
              </p>
              
              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
                  {socialLinks.slice(0, 4).map((link) => {
                    const Icon = getSocialIcon(link.provider);
                    return (
                      <a
                        key={link.provider}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              )}

              <Link to="/about">
                <Button variant="outline" size="sm" className="gap-2 group">
                  Xem thêm về tác giả
                  <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AuthorCard;
