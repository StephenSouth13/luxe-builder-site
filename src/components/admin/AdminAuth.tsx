import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AdminAuthProps {
  onAuthSuccess: () => void;
}

const AdminAuth = ({ onAuthSuccess }: AdminAuthProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      if (data.user) {
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({ user_id: data.user.id, role: "admin" });

        if (roleError) throw roleError;

        toast({
          title: "Tạo tài khoản thành công",
          description: "Tài khoản admin đã được tạo. Đang đăng nhập...",
        });
        onAuthSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Tạo tài khoản thất bại",
        description: error.message || "Không thể tạo tài khoản admin",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError) throw roleError;

      if (!roleData) {
        await supabase.auth.signOut();
        toast({
          title: "Unauthorized",
          description: "Tài khoản không có quyền admin.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng đến trang quản trị!",
      });
      onAuthSuccess();
    } catch (error: any) {
      toast({
        title: "Đăng nhập thất bại",
        description: error.message || "Email hoặc mật khẩu không đúng",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isSignupMode ? "Tạo tài khoản Admin" : "Admin Login"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignupMode ? "Tạo tài khoản admin đầu tiên" : "Đăng nhập để quản lý nội dung"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isSignupMode ? handleSignup : handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@trinhbalam.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignupMode ? "Đang tạo tài khoản..." : "Đang đăng nhập..."}
                </>
              ) : (
                isSignupMode ? "Tạo tài khoản Admin" : "Đăng nhập"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsSignupMode(!isSignupMode)}
            >
              {isSignupMode ? "Đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Đăng ký"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
