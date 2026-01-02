import { useState, useEffect } from "react";
import { List, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

const TableOfContents = ({ content }: TableOfContentsProps) => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Parse headings from HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const elements = doc.querySelectorAll("h1, h2, h3");
    
    const items: TOCItem[] = [];
    elements.forEach((el, index) => {
      const id = `heading-${index}`;
      const text = el.textContent || "";
      const level = parseInt(el.tagName[1]);
      if (text.trim()) {
        items.push({ id, text: text.trim(), level });
      }
    });
    
    setHeadings(items);
  }, [content]);

  useEffect(() => {
    // Add IDs to actual headings in the DOM
    const articleContent = document.querySelector(".prose-content");
    if (articleContent) {
      const headingElements = articleContent.querySelectorAll("h1, h2, h3");
      headingElements.forEach((el, index) => {
        el.id = `heading-${index}`;
      });
    }

    const handleScroll = () => {
      // Calculate reading progress
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, scrollProgress)));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -60% 0%" }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  const activeIndex = headings.findIndex((h) => h.id === activeId);

  return (
    <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 overflow-hidden">
      {/* Progress Bar */}
      <div className="h-1 bg-muted rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-foreground">
        <List className="h-4 w-4 text-primary" />
        <span>Mục lục</span>
        <span className="text-xs text-muted-foreground ml-auto">
          {activeIndex + 1}/{headings.length}
        </span>
      </div>

      <nav className="space-y-0.5 relative">
        {/* Active indicator line */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border/50 rounded-full" />
        
        {headings.map((heading, index) => {
          const isActive = activeId === heading.id;
          const isPast = activeIndex > index;

          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={cn(
                "relative flex items-center text-sm py-1.5 transition-all duration-200",
                heading.level === 1 && "pl-3 font-medium",
                heading.level === 2 && "pl-3",
                heading.level === 3 && "pl-6 text-xs",
                isActive
                  ? "text-primary font-medium"
                  : isPast
                  ? "text-muted-foreground"
                  : "text-muted-foreground/80 hover:text-foreground"
              )}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              {/* Active/Past indicator */}
              <AnimatePresence>
                {(isActive || isPast) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={cn(
                      "absolute left-0 w-0.5 rounded-full",
                      isActive ? "bg-primary h-full" : "bg-muted-foreground/30 h-full"
                    )}
                  />
                )}
              </AnimatePresence>

              {isActive && (
                <ChevronRight className="h-3 w-3 mr-1 text-primary flex-shrink-0" />
              )}
              
              <span className="truncate">{heading.text}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
};

export default TableOfContents;
