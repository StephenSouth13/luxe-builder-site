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
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Settings className="h-6 w-6 text-primary" />
                <h1 className="text-xl md:text-2xl font-bold text-gradient">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/")}
                className="hidden sm:flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Trang chủ
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
