import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Calendar, MapPin, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSectionLabels } from "@/hooks/useSectionLabels";

interface Experience {
  id: string;
  year: string;
  title: string;
  company: string;
  location: string | null;
  description: string | null;
  achievements: string[] | null;
  sort_order: number;
}

const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const { getLabel } = useSectionLabels();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      if (data) setExperiences(data);
    } catch (error) {
      console.error("Error fetching experiences:", error);
    }
  };

  // Don't render empty section
  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="py-20 lg:py-32 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            {getLabel("experience")}
          </h2>
          <p className="text-center text-muted-foreground mb-12 lg:mb-16 max-w-2xl mx-auto">
            Hành trình phát triển sự nghiệp chuyên môn
          </p>

          <div className="relative pl-6 sm:pl-0">
            {/* Timeline line - mobile left, desktop center */}
            <div className="absolute left-0 sm:hidden top-0 h-full w-0.5 bg-gradient-to-b from-primary via-gold to-primary/20" />
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary via-gold to-primary/20" />

            <div className="space-y-8 sm:space-y-12">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`relative grid md:grid-cols-2 gap-4 sm:gap-8 ${
                    index % 2 === 0 ? "md:text-right" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Mobile timeline dot */}
                  <div className="sm:hidden absolute -left-[9px] top-8 w-4 h-4 rounded-full bg-primary border-2 border-background" />
                  
                  {/* Content */}
                  <div className={`pl-4 sm:pl-0 ${index % 2 === 0 ? "md:pr-12" : "md:col-start-2 md:pl-12"}`}>
                    <div className="bg-card border border-border rounded-xl p-6 sm:p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
                      <div className={`flex items-center gap-2 mb-2 sm:mb-3 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-xs sm:text-sm font-semibold text-primary">{exp.year}</span>
                      </div>
                      
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {exp.title}
                      </h3>
                      
                      <div className={`flex flex-wrap items-center gap-1 sm:gap-2 text-foreground/80 mb-3 sm:mb-4 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                        <span className="font-medium text-sm sm:text-base">{exp.company}</span>
                        {exp.location && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex items-center gap-1 w-full sm:w-auto">
                              <MapPin className="h-3 w-3" />
                              <span className="text-xs sm:text-sm">{exp.location}</span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {exp.description && (
                        <p className="text-sm sm:text-base text-foreground/70 mb-3 sm:mb-4">{exp.description}</p>
                      )}
                      
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="space-y-1.5 sm:space-y-2">
                          {exp.achievements.map((achievement, i) => (
                            <div key={i} className={`flex items-start gap-2 ${index % 2 === 0 ? "md:justify-end md:text-right" : ""}`}>
                              <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary mt-0.5 sm:mt-1 shrink-0" />
                              <span className="text-xs sm:text-sm text-foreground/80">{achievement}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="hidden md:block absolute left-1/2 top-8 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background glow-gold" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
