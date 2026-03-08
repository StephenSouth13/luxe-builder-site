import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSectionLabels } from "@/hooks/useSectionLabels";
import { useLayoutTemplate, BlogLayout } from "@/hooks/useLayoutTemplate";
import { motion } from "framer-motion";
import { useParallax } from "@/hooks/useParallax";

interface Blog { id: string; title: string; slug: string; excerpt: string; image_url: string | null; created_at: string; }

const BlogsSection = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getLabel } = useSectionLabels();
  const { layouts } = useLayoutTemplate();
  const { ref: parallaxRef, y: parallaxY } = useParallax(0.1);

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase.from("blogs").select("id, title, slug, excerpt, image_url, created_at")
        .eq("published", true).eq("featured", true).order("created_at", { ascending: false }).limit(4);
      if (error) throw error;
      setBlogs(data || []);
    } catch (error) { console.error("Error fetching blogs:", error); } finally { setIsLoading(false); }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" });

  if (isLoading) return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold mb-4">Blog</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (<Card key={i}><Skeleton className="h-48 w-full" /><CardContent className="p-4 space-y-3"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-full" /></CardContent></Card>))}
        </div>
      </div>
    </section>
  );

  if (blogs.length === 0) return null;

  const layout: BlogLayout = layouts.blog;

  const BlogCard = ({ blog, index, featured = false }: { blog: Blog; index: number; featured?: boolean }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.08 }}>
      <Link to={`/blog/${blog.slug}`} className="group block h-full">
        <Card className={`h-full overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] border-border/50 hover:border-primary/50 flex flex-col ${featured ? '' : ''}`}>
          {blog.image_url && (
            <div className={`relative overflow-hidden ${featured ? 'h-56 sm:h-72' : 'h-40 sm:h-48'}`}>
              <img src={blog.image_url} alt={blog.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          )}
          <CardContent className="p-3 sm:p-4 flex flex-col flex-1">
            <div className="flex-1 space-y-2 sm:space-y-3">
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground"><Calendar className="h-3 w-3" /><span>{formatDate(blog.created_at)}</span></div>
              <h3 className={`font-semibold group-hover:text-primary transition-colors line-clamp-2 ${featured ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}>{blog.title}</h3>
              {blog.excerpt && <p className={`text-muted-foreground line-clamp-2 ${featured ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>{blog.excerpt}</p>}
            </div>
            <div className="flex items-center gap-2 text-primary text-sm font-medium pt-4 mt-auto">
              Xem chi tiết <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );

  const ViewAllButton = () => (
    <div className="text-center mt-8">
      <Link to="/blog"><Button size="lg" className="group">Xem tất cả bài viết <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></Button></Link>
    </div>
  );

  return (
     <section ref={parallaxRef} className="py-16 sm:py-20 px-4 parallax-section noise-overlay mesh-gradient">
      <motion.div style={{ y: parallaxY }} className="parallax-bg">
        <div className="absolute top-0 left-1/3 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-56 h-56 rounded-full bg-accent/4 blur-3xl" />
      </motion.div>
      <div className="container relative z-10 mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">{getLabel("blogs")}</h2>
          <p className="text-muted-foreground text-base sm:text-lg">Chia sẻ kiến thức và kinh nghiệm</p>
        </div>

        {/* Grid layout */}
        {layout === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {blogs.map((blog, i) => <BlogCard key={blog.id} blog={blog} index={i} />)}
          </div>
        )}

        {/* Magazine layout: 1 large + rest small */}
        {layout === "magazine" && (
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {blogs[0] && <BlogCard blog={blogs[0]} index={0} featured />}
            <div className="grid gap-4">
              {blogs.slice(1).map((blog, i) => <BlogCard key={blog.id} blog={blog} index={i + 1} />)}
            </div>
          </div>
        )}

        {/* Minimal list */}
        {layout === "minimal-list" && (
          <div className="max-w-3xl mx-auto space-y-4 mb-8">
            {blogs.map((blog, i) => (
              <motion.div key={blog.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                <Link to={`/blog/${blog.slug}`} className="group flex items-center gap-6 p-4 rounded-xl border border-border/40 hover:border-primary/40 bg-card hover:bg-card/80 transition-all">
                  {blog.image_url && <img src={blog.image_url} alt={blog.title} className="w-20 h-20 rounded-lg object-cover shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">{formatDate(blog.created_at)}</p>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors truncate">{blog.title}</h3>
                    {blog.excerpt && <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{blog.excerpt}</p>}
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Featured + grid */}
        {layout === "featured-grid" && (
          <div className="space-y-6 mb-8">
            {blogs[0] && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Link to={`/blog/${blogs[0].slug}`} className="group block">
                  <div className="relative rounded-2xl overflow-hidden aspect-[21/9] border border-border/40">
                    {blogs[0].image_url && <img src={blogs[0].image_url} alt={blogs[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                      <p className="text-xs text-primary mb-2">{formatDate(blogs[0].created_at)}</p>
                      <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{blogs[0].title}</h3>
                      {blogs[0].excerpt && <p className="text-foreground/70 max-w-2xl">{blogs[0].excerpt}</p>}
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
            <div className="grid sm:grid-cols-3 gap-4">
              {blogs.slice(1).map((blog, i) => <BlogCard key={blog.id} blog={blog} index={i + 1} />)}
            </div>
          </div>
        )}

        <ViewAllButton />
      </div>
    </section>
  );
};

export default BlogsSection;
