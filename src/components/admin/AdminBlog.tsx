import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, Plus, Edit, Trash2, X, Eye, EyeOff, Star, 
  FileText, Image as ImageIcon, Type, AlignLeft, Tags, 
  Palette, Save, ChevronDown, ChevronUp, LayoutGrid, List as ListIcon,
  Clock, TrendingUp
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUpload from "./ImageUpload";
import { cn } from "@/lib/utils";

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string | null;
  category_id: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  view_count: number;
}

interface BlogCategory {
  id: string;
  name: string;
  color: string;
}

interface BlogTag {
  id: string;
  name: string;
  slug: string;
  color: string;
}

const AdminBlog = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [editorTab, setEditorTab] = useState("content");
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    image_url: "",
    category_id: "",
    featured: false,
    published: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
    fetchTags();
  }, []);

  // Calculate word count and reading time
  useEffect(() => {
    const text = formData.content.replace(/<[^>]*>/g, "").trim();
    const words = text ? text.split(/\s+/).length : 0;
    setWordCount(words);
    setReadingTime(Math.ceil(words / 200));
  }, [formData.content]);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách blog",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("id, name, color")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_tags")
        .select("*")
        .order("name");

      if (error) throw error;
      setTags(data || []);
    } catch (error: any) {
      console.error("Error fetching tags:", error);
    }
  };

  const fetchBlogTags = async (blogId: string) => {
    try {
      const { data, error } = await supabase
        .from("blog_post_tags")
        .select("tag_id")
        .eq("blog_id", blogId);

      if (error) throw error;
      setSelectedTags(data?.map((item) => item.tag_id) || []);
    } catch (error: any) {
      console.error("Error fetching blog tags:", error);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingId(blog.id);
    setFormData({
      title: blog.title,
      slug: blog.slug || "",
      content: blog.content,
      excerpt: blog.excerpt || "",
      image_url: blog.image_url || "",
      category_id: blog.category_id || "",
      featured: blog.featured,
      published: blog.published,
    });
    fetchBlogTags(blog.id);
    setEditorTab("content");
  };

  const handleNew = () => {
    setEditingId("new");
    setSelectedTags([]);
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      image_url: "",
      category_id: "",
      featured: false,
      published: false,
    });
    setEditorTab("content");
  };

  const handleCancel = () => {
    setEditingId(null);
    setSelectedTags([]);
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      image_url: "",
      category_id: "",
      featured: false,
      published: false,
    });
  };

  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const slug = formData.slug || generateSlug(formData.title);

      const saveData = {
        title: formData.title,
        slug: slug,
        content: formData.content,
        excerpt: formData.excerpt || null,
        image_url: formData.image_url || null,
        category_id: formData.category_id || null,
        featured: formData.featured,
        published: formData.published,
      };

      let blogId = editingId;

      if (editingId === "new") {
        const maxOrder = blogs.length > 0 ? Math.max(...blogs.map((b) => b.sort_order)) : 0;
        const { data, error } = await supabase
          .from("blogs")
          .insert({ ...saveData, sort_order: maxOrder + 1 })
          .select("id")
          .single();

        if (error) throw error;
        blogId = data.id;
        toast({ title: "Thành công", description: "Đã thêm blog mới" });
      } else {
        const { error } = await supabase
          .from("blogs")
          .update(saveData)
          .eq("id", editingId);

        if (error) throw error;
        toast({ title: "Thành công", description: "Đã cập nhật blog" });
      }

      // Save tags
      if (blogId && blogId !== "new") {
        await supabase.from("blog_post_tags").delete().eq("blog_id", blogId);

        if (selectedTags.length > 0) {
          const tagInserts = selectedTags.map((tagId) => ({
            blog_id: blogId,
            tag_id: tagId,
          }));
          await supabase.from("blog_post_tags").insert(tagInserts);
        }
      }

      handleCancel();
      await fetchBlogs();
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể lưu",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa blog này?")) return;

    try {
      const { error } = await supabase.from("blogs").delete().eq("id", id);

      if (error) throw error;
      await fetchBlogs();
      toast({ title: "Thành công", description: "Đã xóa blog" });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getCategoryName = (categoryId: string | null) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : "Chưa phân loại";
  };

  const getCategoryColor = (categoryId: string | null) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.color || "#6b7280";
  };

  // Quill modules with enhanced toolbar
  const quillModules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, false] }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
    },
    clipboard: {
      matchVisual: false,
    },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Editor View
  if (editingId) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold">
                {editingId === "new" ? "Tạo bài viết mới" : "Chỉnh sửa bài viết"}
              </h2>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  {wordCount} từ
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  ~{readingTime} phút đọc
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
              <Switch
                checked={formData.published}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, published: checked })
                }
                id="publish-switch"
              />
              <Label htmlFor="publish-switch" className="text-sm cursor-pointer">
                {formData.published ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <Eye className="h-4 w-4" /> Công khai
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <EyeOff className="h-4 w-4" /> Nháp
                  </span>
                )}
              </Label>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving || !formData.title}
              className="gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? "Đang lưu..." : "Lưu bài viết"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
          {/* Main Editor */}
          <div className="space-y-4">
            {/* Title Input */}
            <div className="p-4 bg-card rounded-xl border border-border/50">
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Tiêu đề bài viết..."
                className="border-0 text-2xl font-bold p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Editor Tabs */}
            <Tabs value={editorTab} onValueChange={setEditorTab}>
              <TabsList className="w-full justify-start bg-card border border-border/50">
                <TabsTrigger value="content" className="gap-2">
                  <AlignLeft className="h-4 w-4" />
                  Nội dung
                </TabsTrigger>
                <TabsTrigger value="excerpt" className="gap-2">
                  <Type className="h-4 w-4" />
                  Mô tả ngắn
                </TabsTrigger>
                <TabsTrigger value="image" className="gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Ảnh đại diện
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="mt-4">
                <Card className="border-border/50">
                  <CardContent className="p-0">
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(value) => setFormData({ ...formData, content: value })}
                      modules={quillModules}
                      className="blog-editor"
                      placeholder="Bắt đầu viết nội dung của bạn..."
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="excerpt" className="mt-4">
                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Type className="h-4 w-4 text-primary" />
                      Mô tả ngắn (SEO)
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Mô tả này sẽ hiển thị trên danh sách blog và kết quả tìm kiếm Google
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Viết mô tả ngắn gọn về nội dung bài viết..."
                      rows={4}
                      className="resize-none"
                    />
                    <div className="mt-2 text-xs text-muted-foreground">
                      {formData.excerpt.length}/160 ký tự (khuyến nghị)
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="image" className="mt-4">
                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      Ảnh đại diện
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Ảnh này sẽ hiển thị ở đầu bài viết và khi chia sẻ trên mạng xã hội
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ImageUpload
                      label="Ảnh đại diện"
                      value={formData.image_url}
                      onChange={(url) => setFormData({ ...formData, image_url: url })}
                      folder="blogs"
                      aspectRatio="video"
                      placeholder="Tải ảnh đại diện blog lên"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-4">
            {/* Collapsible Settings */}
            <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <Card className="border-border/50">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="text-base font-medium flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-primary" />
                        Cài đặt bài viết
                      </span>
                      {isSettingsOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-0">
                    {/* Slug */}
                    <div className="space-y-2">
                      <Label className="text-sm">Đường dẫn (Slug)</Label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="tu-dong-tao-tu-tieu-de"
                        className="text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Để trống để tự động tạo từ tiêu đề
                      </p>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label className="text-sm">Danh mục</Label>
                      <Select
                        value={formData.category_id || "none"}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category_id: value === "none" ? "" : value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Không chọn</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: cat.color }}
                                />
                                {cat.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Featured */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <Label className="text-sm flex items-center gap-2 cursor-pointer">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Bài viết nổi bật
                      </Label>
                      <Switch
                        checked={formData.featured}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, featured: checked })
                        }
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Tags */}
            {tags.length > 0 && (
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Tags className="h-4 w-4 text-primary" />
                    Tags ({selectedTags.length} đã chọn)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-all hover:scale-105",
                          selectedTags.includes(tag.id) && "ring-2 ring-primary/30"
                        )}
                        style={{
                          backgroundColor: selectedTags.includes(tag.id) ? tag.color : "transparent",
                          borderColor: tag.color,
                          color: selectedTags.includes(tag.id) ? "white" : tag.color,
                        }}
                        onClick={() => toggleTag(tag.id)}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Preview */}
            {formData.image_url && (
              <Card className="border-border/50 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary" />
                    Xem trước
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full aspect-video object-cover"
                  />
                  <div className="p-3 space-y-2">
                    <h4 className="font-semibold line-clamp-2">
                      {formData.title || "Tiêu đề bài viết"}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {formData.excerpt || "Mô tả ngắn của bài viết..."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Custom styles for Quill */}
        <style>{`
          .blog-editor .ql-container {
            font-size: 16px;
            min-height: 400px;
          }
          .blog-editor .ql-editor {
            min-height: 400px;
            padding: 1.5rem;
          }
          .blog-editor .ql-toolbar {
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
            background: hsl(var(--muted));
            border-color: hsl(var(--border));
          }
          .blog-editor .ql-container {
            border-bottom-left-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
            border-color: hsl(var(--border));
          }
          .blog-editor .ql-editor.ql-blank::before {
            color: hsl(var(--muted-foreground));
            font-style: normal;
          }
        `}</style>
      </div>
    );
  }

  // Blog List View
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Quản lý Blog
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {blogs.length} bài viết • {blogs.filter(b => b.published).length} đã xuất bản
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="rounded-none h-9 w-9"
                onClick={() => setViewMode("list")}
              >
                <ListIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="rounded-none h-9 w-9"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleNew} className="gap-2">
              <Plus className="h-4 w-4" /> Viết bài mới
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-lg mb-2">Chưa có bài viết nào</h3>
            <p className="text-muted-foreground mb-4">
              Bắt đầu viết blog đầu tiên của bạn
            </p>
            <Button onClick={handleNew}>
              <Plus className="h-4 w-4 mr-2" /> Viết bài mới
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {blogs.map((blog) => (
              <Card
                key={blog.id}
                className={cn(
                  "group overflow-hidden transition-all hover:shadow-lg",
                  !blog.published && "opacity-60"
                )}
              >
                {blog.image_url ? (
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={blog.image_url}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {blog.featured && (
                        <Badge className="bg-yellow-500 hover:bg-yellow-600">
                          <Star className="h-3 w-3 mr-1" /> Nổi bật
                        </Badge>
                      )}
                      {!blog.published && (
                        <Badge variant="secondary">
                          <EyeOff className="h-3 w-3 mr-1" /> Nháp
                        </Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-primary/30" />
                  </div>
                )}
                <CardContent className="p-4">
                  <Badge
                    variant="outline"
                    className="mb-2"
                    style={{
                      borderColor: getCategoryColor(blog.category_id),
                      color: getCategoryColor(blog.category_id),
                    }}
                  >
                    {getCategoryName(blog.category_id)}
                  </Badge>
                  <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{formatDate(blog.created_at)}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {blog.view_count || 0}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(blog)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" /> Sửa
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(blog.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors group",
                  !blog.published && "opacity-60"
                )}
              >
                {blog.image_url ? (
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor: getCategoryColor(blog.category_id),
                        color: getCategoryColor(blog.category_id),
                      }}
                    >
                      {getCategoryName(blog.category_id)}
                    </Badge>
                    {blog.featured && (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    )}
                    {!blog.published && (
                      <Badge variant="secondary" className="text-xs">Nháp</Badge>
                    )}
                  </div>
                  <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{formatDate(blog.created_at)}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {blog.view_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> #{blog.sort_order}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(blog)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(blog.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminBlog;
