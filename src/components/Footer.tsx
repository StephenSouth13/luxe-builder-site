import { motion } from "framer-motion";
import { Linkedin, Facebook, MessageCircle } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: MessageCircle, href: "https://zalo.me", label: "Zalo" }
  ];

  return (
    <footer className="relative bg-background border-t border-primary/20">
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-1 gold-gradient" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center space-y-6"
        >
          {/* Logo/Name */}
          <div className="text-2xl font-bold text-gradient">
            Trịnh Bá Lâm
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="p-3 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/10 transition-all duration-300 glow-gold"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5 text-primary" />
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Trịnh Bá Lâm. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
