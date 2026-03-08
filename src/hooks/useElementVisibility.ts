import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useElementVisibility = () => {
  const { data: elementVisibility } = useQuery({
    queryKey: ["element-visibility"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "element_visibility")
        .single();
      if (error && error.code !== "PGRST116") return null;
      return data?.value ? JSON.parse(data.value) : null;
    },
  });

  const isElementVisible = (key: string) => !elementVisibility || elementVisibility[key] !== false;

  return { isElementVisible, elementVisibility };
};
