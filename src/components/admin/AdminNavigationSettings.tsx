import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Menu, Eye, EyeOff, Layout, Layers, Pencil, RotateCcw, MousePointer, ArrowUp, Share2, Copyright } from "lucide-react";

interface NavigationItem {
  key: string;
  label: string;
  defaultLabel: string;
  path: string;
  visible: boolean;
}

interface SectionItem {
  key: string;
  label: string;
  defaultLabel: string;
  description: string;
  visible: boolean;
}

interface ElementToggle {
  key: string;
  label: string;
  description: string;
  visible: boolean;
  icon: any;
}

const defaultNavItems: NavigationItem[] = [
  { key: "home", label: "Trang chủ", defaultLabel: "Trang chủ", path: "/", visible: true },
  { key: "about", label: "Giới thiệu", defaultLabel: "Giới thiệu", path: "/about", visible: true },
  { key: "projects", label: "Dự án", defaultLabel: "Dự án", path: "/projects", visible: true },
  { key: "blog", label: "Blog", defaultLabel: "Blog", path: "/blog", visible: true },
  { key: "store", label: "Cửa hàng", defaultLabel: "Cửa hàng", path: "/store", visible: true },
  { key: "contact", label: "Liên hệ", defaultLabel: "Liên hệ", path: "/contact", visible: true },
];

const defaultSectionItems: SectionItem[] = [
  { key: "hero", label: "Hero Banner", defaultLabel: "Hero Banner", description: "Phần giới thiệu đầu trang", visible: true },
  { key: "about", label: "Giới thiệu", defaultLabel: "Giới thiệu", description: "Phần về tôi", visible: true },
  { key: "experience", label: "Kinh nghiệm", defaultLabel: "Kinh nghiệm", description: "Kinh nghiệm làm việc", visible: true },
  { key: "education", label: "Học vấn", defaultLabel: "Học vấn", description: "Quá trình học tập", visible: true },
  { key: "projects", label: "Dự án", defaultLabel: "Dự án", description: "Các dự án nổi bật", visible: true },
  { key: "certificates", label: "Chứng chỉ", defaultLabel: "Chứng chỉ", description: "Các chứng chỉ đạt được", visible: true },
  { key: "blogs", label: "Blog", defaultLabel: "Blog", description: "Bài viết mới nhất", visible: true },
  { key: "contact", label: "Liên hệ", defaultLabel: "Liên hệ", description: "Thông tin liên hệ", visible: true },
];

const defaultHeroElements: ElementToggle[] = [
  { key: "hero_profile_image", label: "Ảnh đại diện", description: "Ảnh profile trên Hero", visible: true, icon: Eye },
  { key: "hero_contact_button", label: "Nút Liên hệ", description: "Nút CTA liên hệ ngay", visible: true, icon: MousePointer },
  { key: "hero_cv_button", label: "Nút Tải CV", description: "Nút tải xuống CV", visible: true, icon: MousePointer },
  { key: "hero_scroll_indicator", label: "Mũi tên cuộn", description: "Icon mũi tên cuộn xuống", visible: true, icon: MousePointer },
  { key: "hero_quote", label: "Trích dẫn", description: "Dòng quote phía dưới title", visible: true, icon: Eye },
];

const defaultFooterElements: ElementToggle[] = [
  { key: "footer_social_links", label: "Mạng xã hội", description: "Các icon social links", visible: true, icon: Share2 },
  { key: "footer_links_grid", label: "Footer Links", description: "Lưới các liên kết footer", visible: true, icon: Layout },
  { key: "footer_back_to_top", label: "Nút lên đầu", description: "Nút cuộn lên đầu trang", visible: true, icon: ArrowUp },
  { key: "footer_copyright", label: "Copyright", description: "Dòng bản quyền", visible: true, icon: Copyright },
  { key: "footer_logo", label: "Logo / Tên", description: "Logo hoặc tên trên footer", visible: true, icon: Eye },
];

