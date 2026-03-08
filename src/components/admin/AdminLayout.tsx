import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LogOut, Home, Settings } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur-md z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Settings className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-foreground">Admin Panel</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Quản lý nội dung website</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/")}
                className="hidden sm:flex items-center gap-1.5 text-xs h-8"
              >
                <Home className="h-3.5 w-3.5" />
                Trang chủ
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-1.5 text-xs h-8 text-destructive hover:text-destructive">
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-4">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
