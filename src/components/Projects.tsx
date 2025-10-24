import { useRef, useEffect, useState } from "react";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url?: string;
  metrics?: any;
}

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const location = useLocation();
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isHomePage = location.pathname === "/";
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, [isHomePage]);

  const fetchProjects = async () => {
    try {
      let query = supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true });

      if (isHomePage) {
        query = query.eq("featured", true).limit(4);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching projects:", error);
        toast({ title: "Lỗi tải dự án", description: error.message || String(error), variant: "destructive" });
        setProjects([]);
        return;
      }
      setProjects(data || []);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      toast({ title: "Lỗi tải dự án", description: error.message || String(error), variant: "destructive" });
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section id="projects" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-background">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {isHomePage ? t("featuredProjects") : t("allProjects")}
        </h2>
        {isHomePage && (
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Khám phá những dự án tiêu biểu mà tôi đã thực hiện
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.length === 0 ? (
            <div className="col-span-2 text-center text-muted-foreground py-12">
              Không có dự án để hiển thị.
            </div>
          ) : (
            projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                  {project.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                          {project.category}
                        </span>
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    {!project.image_url && (
                      <CardDescription className="text-sm">
                        {project.category}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{project.description}</p>

                    {project.metrics && project.metrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-4">
                        {project.metrics.map((metric, i) => (
                          <div key={i} className="text-center p-3 bg-accent/50 rounded-lg">
                            <div className="text-2xl font-bold text-primary">
                              {metric.value}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-4">
                      <Button variant="outline" asChild>
                        <Link to={`/projects/${project.slug || project.id}`}>
                          {t("viewDetails")}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {isHomePage && projects.length === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center mt-12"
          >
            <Button asChild size="lg">
              <Link to="/projects">{t("viewMore")}</Link>
            </Button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default Projects;
