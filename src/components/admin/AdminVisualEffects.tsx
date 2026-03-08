import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useVisualEffects, VisualEffectsConfig } from "@/hooks/useVisualEffects";
import { Sparkles, Save, RotateCcw, Loader2, Layers, Mountain, Droplets, Grid3X3, Palette, Star } from "lucide-react";

const effectItems = [
  { key: "parallax" as const, label: "Parallax Scrolling", desc: "Hiệu ứng cuộn nhiều lớp tạo chiều sâu", icon: Mountain },
  { key: "glassmorphism" as const, label: "Glassmorphism", desc: "Hiệu ứng kính mờ cho thẻ và container", icon: Droplets },
  { key: "decorativeOrbs" as const, label: "Decorative Orbs", desc: "Quả cầu gradient trang trí nền các section", icon: Star },
  { key: "noiseOverlay" as const, label: "Noise Overlay", desc: "Texture nhiễu nhẹ tạo chiều sâu cho nền", icon: Grid3X3 },
  { key: "meshGradient" as const, label: "Mesh Gradient", desc: "Gradient lưới đa màu cho nền section", icon: Palette },
  { key: "glowCards" as const, label: "Glow Cards", desc: "Hiệu ứng phát sáng khi hover vào thẻ", icon: Layers },
];

const AdminVisualEffects = () => {
  const { config, updateConfig, isLoading } = useVisualEffects();
  const [local, setLocal] = useState<VisualEffectsConfig>(config);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => { setLocal(config); }, [config]);

  const toggle = (key: keyof VisualEffectsConfig) => {
    setLocal(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateConfig(local);
      toast({ title: "Đã lưu", description: "Cài đặt hiệu ứng đã được cập nhật." });
    } catch {
      toast({ title: "Lỗi", description: "Không thể lưu.", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleReset = () => {
    setLocal({ parallax: true, glassmorphism: true, decorativeOrbs: true, noiseOverlay: true, meshGradient: true, glowCards: true });
  };

  const allOn = Object.values(local).every(Boolean);
  const allOff = Object.values(local).every(v => !v);

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Hiệu ứng hình ảnh
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Bật/tắt các hiệu ứng parallax, glassmorphism và trang trí</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { const val = !allOn; setLocal({ parallax: val, glassmorphism: val, decorativeOrbs: val, noiseOverlay: val, meshGradient: val, glowCards: val }); }}>
            {allOn ? "Tắt tất cả" : "Bật tất cả"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1" /> Reset
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
            Lưu
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {effectItems.map(({ key, label, desc, icon: Icon }) => (
          <Card key={key} className={`border transition-all duration-200 ${local[key] ? "border-primary/30 bg-primary/5" : "border-border/50"}`}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-2.5 rounded-xl transition-colors ${local[key] ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Label className="font-medium text-sm cursor-pointer" onClick={() => toggle(key)}>{label}</Label>
                  <Badge variant={local[key] ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
                    {local[key] ? "ON" : "OFF"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
              <Switch checked={local[key]} onCheckedChange={() => toggle(key)} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance note */}
      <p className="text-xs text-muted-foreground text-center mt-2">
        💡 Tắt parallax và glassmorphism có thể cải thiện hiệu suất trên thiết bị yếu
      </p>
    </div>
  );
};

export default AdminVisualEffects;
