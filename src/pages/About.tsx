import Header from "@/components/Header";
import AboutSection from "@/components/About";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import BackToTop from "@/components/BackToTop";
import SEOHead from "@/components/SEOHead";

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead 
        title="About - Trịnh Bá Lâm | Sales & Business Development Expert"
        description="Learn about Trịnh Bá Lâm's professional journey, expertise in sales management, business development, and 8+ years of experience driving market expansion and strategic partnerships."
      />
      <Header />
      <main className="pt-20">
        <AboutSection />
        <Education />
        <Experience />
      </main>
      <Footer />
      <FloatingChat />
      <BackToTop />
    </div>
  );
};

export default About;
