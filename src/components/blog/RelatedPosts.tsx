import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  created_at: string;
  view_count: number;
  category?: {
    name: string;
    color: string;
    slug: string;
  };
}

interface RelatedPostsProps {
  currentBlogId: string;
  categoryId: string | null;
}

const RelatedPosts = ({ currentBlogId, categoryId }: RelatedPostsProps) => {
  const [posts, setPosts] = useState<RelatedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRelatedPosts();
  }, [currentBlogId, categoryId]);

  const fetchRelatedPosts = async () => {
    try {
      let query = supabase
        .from("blogs")
        .select(`
          id, title, slug, excerpt, image_url, created_at, view_count,
          category:blog_categories(name, color, slug)
        `)
        .eq("published", true)
        .neq("id", currentBlogId)
        .order("created_at", { ascending: false })
        .limit(3);

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // If not enough posts in same category, fetch more from all categories
      if (data && data.length < 3 && categoryId) {
        const existingIds = data.map((p) => p.id);
        existingIds.push(currentBlogId);

        const { data: moreData } = await supabase
          .from("blogs")
          .select(`
            id, title, slug, excerpt, image_url, created_at, view_count,
            category:blog_categories(name, color, slug)
          `)
          .eq("published", true)
          .not("id", "in", `(${existingIds.join(",")})`)
          .order("created_at", { ascending: false })
          .limit(3 - data.length);

        if (moreData) {
          setPosts([...data, ...moreData]);
          return;
        }
      }

      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching related posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Bài viết liên quan</h2>
        <Link 
          to="/blog"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          Xem tất cả <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/blog/${post.slug}`}>
              <Card className="h-full overflow-hidden group hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30">
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary/20">
                        {post.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {post.category && (
                    <Badge
                      className="absolute top-3 left-3 text-xs"
                      style={{
                        backgroundColor: post.category.color,
                        color: "white",
                      }}
                    >
                      {post.category.name}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.view_count || 0}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
