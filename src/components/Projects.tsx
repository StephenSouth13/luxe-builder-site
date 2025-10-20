import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const projects = [
    {
      title: "Partnership Expansion Program",
      category: "B2B Strategy",
      description: "Thiết lập mạng lưới 50+ đối tác phân phối toàn quốc, tăng coverage 200%",
      metrics: "+200% Coverage • +150% Revenue • 50+ Partners",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80"
    },
    {
      title: "Sales Team Transformation",
      category: "Leadership",
      description: "Xây dựng và đào tạo đội ngũ sales từ 5 lên 20 người, chuẩn hóa quy trình bán hàng",
      metrics: "20 Members • 120% Growth • 30+ Trained",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
    },
    {
      title: "Market Entry Strategy",
      category: "Business Development",
      description: "Triển khai chiến lược xâm nhập 5 thị trường mới, đạt break-even trong 6 tháng",
      metrics: "5 Markets • 6 Months ROI • 80% Target",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
    },
    {
      title: "Digital Sales Platform",
      category: "Innovation",
      description: "Triển khai CRM và automation tools, tăng hiệu suất sales team 40%",
      metrics: "+40% Efficiency • 100% Adoption • ROI 3 Months",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
    }
  ];

  return (
    <section id="projects" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient text-center mb-4">
            Dự án nổi bật
          </h2>
          <p className="text-center text-muted-foreground mb-12 lg:mb-16">
            Những thành tựu và dự án tiêu biểu trong sự nghiệp
          </p>

          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
              >
                {/* Image */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full text-xs font-semibold text-background">
                    {project.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    <TrendingUp className="h-4 w-4" />
                    <span>{project.metrics}</span>
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full justify-between group/btn hover:bg-primary/10 hover:text-primary"
                  >
                    <span>Xem chi tiết</span>
                    <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
