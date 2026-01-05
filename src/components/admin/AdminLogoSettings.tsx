import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Image, Type, Trash2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

const AdminLogoSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [logoText, setLogoText] = useState("TBL");
  const { toast } = useToast();

  useEffect(() => {
    fetchLogoSettings();
  }, []);

  const fetchLogoSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("key, value")
        .in("key", ["site_logo", "site_logo_text"]);

      if (error) throw error;

      const logo = data?.find(d => d.key === "site_logo");
      const text = data?.find(d => d.key === "site_logo_text");

      if (logo) setLogoUrl(logo.value || "");
      if (text) setLogoText(text.value || "TBL");
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: "Không thể tải cài đặt logo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update logo URL
      await supabase
        .from("settings")
        .upsert({ key: "site_logo", value: logoUrl }, { onConflict: "key" });

      // Update logo text
      await supabase
        .from("settings")
        .upsert({ key: "site_logo_text", value: logoText }, { onConflict: "key" });

      toast({
        title: "Thành công",
        description: "Đã cập nhật cài đặt logo",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể lưu cài đặt",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Cài đặt Logo
        </CardTitle>
        <CardDescription>
          Tải lên logo hoặc sử dụng văn bản cho thương hiệu của bạn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview */}
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Xem trước:</p>
          <div className="flex items-center justify-center h-20 bg-background rounded border">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Logo preview" 
                className="h-12 w-auto object-contain"
              />
            ) : (
              <span className="text-2xl font-bold text-gradient">
                {logoText || "TBL"}
              </span>
            )}
          </div>
        </div>

        {/* Logo Image Upload */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Logo hình ảnh
          </Label>
          <ImageUpload
            label=""
            value={logoUrl}
            onChange={setLogoUrl}
            folder="logos"
            aspectRatio="video"
            placeholder="Tải lên logo"
          />
          {logoUrl && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRemoveLogo}
              className="mt-2"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa logo
            </Button>
          )}
          <p className="text-xs text-muted-foreground">
            Nếu có logo hình ảnh, nó sẽ được ưu tiên hiển thị thay cho văn bản
          </p>
        </div>

        {/* Logo Text */}
        <div className="space-y-2">
          <Label htmlFor="logoText" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Logo văn bản
          </Label>
          <Input
            id="logoText"
            value={logoText}
            onChange={(e) => setLogoText(e.target.value)}
            placeholder="VD: TBL, Logo, Brand..."
            maxLength={20}
          />
          <p className="text-xs text-muted-foreground">
            Văn bản sẽ hiển thị nếu không có logo hình ảnh (tối đa 20 ký tự)
          </p>
        </div>

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            "Lưu thay đổi"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminLogoSettings;
