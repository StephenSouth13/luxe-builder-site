import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type HeroLayout = "centered" | "split-left" | "split-right" | "minimal" | "parallax";
export type ProjectsLayout = "grid" | "masonry" | "carousel" | "timeline" | "bento";
export type AboutLayout = "side-by-side" | "full-width" | "card-based" | "magazine";
export type BlogLayout = "grid" | "magazine" | "minimal-list" | "featured-grid";

export interface LayoutTemplates {
  hero: HeroLayout;
  projects: ProjectsLayout;
  about: AboutLayout;
  blog: BlogLayout;
}

const defaultLayouts: LayoutTemplates = {
  hero: "centered",
  projects: "grid",
  about: "side-by-side",
  blog: "grid",
};

export const layoutOptions = {
  hero: [
    { value: "centered", label: "Trung tâm", description: "Ảnh + text căn giữa, cổ điển", icon: "📐" },
    { value: "split-left", label: "Chia đôi (trái)", description: "Ảnh bên trái, text bên phải", icon: "◧" },
    { value: "split-right", label: "Chia đôi (phải)", description: "Text bên trái, ảnh bên phải", icon: "◨" },
    { value: "minimal", label: "Tối giản", description: "Chỉ text, không ảnh, siêu sạch", icon: "▬" },
    { value: "parallax", label: "Parallax", description: "Hiệu ứng cuộn đa lớp", icon: "🎞️" },
  ],
  projects: [
    { value: "grid", label: "Lưới đều", description: "Grid chuẩn, đều đặn", icon: "▦" },
    { value: "masonry", label: "Masonry", description: "Lưới xếp gạch đa kích cỡ", icon: "▥" },
    { value: "carousel", label: "Carousel", description: "Trượt ngang dạng slide", icon: "⟺" },
    { value: "timeline", label: "Timeline", description: "Dạng dòng thời gian", icon: "⏳" },
    { value: "bento", label: "Bento", description: "Grid dạng bento box", icon: "🍱" },
  ],
  about: [
    { value: "side-by-side", label: "Song song", description: "Ảnh + text cạnh nhau", icon: "◧" },
    { value: "full-width", label: "Toàn chiều rộng", description: "Text + ảnh full width", icon: "▬" },
    { value: "card-based", label: "Thẻ", description: "Bố cục dạng card nổi", icon: "▭" },
    { value: "magazine", label: "Tạp chí", description: "Style editorial, xen kẽ", icon: "📰" },
  ],
  blog: [
    { value: "grid", label: "Lưới", description: "Grid đều, 4 cột", icon: "▦" },
    { value: "magazine", label: "Tạp chí", description: "1 lớn + nhiều nhỏ", icon: "📰" },
    { value: "minimal-list", label: "Danh sách", description: "List tối giản, chữ là chính", icon: "☰" },
    { value: "featured-grid", label: "Featured + Grid", description: "1 bài nổi bật + lưới", icon: "⬛" },
  ],
};

export const useLayoutTemplate = () => {
  const queryClient = useQueryClient();

  const { data: layouts, isLoading } = useQuery({
    queryKey: ["layout-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "layout_templates")
        .single();
      if (error && error.code !== "PGRST116") return defaultLayouts;
      return data?.value ? { ...defaultLayouts, ...JSON.parse(data.value) } : defaultLayouts;
    },
  });

  const updateLayouts = async (newLayouts: LayoutTemplates) => {
    const value = JSON.stringify(newLayouts);
    const { data: existing } = await supabase.from("settings").select("id").eq("key", "layout_templates").single();
    if (existing) {
      await supabase.from("settings").update({ value }).eq("key", "layout_templates");
    } else {
      await supabase.from("settings").insert({ key: "layout_templates", value });
    }
    queryClient.invalidateQueries({ queryKey: ["layout-templates"] });
  };

  return { layouts: layouts || defaultLayouts, updateLayouts, isLoading };
};
