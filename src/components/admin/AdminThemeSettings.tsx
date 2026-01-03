import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useColorTheme, themeConfigs, ColorTheme } from "@/hooks/useColorTheme";
import { Palette, Sparkles, Check, Loader2 } from "lucide-react";

const AdminThemeSettings = () => {
  const { colorTheme, updateColorTheme, isLoading } = useColorTheme();
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleThemeChange = async (themeId: ColorTheme) => {
    if (themeId === colorTheme) return;
    
    setSaving(true);
    try {
      await updateColorTheme(themeId);
      toast({
        title: "Đã cập nhật theme",
        description: `Theme "${themeConfigs.find(t => t.id === themeId)?.nameVi}" đã được áp dụng.`,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật theme.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const standardThemes = themeConfigs.filter(t => !t.isEvent);
  const eventThemes = themeConfigs.filter(t => t.isEvent);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme màu sắc
          </CardTitle>
          <CardDescription>
            Chọn theme màu sắc cho toàn bộ website. Thay đổi sẽ được áp dụng ngay lập tức.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {standardThemes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isActive={colorTheme === theme.id}
                onClick={() => handleThemeChange(theme.id)}
                disabled={saving}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Theme sự kiện
          </CardTitle>
          <CardDescription>
            Theme đặc biệt theo mùa và sự kiện lễ hội.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {eventThemes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isActive={colorTheme === theme.id}
                onClick={() => handleThemeChange(theme.id)}
                disabled={saving}
                isEvent
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface ThemeCardProps {
  theme: typeof themeConfigs[0];
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
  isEvent?: boolean;
}

const ThemeCard = ({ theme, isActive, onClick, disabled, isEvent }: ThemeCardProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative group p-4 rounded-xl border-2 transition-all duration-300 text-left ${
        isActive
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-primary/50"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {/* Preview colors */}
      <div className="flex gap-2 mb-3">
        <div
          className="w-10 h-10 rounded-lg shadow-inner"
          style={{ backgroundColor: theme.preview.background }}
        />
        <div
          className="w-10 h-10 rounded-lg shadow-inner"
          style={{ backgroundColor: theme.preview.primary }}
        />
      </div>

      {/* Theme name */}
      <div className="space-y-1">
        <p className="font-medium text-sm">{theme.nameVi}</p>
        <p className="text-xs text-muted-foreground">{theme.name}</p>
      </div>

      {/* Event badge */}
      {isEvent && (
        <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
          <Sparkles className="h-3 w-3 mr-1" />
          Sự kiện
        </Badge>
      )}

      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-2 left-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <Check className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </button>
  );
};

export default AdminThemeSettings;
