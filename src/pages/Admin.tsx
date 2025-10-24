import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import AdminAbout from "@/components/admin/AdminAbout";
import AdminSkills from "@/components/admin/AdminSkills";
import AdminExperiences from "@/components/admin/AdminExperiences";
import AdminProjects from "@/components/admin/AdminProjects";

const Admin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(true);

      // Check if user is admin
      const { data: roleData, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error) throw error;

      if (roleData) {
        setIsAdmin(true);
      } else {
        toast({
          title: "Unauthorized",
          description: "Bạn không có quyền truy cập trang admin.",
          variant: "destructive",
        });
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error: any) {
      console.error("Auth check error:", error);
      toast({
        title: "Error",
        description: "Lỗi kiểm tra quyền truy cập",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Insert admin role
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: data.user.id,
            role: "admin",
          });

        if (roleError) throw roleError;

        toast({
          title: "Tạo tài khoản thành công",
          description: "Tài khoản admin đã được tạo. Đang đăng nhập...",
        });

        // Automatically log in
        setIsAuthenticated(true);
        setIsAdmin(true);
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is admin
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

      setIsAuthenticated(true);
      setIsAdmin(true);
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng đến trang quản trị!",
      });
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-gold/20">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {isSignupMode ? "Tạo tài khoản Admin" : "Admin Login"}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignupMode
                ? "Tạo tài khoản admin đầu tiên"
                : "Đăng nhập để quản lý nội dung"}
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
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
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
                {isSignupMode
                  ? "Đã có tài khoản? Đăng nhập"
                  : "Chưa có tài khoản? Đăng ký"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-gold/20 sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gradient">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="about">Về tôi</TabsTrigger>
            <TabsTrigger value="skills">Kỹ năng</TabsTrigger>
            <TabsTrigger value="experiences">Kinh nghiệm</TabsTrigger>
            <TabsTrigger value="projects">Dự án</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <AdminAbout />
          </TabsContent>

          <TabsContent value="skills">
            <AdminSkills />
          </TabsContent>

          <TabsContent value="experiences">
            <AdminExperiences />
          </TabsContent>

          <TabsContent value="projects">
            <AdminProjects />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
