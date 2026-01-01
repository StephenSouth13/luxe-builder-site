import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import BlogsSection from "@/components/BlogsSection";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import BackToTop from "@/components/BackToTop";
import SEOHead from "@/components/SEOHead";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import Certificates from "@/components/Certificates";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: sectionVisibility } = useQuery({
    queryKey: ['section-visibility'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'section_visibility')
        .single();
      
      if (error && error.code !== 'PGRST116') return null;
      return data?.value ? JSON.parse(data.value) : null;
    }
  });

  const isVisible = (key: string) => !sectionVisibility || sectionVisibility[key] !== false;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead />
      <Header />
      <main>
        {isVisible('hero') && <Hero />}
        {isVisible('about') && <About />}
        {isVisible('experience') && <Experience />}
        {isVisible('education') && <Education />}
        {isVisible('projects') && <Projects />}
        {isVisible('certificates') && <Certificates />}
        {isVisible('blogs') && <BlogsSection />}
        {isVisible('contact') && <Contact />}
      </main>
      <Footer />
      <FloatingChat />
      <BackToTop />
    </div>
  );
};

export default Index;
