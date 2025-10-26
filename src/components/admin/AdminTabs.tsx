import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminAbout from "./AdminAbout";
import AdminSkills from "./AdminSkills";
import AdminExperiences from "./AdminExperiences";
import AdminProjects from "./AdminProjects";
import AdminContact from "./AdminContact";
import AdminFooter from "./AdminFooter";
import AdminSocial from "./AdminSocial";
import AdminSubmissions from "./AdminSubmissions";

interface TabConfig {
  value: string;
  label: string;
  component: React.ComponentType;
}

const tabConfigs: TabConfig[] = [
  { value: "about", label: "Về tôi", component: AdminAbout },
  { value: "skills", label: "Kỹ năng", component: AdminSkills },
  { value: "experiences", label: "Kinh nghiệm", component: AdminExperiences },
  { value: "projects", label: "Dự án", component: AdminProjects },
  { value: "contact", label: "Liên hệ", component: AdminContact },
  { value: "footer", label: "Footer", component: AdminFooter },
  { value: "social", label: "Social", component: AdminSocial },
  { value: "submissions", label: "Tin nhắn", component: AdminSubmissions },
];

const AdminTabs = () => {
  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 mb-8 gap-2">
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
