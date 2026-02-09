import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const defaultLabels: Record<string, string> = {
  hero: "Hero Banner",
  about: "Giới thiệu",
  experience: "Kinh nghiệm",
  education: "Học vấn",
  projects: "Dự án",
  certificates: "Chứng chỉ",
  blogs: "Blog",
  contact: "Liên hệ",
};

export const useSectionLabels = () => {
  const { data: sectionLabels, isLoading } = useQuery({
    queryKey: ["section-labels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "section_labels")
        .maybeSingle();

      if (error && error.code !== "PGRST116") return null;
      return data?.value ? JSON.parse(data.value) : null;
    },
  });

  const getLabel = (key: string): string => {
    return sectionLabels?.[key] || defaultLabels[key] || key;
  };

  return { sectionLabels, getLabel, isLoading };
};
