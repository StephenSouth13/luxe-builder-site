import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, FileText, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "./ImageUpload";

const AdminHero = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCV, setIsUploadingCV] = useState(false);
  const [heroId, setHeroId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [quote, setQuote] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");
  const [showContactButton, setShowContactButton] = useState(true);
  const [showCvButton, setShowCvButton] = useState(true);
  const [cvFileUrl, setCvFileUrl] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const { data, error } = await supabase
        .from("hero_section")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setHeroId(data.id);
        setName(data.name);
        setTitle(data.title);
        setQuote(data.quote);
        setProfileImageUrl(data.profile_image_url || "");
        setBackgroundImageUrl(data.background_image_url || "");
        setShowContactButton(data.show_contact_button !== false);
        setShowCvButton(data.show_cv_button !== false);
        setCvFileUrl(data.cv_file_url || "");
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (heroId) {
        const { error } = await supabase
          .from("hero_section")
          .update({
            name,
            title,
            quote,
            profile_image_url: profileImageUrl || null,
            background_image_url: backgroundImageUrl || null,
            show_contact_button: showContactButton,
            show_cv_button: showCvButton,
            cv_file_url: cvFileUrl || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", heroId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("hero_section")
          .insert({
            name,
            title,
            quote,
            profile_image_url: profileImageUrl || null,
            background_image_url: backgroundImageUrl || null,
            show_contact_button: showContactButton,
            show_cv_button: showCvButton,
            cv_file_url: cvFileUrl || null,
          })
          .select()
          .single();

        if (error) throw error;
        setHeroId(data.id);
      }

      toast({
        title: "Thành công",
        description: "Đã lưu thông tin Hero",
      });
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

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý Hero Banner</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Chức danh</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quote">Câu trích dẫn</Label>
            <Textarea
              id="quote"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              rows={3}
              required
            />
          </div>

          <ImageUpload
            label="Ảnh đại diện"
            value={profileImageUrl}
            onChange={setProfileImageUrl}
            folder="hero"
            aspectRatio="square"
          />

          <ImageUpload
            label="Ảnh nền"
            value={backgroundImageUrl}
            onChange={setBackgroundImageUrl}
            folder="hero"
            aspectRatio="banner"
          />

          {/* Button Visibility Settings */}
          <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
            <h4 className="font-semibold">Cài đặt nút bấm</h4>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Hiển thị nút "Liên hệ ngay"</Label>
                <p className="text-sm text-muted-foreground">Bật/tắt nút liên hệ trên Hero</p>
              </div>
              <Switch
                checked={showContactButton}
                onCheckedChange={setShowContactButton}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Hiển thị nút "Tải CV"</Label>
                <p className="text-sm text-muted-foreground">Bật/tắt nút tải CV trên Hero</p>
              </div>
              <Switch
                checked={showCvButton}
                onCheckedChange={setShowCvButton}
              />
            </div>

            {showCvButton && (
              <div className="space-y-2">
                <Label>File CV (PDF)</Label>
                {cvFileUrl ? (
                  <div className="flex items-center gap-2 p-2 border rounded bg-background">
                    <FileText className="h-5 w-5 text-primary" />
                    <a 
                      href={cvFileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex-1 truncate"
                    >
                      {cvFileUrl.split('/').pop()}
                    </a>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setCvFileUrl("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setIsUploadingCV(true);
                        try {
                          const fileName = `cv-${Date.now()}.pdf`;
                          const { error: uploadError } = await supabase.storage
                            .from("project-images")
                            .upload(`cv/${fileName}`, file);
                          
                          if (uploadError) throw uploadError;
                          
                          const { data } = supabase.storage
                            .from("project-images")
                            .getPublicUrl(`cv/${fileName}`);
                          
                          setCvFileUrl(data.publicUrl);
                          toast({ title: "Thành công", description: "Đã tải lên CV" });
                        } catch (err: any) {
                          toast({ title: "Lỗi", description: err.message, variant: "destructive" });
                        } finally {
                          setIsUploadingCV(false);
                        }
                      }}
                      disabled={isUploadingCV}
                    />
                    {isUploadingCV && <Loader2 className="h-5 w-5 animate-spin" />}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Nếu không upload, sẽ sử dụng file mặc định /CV_TrinhBaLam.pdf
                </p>
              </div>
            )}
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminHero;
