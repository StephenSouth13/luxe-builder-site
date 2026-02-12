import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import AdminHero from "./AdminHero";
import AdminAbout from "./AdminAbout";
import AdminSkills from "./AdminSkills";
import AdminEducation from "./AdminEducation";
import AdminExperiences from "./AdminExperiences";
import AdminProjects from "./AdminProjects";
import AdminBlog from "./AdminBlog";
import AdminBlogCategories from "./AdminBlogCategories";
import AdminBlogTags from "./AdminBlogTags";
import AdminContact from "./AdminContact";
import AdminFooter from "./AdminFooter";
import AdminSocial from "./AdminSocial";
import AdminSubmissions from "./AdminSubmissions";
import AdminChatbot from "./AdminChatbot";
import AdminNavigationSettings from "./AdminNavigationSettings";
import AdminStore from "./AdminStore";
import AdminCertificates from "./AdminCertificates";
import AdminVouchers from "./AdminVouchers";
import AdminStoreSettings from "./AdminStoreSettings";
import AdminThemeSettings from "./AdminThemeSettings";
import AdminLogoSettings from "./AdminLogoSettings";
import { 
  FileText, 
  Newspaper, 
  Store, 
  Phone, 
  Settings,
  User,
  Briefcase,
  GraduationCap,
  Award,
  FolderKanban,
  Palette,
  Image,
  Navigation,
  MessageSquare,
  Mail,
  Share2,
  Info,
  Link as LinkIcon,
  BarChart3,
  Package,
  Tag,
  ClipboardList,
  Cog,
  Ticket
} from "lucide-react";

const AdminTabs = () => {
  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6 h-auto p-1 bg-muted/50">
        <TabsTrigger value="content" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Nội dung</span>
        </TabsTrigger>
        <TabsTrigger value="blog" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <Newspaper className="h-4 w-4" />
          <span className="hidden sm:inline">Blog</span>
        </TabsTrigger>
        <TabsTrigger value="store" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <Store className="h-4 w-4" />
          <span className="hidden sm:inline">Cửa hàng</span>
        </TabsTrigger>
        <TabsTrigger value="contact" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">Liên hệ</span>
        </TabsTrigger>
        <TabsTrigger value="system" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Hệ thống</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="mt-0">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 md:p-6">
            <Tabs defaultValue="hero" className="w-full">
              <TabsList className="w-full flex flex-wrap justify-start gap-1 h-auto bg-transparent p-0 mb-6">
                <TabsTrigger value="hero" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <User className="h-4 w-4" />
                  Hero
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <Info className="h-4 w-4" />
                  Về tôi
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <Award className="h-4 w-4" />
                  Kỹ năng
                </TabsTrigger>
                <TabsTrigger value="certificates" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <Award className="h-4 w-4" />
                  Chứng chỉ
                </TabsTrigger>
                <TabsTrigger value="education" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <GraduationCap className="h-4 w-4" />
                  Học vấn
                </TabsTrigger>
                <TabsTrigger value="experiences" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <Briefcase className="h-4 w-4" />
                  Kinh nghiệm
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <FolderKanban className="h-4 w-4" />
                  Dự án
                </TabsTrigger>
              </TabsList>
              <TabsContent value="hero"><AdminHero /></TabsContent>
              <TabsContent value="about"><AdminAbout /></TabsContent>
              <TabsContent value="skills"><AdminSkills /></TabsContent>
              <TabsContent value="certificates"><AdminCertificates /></TabsContent>
              <TabsContent value="education"><AdminEducation /></TabsContent>
              <TabsContent value="experiences"><AdminExperiences /></TabsContent>
              <TabsContent value="projects"><AdminProjects /></TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="blog" className="mt-0">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 md:p-6">
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="w-full flex flex-wrap justify-start gap-1 h-auto bg-transparent p-0 mb-6">
                <TabsTrigger value="posts" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <FileText className="h-4 w-4" />
                  Bài viết
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <Tag className="h-4 w-4" />
                  Danh mục
                </TabsTrigger>
                <TabsTrigger value="tags" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <Tag className="h-4 w-4" />
                  Tags
                </TabsTrigger>
              </TabsList>
              <TabsContent value="posts"><AdminBlog /></TabsContent>
              <TabsContent value="categories"><AdminBlogCategories /></TabsContent>
              <TabsContent value="tags"><AdminBlogTags /></TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="store" className="mt-0">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 md:p-6">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="w-full flex flex-wrap justify-start gap-1 h-auto bg-transparent p-0 mb-6">
                <TabsTrigger value="dashboard" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <BarChart3 className="h-4 w-4" />
                  Doanh thu
                </TabsTrigger>
                <TabsTrigger value="products" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <Package className="h-4 w-4" />
                  Sản phẩm
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <Tag className="h-4 w-4" />
                  Danh mục
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <ClipboardList className="h-4 w-4" />
                  Đơn hàng
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <Cog className="h-4 w-4" />
                  Cài đặt
                </TabsTrigger>
                <TabsTrigger value="vouchers" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <Ticket className="h-4 w-4" />
                  Voucher
                </TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard">
                <AdminStore />
              </TabsContent>
              <TabsContent value="settings">
                <AdminStoreSettings />
              </TabsContent>
              <TabsContent value="vouchers">
                <AdminVouchers />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="contact" className="mt-0">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 md:p-6">
            <Tabs defaultValue="social" className="w-full">
              <TabsList className="w-full flex flex-wrap justify-start gap-1 h-auto bg-transparent p-0 mb-6">
                <TabsTrigger value="social" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <Share2 className="h-4 w-4" />
                  Mạng xã hội
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <Mail className="h-4 w-4" />
                  Thông tin
                </TabsTrigger>
                <TabsTrigger value="footer" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <LinkIcon className="h-4 w-4" />
                  Footer
                </TabsTrigger>
              </TabsList>
              <TabsContent value="social"><AdminSocial /></TabsContent>
              <TabsContent value="contact"><AdminContact /></TabsContent>
              <TabsContent value="footer"><AdminFooter /></TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="system" className="mt-0">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 md:p-6">
            <Tabs defaultValue="theme" className="w-full">
              <TabsList className="w-full flex flex-wrap justify-start gap-1 h-auto bg-transparent p-0 mb-6">
                <TabsTrigger value="theme" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <Palette className="h-4 w-4" />
                  Theme
                </TabsTrigger>
                <TabsTrigger value="logo" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <Image className="h-4 w-4" />
                  Logo
                </TabsTrigger>
                <TabsTrigger value="navigation" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <Navigation className="h-4 w-4" />
                  Điều hướng
                </TabsTrigger>
                <TabsTrigger value="chatbot" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <MessageSquare className="h-4 w-4" />
                  Chatbot
                </TabsTrigger>
                <TabsTrigger value="submissions" className="flex items-center gap-2 px-4 py-2 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary">
                  <Mail className="h-4 w-4" />
                  Tin nhắn
                </TabsTrigger>
              </TabsList>
              <TabsContent value="theme"><AdminThemeSettings /></TabsContent>
              <TabsContent value="logo"><AdminLogoSettings /></TabsContent>
              <TabsContent value="navigation"><AdminNavigationSettings /></TabsContent>
              <TabsContent value="chatbot"><AdminChatbot /></TabsContent>
              <TabsContent value="submissions"><AdminSubmissions /></TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
