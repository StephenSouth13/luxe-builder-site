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

interface TabConfig {
  value: string;
  label: string;
  component: React.ComponentType;
}

const tabConfigs: TabConfig[] = [
  { value: "hero", label: "Hero", component: AdminHero },
  { value: "about", label: "Về tôi", component: AdminAbout },
  { value: "skills", label: "Kỹ năng", component: AdminSkills },
  { value: "education", label: "Học vấn", component: AdminEducation },
  { value: "experiences", label: "Kinh nghiệm", component: AdminExperiences },
  { value: "projects", label: "Dự án", component: AdminProjects },
  { value: "blog", label: "Blog", component: AdminBlog },
  { value: "blog-categories", label: "Danh mục", component: AdminBlogCategories },
  { value: "social", label: "Mạng xã hội", component: AdminSocial },
  { value: "contact", label: "Liên hệ", component: AdminContact },
  { value: "footer", label: "Footer", component: AdminFooter },
  { value: "chatbot", label: "Chatbot", component: AdminChatbot },
  { value: "submissions", label: "Tin nhắn", component: AdminSubmissions },
];

const AdminTabs = () => {
  return (
    <Tabs defaultValue="hero" className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:grid-cols-12 mb-8 gap-2">
        {tabConfigs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabConfigs.map((tab) => {
        const Component = tab.component;
        return (
          <TabsContent key={tab.value} value={tab.value}>
            <Component />
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default AdminTabs;
