import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import AdminScrollEffects from "./AdminScrollEffects";
import AdminLayoutTemplates from "./AdminLayoutTemplates";
import AdminVisualEffects from "./AdminVisualEffects";
import { 
  FileText, Newspaper, Store, Phone, Settings,
  User, Briefcase, GraduationCap, Award, FolderKanban,
  Palette, Image, Navigation, MessageSquare, Mail,
  Share2, Info, Link as LinkIcon, BarChart3, Package,
  Tag, ClipboardList, Cog, Ticket, Wand2, Layout, Sparkles
} from "lucide-react";

const SubTab = ({ value, icon: Icon, label }: { value: string; icon: any; label: string }) => (
  <TabsTrigger 
    value={value} 
    className="flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary transition-all duration-200 hover:bg-muted/50"
  >
    <Icon className="h-3.5 w-3.5" />
    <span className="hidden sm:inline">{label}</span>
  </TabsTrigger>
);

const AdminTabs = () => {
  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-4 h-auto p-1 bg-muted/30 rounded-xl">
        {[
          { value: "content", icon: FileText, label: "Nội dung" },
          { value: "blog", icon: Newspaper, label: "Blog" },
          { value: "store", icon: Store, label: "Cửa hàng" },
          { value: "contact", icon: Phone, label: "Liên hệ" },
          { value: "system", icon: Settings, label: "Hệ thống" },
        ].map(tab => (
          <TabsTrigger 
            key={tab.value} 
            value={tab.value} 
            className="flex items-center gap-1.5 py-2.5 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden md:inline">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Content */}
      <TabsContent value="content" className="mt-0">
        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-start gap-1 h-auto bg-transparent p-0 mb-4">
            <SubTab value="hero" icon={User} label="Hero" />
            <SubTab value="about" icon={Info} label="Về tôi" />
            <SubTab value="skills" icon={Award} label="Kỹ năng" />
            <SubTab value="certificates" icon={Award} label="Chứng chỉ" />
            <SubTab value="education" icon={GraduationCap} label="Học vấn" />
            <SubTab value="experiences" icon={Briefcase} label="Kinh nghiệm" />
            <SubTab value="projects" icon={FolderKanban} label="Dự án" />
          </TabsList>
          <TabsContent value="hero"><AdminHero /></TabsContent>
          <TabsContent value="about"><AdminAbout /></TabsContent>
          <TabsContent value="skills"><AdminSkills /></TabsContent>
          <TabsContent value="certificates"><AdminCertificates /></TabsContent>
          <TabsContent value="education"><AdminEducation /></TabsContent>
          <TabsContent value="experiences"><AdminExperiences /></TabsContent>
          <TabsContent value="projects"><AdminProjects /></TabsContent>
        </Tabs>
      </TabsContent>

      {/* Blog */}
      <TabsContent value="blog" className="mt-0">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-start gap-1 h-auto bg-transparent p-0 mb-4">
            <SubTab value="posts" icon={FileText} label="Bài viết" />
            <SubTab value="categories" icon={Tag} label="Danh mục" />
            <SubTab value="tags" icon={Tag} label="Tags" />
          </TabsList>
          <TabsContent value="posts"><AdminBlog /></TabsContent>
          <TabsContent value="categories"><AdminBlogCategories /></TabsContent>
          <TabsContent value="tags"><AdminBlogTags /></TabsContent>
        </Tabs>
      </TabsContent>

      {/* Store */}
      <TabsContent value="store" className="mt-0">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-start gap-1 h-auto bg-transparent p-0 mb-4">
            <SubTab value="dashboard" icon={BarChart3} label="Doanh thu" />
            <SubTab value="products" icon={Package} label="Sản phẩm" />
            <SubTab value="categories" icon={Tag} label="Danh mục" />
            <SubTab value="orders" icon={ClipboardList} label="Đơn hàng" />
            <SubTab value="settings" icon={Cog} label="Cài đặt" />
            <SubTab value="vouchers" icon={Ticket} label="Voucher" />
          </TabsList>
          <TabsContent value="dashboard"><AdminStore /></TabsContent>
          <TabsContent value="settings"><AdminStoreSettings /></TabsContent>
          <TabsContent value="vouchers"><AdminVouchers /></TabsContent>
        </Tabs>
      </TabsContent>

      {/* Contact */}
      <TabsContent value="contact" className="mt-0">
        <Tabs defaultValue="social" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-start gap-1 h-auto bg-transparent p-0 mb-4">
            <SubTab value="social" icon={Share2} label="Mạng xã hội" />
            <SubTab value="contact" icon={Mail} label="Thông tin" />
            <SubTab value="footer" icon={LinkIcon} label="Footer" />
          </TabsList>
          <TabsContent value="social"><AdminSocial /></TabsContent>
          <TabsContent value="contact"><AdminContact /></TabsContent>
          <TabsContent value="footer"><AdminFooter /></TabsContent>
        </Tabs>
      </TabsContent>

      {/* System */}
      <TabsContent value="system" className="mt-0">
        <Tabs defaultValue="theme" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-start gap-1 h-auto bg-transparent p-0 mb-4">
            <SubTab value="theme" icon={Palette} label="Theme" />
            <SubTab value="layouts" icon={Layout} label="Bố cục" />
            <SubTab value="effects" icon={Sparkles} label="Hiệu ứng" />
            <SubTab value="scroll" icon={Wand2} label="Cuộn trang" />
            <SubTab value="logo" icon={Image} label="Logo" />
            <SubTab value="navigation" icon={Navigation} label="Điều hướng" />
            <SubTab value="chatbot" icon={MessageSquare} label="Chatbot" />
            <SubTab value="submissions" icon={Mail} label="Tin nhắn" />
          </TabsList>
          <TabsContent value="theme"><AdminThemeSettings /></TabsContent>
          <TabsContent value="layouts"><AdminLayoutTemplates /></TabsContent>
          <TabsContent value="effects"><AdminVisualEffects /></TabsContent>
          <TabsContent value="scroll"><AdminScrollEffects /></TabsContent>
          <TabsContent value="logo"><AdminLogoSettings /></TabsContent>
          <TabsContent value="navigation"><AdminNavigationSettings /></TabsContent>
          <TabsContent value="chatbot"><AdminChatbot /></TabsContent>
          <TabsContent value="submissions"><AdminSubmissions /></TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
