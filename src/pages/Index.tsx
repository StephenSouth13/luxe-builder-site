import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import BackToTop from "@/components/BackToTop";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead />
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
      </main>
      <Footer />
      <FloatingChat />
      <BackToTop />
    </div>
  );
};

export default Index;
