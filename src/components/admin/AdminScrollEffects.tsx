import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  useScrollEffects, 
  scrollEffectOptions, 
  easingOptions, 
  sectionNames,
  ScrollEffectType,
  ScrollEffectsConfig,
  SectionScrollEffect,
  getMotionVariants
} from "@/hooks/useScrollEffects";
import { motion } from "framer-motion";
import { Wand2, RotateCcw, Save, Eye, Loader2 } from "lucide-react";

const AdminScrollEffects = () => {
  const { config, updateConfig, isLoading } = useScrollEffects();
  const [localConfig, setLocalConfig] = useState<ScrollEffectsConfig>(config);
  const [saving, setSaving] = useState(false);
  const [previewSection, setPreviewSection] = useState<string | null>(null);
  const { toast } = useToast();

  // Sync local when loaded
  useState(() => { setLocalConfig(config); });

  const updateSection = (section: string, field: keyof SectionScrollEffect, value: any) => {
    setLocalConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateConfig(localConfig);
      toast({ title: "Đã lưu", description: "Hiệu ứng cuộn trang đã được cập nhật." });
    } catch {
      toast({ title: "Lỗi", description: "Không thể lưu cài đặt.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const defaults: ScrollEffectsConfig = {
      hero: { effect: "fade-up", duration: 0.8, delay: 0, easing: "easeOut" },
      about: { effect: "fade-up", duration: 0.6, delay: 0.1, easing: "easeOut" },
      skills: { effect: "fade-up", duration: 0.6, delay: 0.1, easing: "easeOut" },
      experience: { effect: "fade-left", duration: 0.6, delay: 0.1, easing: "easeOut" },
      education: { effect: "fade-right", duration: 0.6, delay: 0.1, easing: "easeOut" },
      projects: { effect: "zoom-in", duration: 0.5, delay: 0.1, easing: "easeOut" },
      certificates: { effect: "fade-up", duration: 0.6, delay: 0.1, easing: "easeOut" },
      blogs: { effect: "fade-up", duration: 0.6, delay: 0.1, easing: "easeOut" },
      contact: { effect: "fade-up", duration: 0.6, delay: 0, easing: "easeOut" },
    };
    setLocalConfig(defaults);
  };

  const triggerPreview = (section: string) => {
    setPreviewSection(null);
    setTimeout(() => setPreviewSection(section), 50);
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            Hiệu ứng cuộn trang
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Tùy chỉnh animation khi cuộn đến từng section</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1" /> Reset
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
            Lưu
          </Button>
        </div>
      </div>

      <div className="grid gap-3">
        {Object.entries(sectionNames).map(([key, name]) => {
          const sectionConfig = localConfig[key] || { effect: "fade-up", duration: 0.6, delay: 0, easing: "easeOut" };
          const motionProps = getMotionVariants(sectionConfig);

          return (
            <Card key={key} className="border border-border/50">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Section name */}
                  <div className="lg:w-24 shrink-0">
                    <Badge variant="secondary" className="text-xs">{name}</Badge>
                  </div>

                  {/* Controls */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Hiệu ứng</Label>
                      <Select value={sectionConfig.effect} onValueChange={(v) => updateSection(key, "effect", v as ScrollEffectType)}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {scrollEffectOptions.map(o => (
                            <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Thời gian: {sectionConfig.duration}s</Label>
                      <Slider
                        value={[sectionConfig.duration]}
                        onValueChange={([v]) => updateSection(key, "duration", v)}
                        min={0.1} max={2} step={0.1}
                        className="mt-2"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Delay: {sectionConfig.delay}s</Label>
                      <Slider
                        value={[sectionConfig.delay]}
                        onValueChange={([v]) => updateSection(key, "delay", v)}
                        min={0} max={1} step={0.05}
                        className="mt-2"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Easing</Label>
                      <Select value={sectionConfig.easing} onValueChange={(v) => updateSection(key, "easing", v)}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {easingOptions.map(o => (
                            <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Preview button */}
                  <Button variant="ghost" size="sm" className="shrink-0" onClick={() => triggerPreview(key)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                {/* Live preview */}
                {previewSection === key && (
                  <div className="mt-3 p-4 rounded-lg bg-muted/30 border border-border/30 overflow-hidden">
                    <motion.div
                      key={`preview-${key}-${Date.now()}`}
                      initial={motionProps.initial}
                      animate={motionProps.animate}
                      transition={motionProps.transition}
                      className="bg-primary/10 rounded-lg p-4 text-center"
                    >
                      <p className="text-sm font-medium">Xem trước hiệu ứng "{name}"</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {scrollEffectOptions.find(o => o.value === sectionConfig.effect)?.label} • {sectionConfig.duration}s • {sectionConfig.delay}s delay
                      </p>
                    </motion.div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminScrollEffects;
