import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SEOHead from "@/components/SEOHead";

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string | null;
  created_at: string;
}

// Simple HTML sanitizer - removes script tags and event handlers
const sanitizeHtml = (html: string): string => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
};

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error) throw error;
      setBlog(data);
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <>
        <SEOHead title="Loading..." />
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto space-y-8">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
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
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Không tìm thấy bài viết</h1>
              <Link to="/blog">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại Blog
                </Button>
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead 
        title={`${blog.title} - Blog Trịnh Bá Lâm`}
        description={blog.excerpt || blog.content.slice(0, 160)}
        image={blog.image_url || undefined}
      />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog" className="inline-block mb-8">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại Blog
              </Button>
            </Link>

            {blog.image_url && (
              <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
                <img
                  src={blog.image_url}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
              </div>
            )}

            <article className="prose prose-lg dark:prose-invert max-w-none">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                {blog.title}
              </h1>
              
              <div className="flex items-center gap-2 text-muted-foreground mb-8">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(blog.created_at)}</span>
              </div>

              <div 
                className="prose-content text-foreground/90 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.content) }}
              />
            </article>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BlogDetail;