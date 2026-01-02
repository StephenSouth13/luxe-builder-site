import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Eye, Clock, BookOpen, ChevronUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SEOHead from "@/components/SEOHead";
import DOMPurify from "dompurify";
import ReadingProgress from "@/components/blog/ReadingProgress";
import TableOfContents from "@/components/blog/TableOfContents";
import ShareButtons from "@/components/blog/ShareButtons";
import AuthorCard from "@/components/blog/AuthorCard";
import RelatedPosts from "@/components/blog/RelatedPosts";
import BlogTags from "@/components/blog/BlogTags";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string | null;
  created_at: string;
  view_count: number;
  category_id: string | null;
  category?: {
    name: string;
    color: string;
    slug: string;
  };
}

interface BlogTag {
  id: string;
  name: string;
  slug: string;
  color: string;
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchBlog();
      incrementViewCount();
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select(`
          *,
          category:blog_categories(name, color, slug)
        `)
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error) throw error;
      setBlog(data);

      // Calculate reading time (average 200 words per minute)
      const wordCount = data.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
      setReadingTime(Math.ceil(wordCount / 200));

      // Fetch tags
      fetchTags(data.id);
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTags = async (blogId: string) => {
    try {
      const { data, error } = await supabase
        .from("blog_post_tags")
        .select(`
          tag:blog_tags(id, name, slug, color)
        `)
        .eq("blog_id", blogId);

      if (error) throw error;
      const tagList = data?.map((item: any) => item.tag).filter(Boolean) || [];
      setTags(tagList);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const incrementViewCount = async () => {
    try {
      await supabase.rpc("increment_blog_view", { blog_slug: slug });
    } catch (error) {
      console.error("Error incrementing view:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <>
        <SEOHead title="Loading..." />
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto space-y-8">
              <Skeleton className="h-[400px] w-full rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-3/4" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-28" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <SEOHead title="Blog không tồn tại" />
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Không tìm thấy bài viết</h1>
              <p className="text-muted-foreground mb-8">
                Bài viết bạn tìm kiếm có thể đã bị xóa hoặc không tồn tại
              </p>
              <Link to="/blog">
                <Button size="lg" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Quay lại Blog
                </Button>
              </Link>
            </motion.div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      <SEOHead
        title={`${blog.title} - Blog Trịnh Bá Lâm`}
        description={blog.excerpt || blog.content.slice(0, 160)}
        image={blog.image_url || undefined}
      />
      <ReadingProgress />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        {/* Hero Section */}
        {blog.image_url && (
          <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
            <div className="absolute inset-0">
              <img
                src={blog.image_url}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
            </div>
            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-4 pb-12 md:pb-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-4xl"
                >
                  <Link to="/blog" className="inline-block mb-6">
                    <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Quay lại Blog
                    </Button>
                  </Link>
                  {blog.category && (
                    <Link to={`/blog?category=${blog.category.slug}`}>
                      <Badge
                        className="mb-4 hover:scale-105 transition-transform"
                        style={{
                          backgroundColor: blog.category.color,
                          color: "white",
                        }}
                      >
                        {blog.category.name}
                      </Badge>
                    </Link>
                  )}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
                    {blog.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-white/80">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(blog.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>{formatViewCount(blog.view_count || 0)} lượt xem</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{readingTime} phút đọc</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            {/* No image - show title here */}
            {!blog.image_url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Link to="/blog" className="inline-block mb-6">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại Blog
                  </Button>
                </Link>
                {blog.category && (
                  <Link to={`/blog?category=${blog.category.slug}`} className="block mb-4">
                    <Badge
                      style={{
                        backgroundColor: blog.category.color,
                        color: "white",
                      }}
                    >
                      {blog.category.name}
                    </Badge>
                  </Link>
                )}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight mb-6">
                  {blog.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(blog.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{formatViewCount(blog.view_count || 0)} lượt xem</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime} phút đọc</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 lg:gap-12">
              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Tags */}
                {tags.length > 0 && (
                  <div className="mb-6">
                    <BlogTags tags={tags} />
                  </div>
                )}

                {/* Share Buttons Top */}
                <div className="mb-8 pb-6 border-b border-border/50">
                  <ShareButtons title={blog.title} url={currentUrl} />
                </div>

                {/* Article Content */}
                <article className="prose prose-lg dark:prose-invert max-w-none">
                  <div
                    className="prose-content text-foreground/90 leading-relaxed
                      prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:text-foreground
                      prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-6 prose-h1:border-b prose-h1:pb-4 prose-h1:border-border/30
                      prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:flex prose-h2:items-center prose-h2:gap-3
                      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                      prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-2
                      prose-p:mb-4 prose-p:leading-relaxed prose-p:text-foreground/85
                      prose-a:text-primary prose-a:no-underline prose-a:font-medium hover:prose-a:underline
                      prose-strong:text-foreground prose-strong:font-semibold
                      prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                      prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-4 prose-blockquote:italic prose-blockquote:rounded-r-lg prose-blockquote:my-6
                      prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                      prose-pre:bg-slate-900 prose-pre:rounded-xl prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:my-6
                      prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                      prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
                      prose-li:my-1.5 prose-li:text-foreground/85
                      prose-hr:my-8 prose-hr:border-border/50
                      prose-table:my-6 prose-table:w-full prose-table:border-collapse
                      prose-th:bg-muted prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:border prose-th:border-border
                      prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-border"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
                  />
                </article>

                {/* Bottom Share */}
                <div className="mt-12 pt-8 border-t border-border/50">
                  <h3 className="text-lg font-semibold mb-4">Chia sẻ bài viết</h3>
                  <ShareButtons title={blog.title} url={currentUrl} />
                </div>

                {/* Author Card */}
                <div className="mt-10">
                  <AuthorCard />
                </div>

                {/* Related Posts */}
                <div className="mt-12">
                  <RelatedPosts currentBlogId={blog.id} categoryId={blog.category_id} />
                </div>
              </motion.div>

              {/* Sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-6">
                  <TableOfContents content={blog.content} />
                  
                  {/* Quick Stats */}
                  <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
                    <h4 className="text-sm font-semibold mb-3 text-foreground">Thống kê</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Lượt xem</span>
                        <span className="font-medium text-foreground">{blog.view_count || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Thời gian đọc</span>
                        <span className="font-medium text-foreground">{readingTime} phút</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ngày đăng</span>
                        <span className="font-medium text-foreground">
                          {new Date(blog.created_at).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>

        {/* Scroll to Top Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: showScrollTop ? 1 : 0, scale: showScrollTop ? 1 : 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all"
          style={{ pointerEvents: showScrollTop ? "auto" : "none" }}
        >
          <ChevronUp className="h-5 w-5" />
        </motion.button>

        <Footer />
      </div>
    </>
  );
};

export default BlogDetail;
