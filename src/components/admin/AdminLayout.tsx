import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LogOut, Home, Settings, ExternalLink } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 bg-background/80 backdrop-blur-xl z-10">
        <div className="container mx-auto px-4 py-2.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-sm">
                <Settings className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-foreground tracking-tight">Admin Panel</h1>
                <p className="text-[10px] text-muted-foreground hidden sm:block">Quản lý nội dung website</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" size="sm"
                onClick={() => navigate("/")}
                className="hidden sm:flex items-center gap-1.5 text-xs h-8 hover:bg-primary/5"
              >
                <Home className="h-3.5 w-3.5" />
                Trang chủ
                <ExternalLink className="h-3 w-3 opacity-50" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-1.5 text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/5">
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-5 max-w-6xl">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
