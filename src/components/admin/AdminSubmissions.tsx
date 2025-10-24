import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from "lucide-react";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  created_at: string;
  seen: boolean;
}

const AdminSubmissions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setSubmissions(data || []);
    } catch (err: any) {
      toast({ title: "Lỗi", description: err.message || "Không thể tải danh sách liên hệ", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xóa?")) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
      if (error) throw error;
      setSubmissions((s) => s.filter((x) => x.id !== id));
      toast({ title: "Đã xóa" });
    } catch (err: any) {
      toast({ title: "Lỗi", description: err.message || "Không thể xóa", variant: "destructive" });
    } finally {
      setIsDeleting(false);
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
        <CardTitle>Danh sách Người liên hệ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {submissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có khách hàng liên hệ nào.</p>
        ) : (
          <div className="space-y-3">
            {submissions.map((s) => (
              <div key={s.id} className="p-3 border border-border rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{s.name} <span className="text-xs text-muted-foreground">• {new Date(s.created_at).toLocaleString()}</span></div>
                    <div className="text-sm text-muted-foreground">{s.email} {s.phone ? `• ${s.phone}` : ""}</div>
                    <div className="mt-2 text-sm whitespace-pre-wrap">{s.message}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} disabled={isDeleting}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminSubmissions;
