import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHero from "./AdminHero";
import AdminAbout from "./AdminAbout";
import AdminSkills from "./AdminSkills";
import AdminEducation from "./AdminEducation";
import AdminExperiences from "./AdminExperiences";
import AdminProjects from "./AdminProjects";
import AdminBlog from "./AdminBlog";
import AdminBlogCategories from "./AdminBlogCategories";
import AdminContact from "./AdminContact";
import AdminFooter from "./AdminFooter";
import AdminSocial from "./AdminSocial";
import AdminSubmissions from "./AdminSubmissions";
import AdminChatbot from "./AdminChatbot";
import AdminStore from "./AdminStore";

const AdminTabs = () => {
  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
        <TabsTrigger value="content">Nội dung</TabsTrigger>
        <TabsTrigger value="blog">Blog</TabsTrigger>
        <TabsTrigger value="store">Cửa hàng</TabsTrigger>
        <TabsTrigger value="contact">Liên hệ</TabsTrigger>
        <TabsTrigger value="system">Hệ thống</TabsTrigger>
      </TabsList>

      <TabsContent value="content">
        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="about">Về tôi</TabsTrigger>
            <TabsTrigger value="skills">Kỹ năng</TabsTrigger>
            <TabsTrigger value="education">Học vấn</TabsTrigger>
            <TabsTrigger value="experiences">Kinh nghiệm</TabsTrigger>
            <TabsTrigger value="projects">Dự án</TabsTrigger>
          </TabsList>
          <TabsContent value="hero"><AdminHero /></TabsContent>
          <TabsContent value="about"><AdminAbout /></TabsContent>
          <TabsContent value="skills"><AdminSkills /></TabsContent>
          <TabsContent value="education"><AdminEducation /></TabsContent>
          <TabsContent value="experiences"><AdminExperiences /></TabsContent>
          <TabsContent value="projects"><AdminProjects /></TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="blog">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="posts">Bài viết</TabsTrigger>
            <TabsTrigger value="categories">Danh mục</TabsTrigger>
          </TabsList>
          <TabsContent value="posts"><AdminBlog /></TabsContent>
          <TabsContent value="categories"><AdminBlogCategories /></TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="store">
        <AdminStore />
      </TabsContent>

      <TabsContent value="contact">
        <Tabs defaultValue="social" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="social">Mạng xã hội</TabsTrigger>
            <TabsTrigger value="contact">Thông tin</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
          </TabsList>
          <TabsContent value="social"><AdminSocial /></TabsContent>
          <TabsContent value="contact"><AdminContact /></TabsContent>
          <TabsContent value="footer"><AdminFooter /></TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="system">
        <Tabs defaultValue="chatbot" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
            <TabsTrigger value="submissions">Tin nhắn</TabsTrigger>
          </TabsList>
          <TabsContent value="chatbot"><AdminChatbot /></TabsContent>
          <TabsContent value="submissions"><AdminSubmissions /></TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
