import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import BackToTop from "@/components/BackToTop";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  full_description?: string;
  challenge?: string;
  solution?: string;
  image_url?: string;
  link?: string;
  technologies?: string[];
  metrics?: any;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-20 container mx-auto px-4 py-16">
          <p className="text-center text-muted-foreground">Project not found</p>
          <div className="text-center mt-8">
            <Link to="/projects">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("backToProjects")}
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <Link to="/projects">
            <Button variant="outline" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToProjects")}
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Image Section */}
              <div className="space-y-6">
                {project.image_url && (
                  <div className="rounded-lg overflow-hidden border border-border shadow-lg">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
                
                {project.metrics && project.metrics.length > 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold mb-4">{t("projectMetrics")}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {project.metrics.map((metric, index) => (
                          <div key={index} className="text-center p-4 bg-accent/50 rounded-lg">
                            <div className="text-2xl font-bold text-primary">{metric.value}</div>
                            <div className="text-sm text-muted-foreground mt-1">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Content Section */}
              <div className="space-y-8">
                <div>
                  <Badge className="mb-3">{project.category}</Badge>
                  <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
                  <p className="text-lg text-muted-foreground">{project.description}</p>
                </div>

                {project.technologies && project.technologies.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">{t("technologies")}</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {project.full_description && (
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Overview</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.full_description}
                    </p>
                  </div>
                )}

                {project.challenge && (
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-semibold mb-3">{t("challenge")}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {project.challenge}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {project.solution && (
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-semibold mb-3">{t("solution")}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {project.solution}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {project.link && (
                  <Button asChild size="lg" className="w-full">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      Visit Project
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
      <FloatingChat />
      <BackToTop />
    </div>
  );
};

export default ProjectDetail;
