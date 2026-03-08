import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProjectsSkeleton } from "@/components/skeletons/SectionSkeletons";
import { useToast } from "@/hooks/use-toast";
import { useSectionLabels } from "@/hooks/useSectionLabels";
import { useLayoutTemplate, ProjectsLayout } from "@/hooks/useLayoutTemplate";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Project {
  id: string; title: string; category: string; description: string;
  image_url?: string; metrics?: any; slug?: string | null; featured?: boolean;
}

const Projects = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getLabel } = useSectionLabels();
  const { layouts } = useLayoutTemplate();
  const isHomePage = location.pathname === "/";
  const { toast } = useToast();
  const [filtersEnabled, setFiltersEnabled] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => { fetchSettings(); }, []);
  useEffect(() => { fetchProjects(); }, [isHomePage, selectedCategory, filtersEnabled]);

  const fetchSettings = async () => {
    try { const { data } = await supabase.from("settings").select("value").eq("key", "projects_filters_enabled").maybeSingle(); setFiltersEnabled(data?.value === "true"); } catch { setFiltersEnabled(true); }
  };

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      let query: any = supabase.from("projects").select("*").order("sort_order", { ascending: true });
      if (isHomePage) { query = query.eq("featured", true).limit(6); }
      else if (filtersEnabled && selectedCategory) { query = query.eq("category", selectedCategory); }
      const { data, error } = await query;
      if (error) { console.error(error); setProjects([]); return; }
      setProjects(data || []);
    } catch (error: any) { console.error(error); setProjects([]); } finally { setIsLoading(false); }
  };

  if (isLoading) return <ProjectsSkeleton />;
  if (isHomePage && projects.length === 0) return null;

  const layout: ProjectsLayout = isHomePage ? layouts.projects : "grid";

  const ProjectCard = ({ project, index, size = "normal" }: { project: Project; index: number; size?: string }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
      <Card className={`h-full hover:shadow-xl transition-shadow duration-300 overflow-hidden group ${size === "large" ? "" : ""}`}>
        {project.image_url && (
          <div className={`relative overflow-hidden ${size === "large" ? "h-64" : "h-48"}`}>
            <img src={project.image_url} alt={project.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute top-4 right-4"><span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">{project.category}</span></div>
          </div>
        )}
        <CardHeader><CardTitle className="text-xl">{project.title}</CardTitle>{!project.image_url && <CardDescription className="text-sm">{project.category}</CardDescription>}</CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{project.description}</p>
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {project.metrics.map((metric: any, i: number) => (
                <div key={i} className="text-center p-3 bg-accent/50 rounded-lg"><div className="text-2xl font-bold text-primary">{metric.value}</div><div className="text-xs text-muted-foreground mt-1">{metric.label}</div></div>
              ))}
            </div>
          )}
          <div className="flex justify-between items-center mt-4"><Button variant="outline" asChild><Link to={`/projects/${project.slug || project.id}`}>{t("viewDetails")}</Link></Button></div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const Filters = () => !isHomePage && filtersEnabled ? (
    <div className="flex flex-wrap justify-center gap-3 mb-6">
      <button onClick={() => setSelectedCategory(null)} className={`px-4 py-2 rounded-full transition-all ${selectedCategory === null ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}`}>Tất cả</button>
      {Array.from(new Set(projects.map(p => p.category).filter(Boolean))).map((c) => (
        <button key={c} onClick={() => setSelectedCategory(c)} className={`px-4 py-2 rounded-full transition-all ${selectedCategory === c ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}`}>{c}</button>
      ))}
    </div>
  ) : null;

  return (
    <section id="projects" className="py-20 bg-background">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.5 }} className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            {isHomePage ? getLabel("projects") : t("allProjects")}
          </h2>
          <p className="text-muted-foreground text-lg mb-6">Khám phá những dự án tiêu biểu mà tôi đã thực hiện</p>
          <Filters />
        </div>

        {/* Grid */}
        {layout === "grid" && (
          <div className={`grid gap-6 md:gap-8 max-w-7xl mx-auto ${isHomePage ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
            {projects.length === 0 ? <div className="col-span-full text-center text-muted-foreground py-12">Không có dự án để hiển thị.</div>
              : projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
          </div>
        )}

        {/* Masonry */}
        {layout === "masonry" && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 max-w-7xl mx-auto">
            {projects.map((p, i) => (
              <div key={p.id} className="break-inside-avoid mb-6"><ProjectCard project={p} index={i} /></div>
            ))}
          </div>
        )}

        {/* Carousel */}
        {layout === "carousel" && (
          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${carouselIndex * 100}%)` }}>
                {projects.map((p, i) => (
                  <div key={p.id} className="w-full sm:w-1/2 lg:w-1/3 shrink-0 px-3">
                    <ProjectCard project={p} index={i} />
                  </div>
                ))}
              </div>
            </div>
            {projects.length > 3 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button variant="outline" size="icon" onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 1))} disabled={carouselIndex === 0}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCarouselIndex(Math.min(projects.length - 3, carouselIndex + 1))} disabled={carouselIndex >= projects.length - 3}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Timeline */}
        {layout === "timeline" && (
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/50 -translate-x-1/2 hidden lg:block" />
            {projects.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }} className={`relative mb-8 lg:mb-12 ${i % 2 === 0 ? 'lg:pr-[52%]' : 'lg:pl-[52%]'}`}>
                <div className="hidden lg:block absolute left-1/2 top-6 w-3 h-3 rounded-full bg-primary -translate-x-1/2 ring-4 ring-background" />
                <ProjectCard project={p} index={i} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Bento */}
        {layout === "bento" && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto auto-rows-[200px]">
            {projects.map((p, i) => {
              const span = i === 0 ? "col-span-2 row-span-2" : i === 1 ? "col-span-2" : "";
              return (
                <motion.div key={p.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }} className={`${span}`}>
                  <Link to={`/projects/${p.slug || p.id}`} className="group block h-full rounded-xl overflow-hidden relative border border-border/40 hover:border-primary/40 transition-all">
                    {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="text-xs text-primary font-medium">{p.category}</span>
                      <h3 className="text-sm sm:text-base font-semibold text-foreground mt-1 line-clamp-2">{p.title}</h3>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {isHomePage && projects.length >= 4 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.8 }} className="text-center mt-12">
            <Button asChild size="lg"><Link to="/projects">{t("viewMore")}</Link></Button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default Projects;
