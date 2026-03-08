import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLayoutTemplate, layoutOptions, LayoutTemplates } from "@/hooks/useLayoutTemplate";
import { Layout, Save, Loader2, Check } from "lucide-react";

const AdminLayoutTemplates = () => {
  const { layouts, updateLayouts, isLoading } = useLayoutTemplate();
  const [localLayouts, setLocalLayouts] = useState<LayoutTemplates>(layouts);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => { setLocalLayouts(layouts); }, [layouts]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateLayouts(localLayouts);
      toast({ title: "Đã lưu", description: "Layout templates đã được cập nhật" });
    } catch {
      toast({ title: "Lỗi", description: "Không thể lưu", variant: "destructive" });
    } finally { setSaving(false); }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const sections = [
    { key: "hero" as const, title: "Hero Banner", desc: "Bố cục phần hero đầu trang" },
    { key: "projects" as const, title: "Dự án", desc: "Cách hiển thị danh sách dự án" },
    { key: "about" as const, title: "Giới thiệu", desc: "Bố cục phần về tôi" },
    { key: "blog" as const, title: "Blog", desc: "Cách hiển thị bài viết trên trang chủ" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Layout className="h-5 w-5 text-primary" />
            Mẫu bố cục
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Chọn kiểu hiển thị cho từng section</p>
        </div>
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
          Lưu
        </Button>
      </div>

      {sections.map(({ key, title, desc }) => (
        <Card key={key} className="border-border/40 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <CardDescription className="text-xs">{desc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {layoutOptions[key].map((opt) => {
                const isActive = localLayouts[key] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setLocalLayouts(prev => ({ ...prev, [key]: opt.value }))}
                    className={`relative p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                      isActive ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border/40 hover:border-primary/30 bg-card"
                    }`}
                  >
                    <div className="text-2xl mb-2">{opt.icon}</div>
                    <p className="text-xs font-medium">{opt.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{opt.description}</p>
                    {isActive && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminLayoutTemplates;
