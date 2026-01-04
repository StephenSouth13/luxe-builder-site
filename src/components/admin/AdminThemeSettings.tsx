import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useColorTheme, themeConfigs, ColorTheme, ThemeConfig } from "@/hooks/useColorTheme";
import { Palette, Sparkles, Check, Loader2, Sun, Snowflake, Leaf, Flower2, PartyPopper } from "lucide-react";

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

  const standardThemes = themeConfigs.filter(t => t.category === "standard");
  const seasonThemes = themeConfigs.filter(t => t.category === "season");
  const festivalThemes = themeConfigs.filter(t => t.category === "festival");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Standard Themes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme cơ bản
          </CardTitle>
          <CardDescription>
            Các bảng màu cơ bản cho website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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

      {/* Seasonal Themes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Theme theo mùa
          </CardTitle>
          <CardDescription>
            Thay đổi giao diện theo mùa trong năm với hiệu ứng đặc biệt.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {seasonThemes.map((theme) => (
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

      {/* Festival Themes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PartyPopper className="h-5 w-5" />
            Theme lễ hội
          </CardTitle>
          <CardDescription>
            Theme đặc biệt cho các dịp lễ và sự kiện trong năm.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {festivalThemes.map((theme) => (
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
    </div>
  );
};

interface ThemeCardProps {
  theme: ThemeConfig;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const ThemeCard = ({ theme, isActive, onClick, disabled }: ThemeCardProps) => {
  const isSeason = theme.category === "season";
  const isFestival = theme.category === "festival";

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
          className="w-8 h-8 rounded-lg shadow-inner"
          style={{ backgroundColor: theme.preview.background }}
        />
        <div
          className="w-8 h-8 rounded-lg shadow-inner"
          style={{ backgroundColor: theme.preview.primary }}
        />
        {theme.preview.accent && (
          <div
            className="w-8 h-8 rounded-lg shadow-inner"
            style={{ backgroundColor: theme.preview.accent }}
          />
        )}
      </div>

      {/* Theme name with icon */}
      <div className="space-y-1">
        <p className="font-medium text-sm flex items-center gap-1.5">
          {theme.icon && <span>{theme.icon}</span>}
          {theme.nameVi}
        </p>
        <p className="text-xs text-muted-foreground">{theme.name}</p>
        {theme.description && (
          <p className="text-xs text-muted-foreground/70 mt-1">{theme.description}</p>
        )}
      </div>

      {/* Category badge */}
      {(isSeason || isFestival) && (
        <Badge 
          variant="secondary" 
          className={`absolute top-2 right-2 text-xs ${
            isSeason ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
          }`}
        >
          {isSeason ? "Mùa" : "Lễ hội"}
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