const AdminNavigationSettings = () => {
  const queryClient = useQueryClient();
  const [navItems, setNavItems] = useState<NavigationItem[]>(defaultNavItems);
  const [sectionItems, setSectionItems] = useState<SectionItem[]>(defaultSectionItems);
  const [heroElements, setHeroElements] = useState<ElementToggle[]>(defaultHeroElements);
  const [footerElements, setFooterElements] = useState<ElementToggle[]>(defaultFooterElements);
  const [editingNav, setEditingNav] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const { data: savedNavSettings, isLoading: isLoadingNav } = useQuery({
    queryKey: ["navigation-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("*").eq("key", "navigation_visibility").single();
      if (error && error.code !== "PGRST116") throw error;
      return data?.value ? JSON.parse(data.value) : null;
    },
  });

  const { data: savedNavLabels, isLoading: isLoadingNavLabels } = useQuery({
    queryKey: ["navigation-labels"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("*").eq("key", "navigation_labels").single();
      if (error && error.code !== "PGRST116") throw error;
      return data?.value ? JSON.parse(data.value) : null;
    },
  });

  const { data: savedSectionSettings, isLoading: isLoadingSections } = useQuery({
    queryKey: ["section-visibility"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("*").eq("key", "section_visibility").single();
      if (error && error.code !== "PGRST116") throw error;
      return data?.value ? JSON.parse(data.value) : null;
    },
  });

  const { data: savedSectionLabels, isLoading: isLoadingSectionLabels } = useQuery({
    queryKey: ["section-labels"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("*").eq("key", "section_labels").single();
      if (error && error.code !== "PGRST116") throw error;
      return data?.value ? JSON.parse(data.value) : null;
    },
  });

  const { data: savedElementVisibility } = useQuery({
    queryKey: ["element-visibility"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("*").eq("key", "element_visibility").single();
      if (error && error.code !== "PGRST116") throw error;
      return data?.value ? JSON.parse(data.value) : null;
    },
  });

  useEffect(() => {
    if (savedNavSettings || savedNavLabels) {
      setNavItems(defaultNavItems.map((item) => ({
        ...item,
        visible: savedNavSettings ? savedNavSettings[item.key] !== false : true,
        label: savedNavLabels?.[item.key] || item.defaultLabel,
      })));
    }
  }, [savedNavSettings, savedNavLabels]);

  useEffect(() => {
    if (savedSectionSettings || savedSectionLabels) {
      setSectionItems(defaultSectionItems.map((item) => ({
        ...item,
        visible: savedSectionSettings ? savedSectionSettings[item.key] !== false : true,
        label: savedSectionLabels?.[item.key] || item.defaultLabel,
      })));
    }
  }, [savedSectionSettings, savedSectionLabels]);

  useEffect(() => {
    if (savedElementVisibility) {
      setHeroElements(prev => prev.map(el => ({
        ...el,
        visible: savedElementVisibility[el.key] !== false,
      })));
      setFooterElements(prev => prev.map(el => ({
        ...el,
        visible: savedElementVisibility[el.key] !== false,
      })));
    }
  }, [savedElementVisibility]);

  const saveSetting = async (key: string, value: string) => {
    const { data: existing } = await supabase.from("settings").select("id").eq("key", key).single();
    if (existing) {
      const { error } = await supabase.from("settings").update({ value, updated_at: new Date().toISOString() }).eq("key", key);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("settings").insert({ key, value });
      if (error) throw error;
    }
  };

  const saveNavMutation = useMutation({
    mutationFn: async (items: NavigationItem[]) => {
      const visibilityMap = Object.fromEntries(items.map(i => [i.key, i.visible]));
      const labelsMap = Object.fromEntries(items.map(i => [i.key, i.label]));
      await saveSetting("navigation_visibility", JSON.stringify(visibilityMap));
      await saveSetting("navigation_labels", JSON.stringify(labelsMap));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation-settings"] });
      queryClient.invalidateQueries({ queryKey: ["navigation-labels"] });
      toast({ title: "Đã lưu", description: "Cài đặt menu đã được cập nhật" });
    },
    onError: () => { toast({ title: "Lỗi", description: "Không thể lưu cài đặt", variant: "destructive" }); },
  });

  const saveSectionMutation = useMutation({
    mutationFn: async (items: SectionItem[]) => {
      const visibilityMap = Object.fromEntries(items.map(i => [i.key, i.visible]));
      const labelsMap = Object.fromEntries(items.map(i => [i.key, i.label]));
      await saveSetting("section_visibility", JSON.stringify(visibilityMap));
      await saveSetting("section_labels", JSON.stringify(labelsMap));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["section-visibility"] });
      queryClient.invalidateQueries({ queryKey: ["section-labels"] });
      toast({ title: "Đã lưu", description: "Cài đặt sections đã được cập nhật" });
    },
    onError: () => { toast({ title: "Lỗi", description: "Không thể lưu cài đặt", variant: "destructive" }); },
  });

  const saveElementsMutation = useMutation({
    mutationFn: async () => {
      const map = Object.fromEntries([...heroElements, ...footerElements].map(el => [el.key, el.visible]));
      await saveSetting("element_visibility", JSON.stringify(map));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["element-visibility"] });
      toast({ title: "Đã lưu", description: "Cài đặt phần tử đã được cập nhật" });
    },
    onError: () => { toast({ title: "Lỗi", description: "Không thể lưu", variant: "destructive" }); },
  });

  const toggleNavVisibility = (key: string) => setNavItems(prev => prev.map(i => i.key === key ? { ...i, visible: !i.visible } : i));
  const toggleSectionVisibility = (key: string) => setSectionItems(prev => prev.map(i => i.key === key ? { ...i, visible: !i.visible } : i));
  const updateNavLabel = (key: string, newLabel: string) => setNavItems(prev => prev.map(i => i.key === key ? { ...i, label: newLabel } : i));
  const updateSectionLabel = (key: string, newLabel: string) => setSectionItems(prev => prev.map(i => i.key === key ? { ...i, label: newLabel } : i));
  const resetNavLabel = (key: string) => { const d = defaultNavItems.find(i => i.key === key); if (d) updateNavLabel(key, d.defaultLabel); };
  const resetSectionLabel = (key: string) => { const d = defaultSectionItems.find(i => i.key === key); if (d) updateSectionLabel(key, d.defaultLabel); };

  const toggleElement = (key: string, group: "hero" | "footer") => {
    const setter = group === "hero" ? setHeroElements : setFooterElements;
    setter(prev => prev.map(el => el.key === key ? { ...el, visible: !el.visible } : el));
  };

  if (isLoadingNav || isLoadingSections || isLoadingNavLabels || isLoadingSectionLabels) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-muted"></div>
          <div className="h-4 w-24 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const ToggleRow = ({ item, onToggle, disabled }: { item: { key: string; label: string; description: string; visible: boolean; icon?: any }; onToggle: () => void; disabled?: boolean }) => {
    const Icon = item.icon || (item.visible ? Eye : EyeOff);
    return (
      <div className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${item.visible ? 'bg-card border-border/60 hover:border-primary/40' : 'bg-muted/20 border-border/30 opacity-70'}`}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${item.visible ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-medium ${!item.visible && 'text-muted-foreground'}`}>{item.label}</p>
            <p className="text-xs text-muted-foreground truncate">{item.description}</p>
          </div>
        </div>
        <Switch checked={item.visible} onCheckedChange={onToggle} disabled={disabled} />
      </div>
    );
  };

  return (
    <Tabs defaultValue="navigation" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6 h-auto p-1 bg-muted/30 rounded-xl">
        {[
          { value: "navigation", icon: Menu, label: "Menu" },
          { value: "sections", icon: Layers, label: "Sections" },
          { value: "hero-elements", icon: MousePointer, label: "Hero" },
          { value: "footer-elements", icon: Layout, label: "Footer" },
        ].map(tab => (
          <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1.5 py-2 text-xs rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <tab.icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="navigation">
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Menu className="h-4 w-4 text-primary" /></div>
              Quản lý Menu Điều hướng
            </CardTitle>
            <CardDescription>Bật/tắt và đổi tên các mục menu trên header</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {navItems.map((item) => (
              <div key={item.key} className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${item.visible ? 'bg-card border-border/60 hover:border-primary/40' : 'bg-muted/20 border-border/30 opacity-70'}`}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.visible ? 'bg-primary/10' : 'bg-muted'}`}>
                    {item.visible ? <Eye className="h-4 w-4 text-primary" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingNav === item.key ? (
                      <div className="flex items-center gap-2">
                        <Input value={item.label} onChange={(e) => updateNavLabel(item.key, e.target.value)} className="h-8 text-sm" autoFocus onKeyDown={(e) => { if (e.key === 'Enter') setEditingNav(null); if (e.key === 'Escape') { resetNavLabel(item.key); setEditingNav(null); }}} />
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => resetNavLabel(item.key)} title="Reset"><RotateCcw className="h-3 w-3" /></Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Label className={`text-sm font-medium ${!item.visible && 'text-muted-foreground'}`}>{item.label}</Label>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingNav(item.key)}><Pencil className="h-3 w-3" /></Button>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">{item.path}</p>
                  </div>
                </div>
                <Switch checked={item.visible} onCheckedChange={() => toggleNavVisibility(item.key)} disabled={item.key === "home"} />
              </div>
            ))}
            <div className="flex justify-end pt-3 border-t border-border/30">
              <Button onClick={() => { saveNavMutation.mutate(navItems); setEditingNav(null); }} disabled={saveNavMutation.isPending} size="sm">
                <Save className="h-4 w-4 mr-1.5" />{saveNavMutation.isPending ? "Đang lưu..." : "Lưu menu"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sections">
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Layers className="h-4 w-4 text-primary" /></div>
              Quản lý Sections Trang chủ
            </CardTitle>
            <CardDescription>Bật/tắt và đổi tên các phần hiển thị trên trang chủ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sectionItems.map((item) => (
              <div key={item.key} className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${item.visible ? 'bg-card border-border/60 hover:border-primary/40' : 'bg-muted/20 border-border/30 opacity-70'}`}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.visible ? 'bg-primary/10' : 'bg-muted'}`}>
                    {item.visible ? <Eye className="h-4 w-4 text-primary" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingSection === item.key ? (
                      <div className="flex items-center gap-2">
                        <Input value={item.label} onChange={(e) => updateSectionLabel(item.key, e.target.value)} className="h-8 text-sm" autoFocus onKeyDown={(e) => { if (e.key === 'Enter') setEditingSection(null); if (e.key === 'Escape') { resetSectionLabel(item.key); setEditingSection(null); }}} />
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => resetSectionLabel(item.key)}><RotateCcw className="h-3 w-3" /></Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Label className={`text-sm font-medium ${!item.visible && 'text-muted-foreground'}`}>{item.label}</Label>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingSection(item.key)}><Pencil className="h-3 w-3" /></Button>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <Switch checked={item.visible} onCheckedChange={() => toggleSectionVisibility(item.key)} />
              </div>
            ))}
            <div className="flex justify-end pt-3 border-t border-border/30">
              <Button onClick={() => { saveSectionMutation.mutate(sectionItems); setEditingSection(null); }} disabled={saveSectionMutation.isPending} size="sm">
                <Save className="h-4 w-4 mr-1.5" />{saveSectionMutation.isPending ? "Đang lưu..." : "Lưu sections"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="hero-elements">
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><MousePointer className="h-4 w-4 text-primary" /></div>
              Phần tử Hero
            </CardTitle>
            <CardDescription>Ẩn/hiện các phần tử trong Hero Banner</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {heroElements.map((el) => (
              <ToggleRow key={el.key} item={el} onToggle={() => toggleElement(el.key, "hero")} />
            ))}
            <div className="flex justify-end pt-3 border-t border-border/30">
              <Button onClick={() => saveElementsMutation.mutate()} disabled={saveElementsMutation.isPending} size="sm">
                <Save className="h-4 w-4 mr-1.5" />{saveElementsMutation.isPending ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="footer-elements">
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Layout className="h-4 w-4 text-primary" /></div>
              Phần tử Footer
            </CardTitle>
            <CardDescription>Ẩn/hiện các phần tử trong Footer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {footerElements.map((el) => (
              <ToggleRow key={el.key} item={el} onToggle={() => toggleElement(el.key, "footer")} />
            ))}
            <div className="flex justify-end pt-3 border-t border-border/30">
              <Button onClick={() => saveElementsMutation.mutate()} disabled={saveElementsMutation.isPending} size="sm">
                <Save className="h-4 w-4 mr-1.5" />{saveElementsMutation.isPending ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdminNavigationSettings;
