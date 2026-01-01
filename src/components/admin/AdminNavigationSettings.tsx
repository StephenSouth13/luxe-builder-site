import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Menu, Eye, EyeOff, Layout, Layers } from "lucide-react";

interface NavigationItem {
  key: string;
  label: string;
  path: string;
  visible: boolean;
}

interface SectionItem {
  key: string;
  label: string;
  description: string;
  visible: boolean;
}

const defaultNavItems: NavigationItem[] = [
  { key: "home", label: "Trang chủ", path: "/", visible: true },
  { key: "about", label: "Giới thiệu", path: "/about", visible: true },
  { key: "projects", label: "Dự án", path: "/projects", visible: true },
  { key: "blog", label: "Blog", path: "/blog", visible: true },
  { key: "store", label: "Cửa hàng", path: "/store", visible: true },
  { key: "contact", label: "Liên hệ", path: "/contact", visible: true },
];

const defaultSectionItems: SectionItem[] = [
  { key: "hero", label: "Hero Banner", description: "Phần giới thiệu đầu trang", visible: true },
  { key: "about", label: "Giới thiệu", description: "Phần về tôi", visible: true },
  { key: "experience", label: "Kinh nghiệm", description: "Kinh nghiệm làm việc", visible: true },
  { key: "education", label: "Học vấn", description: "Quá trình học tập", visible: true },
  { key: "projects", label: "Dự án", description: "Các dự án nổi bật", visible: true },
  { key: "certificates", label: "Chứng chỉ", description: "Các chứng chỉ đạt được", visible: true },
  { key: "blogs", label: "Blog", description: "Bài viết mới nhất", visible: true },
  { key: "contact", label: "Liên hệ", description: "Thông tin liên hệ", visible: true },
];

const AdminNavigationSettings = () => {
  const queryClient = useQueryClient();
  const [navItems, setNavItems] = useState<NavigationItem[]>(defaultNavItems);
  const [sectionItems, setSectionItems] = useState<SectionItem[]>(defaultSectionItems);

  const { data: savedNavSettings, isLoading: isLoadingNav } = useQuery({
    queryKey: ["navigation-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("key", "navigation_visibility")
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }
      return data?.value ? JSON.parse(data.value) : null;
    },
  });

  const { data: savedSectionSettings, isLoading: isLoadingSections } = useQuery({
    queryKey: ["section-visibility"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("key", "section_visibility")
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }
      return data?.value ? JSON.parse(data.value) : null;
    },
  });

  useEffect(() => {
    if (savedNavSettings) {
      setNavItems(
        defaultNavItems.map((item) => ({
          ...item,
          visible: savedNavSettings[item.key] !== false,
        }))
      );
    }
  }, [savedNavSettings]);

  useEffect(() => {
    if (savedSectionSettings) {
      setSectionItems(
        defaultSectionItems.map((item) => ({
          ...item,
          visible: savedSectionSettings[item.key] !== false,
        }))
      );
    }
  }, [savedSectionSettings]);

  const saveNavMutation = useMutation({
    mutationFn: async (items: NavigationItem[]) => {
      const visibilityMap = items.reduce(
        (acc, item) => ({
          ...acc,
          [item.key]: item.visible,
        }),
        {}
      );

      const { data: existing } = await supabase
        .from("settings")
        .select("id")
        .eq("key", "navigation_visibility")
        .single();

      if (existing) {
        const { error } = await supabase
          .from("settings")
          .update({ value: JSON.stringify(visibilityMap), updated_at: new Date().toISOString() })
          .eq("key", "navigation_visibility");
        if (error) throw error;
      } else {
        const { error } = await supabase.from("settings").insert({
          key: "navigation_visibility",
          value: JSON.stringify(visibilityMap),
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation-settings"] });
      toast({
        title: "Đã lưu",
        description: "Cài đặt menu đã được cập nhật",
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể lưu cài đặt",
        variant: "destructive",
      });
    },
  });

  const saveSectionMutation = useMutation({
    mutationFn: async (items: SectionItem[]) => {
      const visibilityMap = items.reduce(
        (acc, item) => ({
          ...acc,
          [item.key]: item.visible,
        }),
        {}
      );

      const { data: existing } = await supabase
        .from("settings")
        .select("id")
        .eq("key", "section_visibility")
        .single();

      if (existing) {
        const { error } = await supabase
          .from("settings")
          .update({ value: JSON.stringify(visibilityMap), updated_at: new Date().toISOString() })
          .eq("key", "section_visibility");
        if (error) throw error;
      } else {
        const { error } = await supabase.from("settings").insert({
          key: "section_visibility",
          value: JSON.stringify(visibilityMap),
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["section-visibility"] });
      toast({
        title: "Đã lưu",
        description: "Cài đặt sections đã được cập nhật",
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể lưu cài đặt",
        variant: "destructive",
      });
    },
  });

  const toggleNavVisibility = (key: string) => {
    setNavItems((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, visible: !item.visible } : item
      )
    );
  };

  const toggleSectionVisibility = (key: string) => {
    setSectionItems((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, visible: !item.visible } : item
      )
    );
  };

  const handleSaveNav = () => {
    saveNavMutation.mutate(navItems);
  };

  const handleSaveSections = () => {
    saveSectionMutation.mutate(sectionItems);
  };

  if (isLoadingNav || isLoadingSections) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-muted"></div>
          <div className="h-4 w-24 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="navigation" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="navigation" className="flex items-center gap-2">
          <Menu className="h-4 w-4" />
          Menu Header
        </TabsTrigger>
        <TabsTrigger value="sections" className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Sections Trang chủ
        </TabsTrigger>
      </TabsList>

      <TabsContent value="navigation">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Menu className="h-5 w-5 text-primary" />
              Quản lý Menu Điều hướng
            </CardTitle>
            <CardDescription>
              Bật/tắt các mục menu hiển thị trên header của website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {navItems.map((item) => (
                <div
                  key={item.key}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    item.visible 
                      ? 'bg-card border-border hover:border-primary/50' 
                      : 'bg-muted/30 border-border/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.visible ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      {item.visible ? (
                        <Eye className="h-4 w-4 text-primary" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <Label className={`text-base font-medium ${!item.visible && 'text-muted-foreground'}`}>
                        {item.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{item.path}</p>
                    </div>
                  </div>
                  <Switch
                    checked={item.visible}
                    onCheckedChange={() => toggleNavVisibility(item.key)}
                    disabled={item.key === "home"}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSaveNav} disabled={saveNavMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {saveNavMutation.isPending ? "Đang lưu..." : "Lưu cài đặt menu"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sections">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5 text-primary" />
              Quản lý Sections Trang chủ
            </CardTitle>
            <CardDescription>
              Bật/tắt các phần hiển thị trên trang chủ của website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3">
              {sectionItems.map((item) => (
                <div
                  key={item.key}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    item.visible 
                      ? 'bg-card border-border hover:border-primary/50' 
                      : 'bg-muted/30 border-border/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.visible ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      {item.visible ? (
                        <Eye className="h-4 w-4 text-primary" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <Label className={`text-base font-medium ${!item.visible && 'text-muted-foreground'}`}>
                        {item.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={item.visible}
                    onCheckedChange={() => toggleSectionVisibility(item.key)}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSaveSections} disabled={saveSectionMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {saveSectionMutation.isPending ? "Đang lưu..." : "Lưu cài đặt sections"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdminNavigationSettings;
