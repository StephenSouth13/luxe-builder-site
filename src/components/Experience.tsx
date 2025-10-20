import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, MapPin, Award } from "lucide-react";

const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const experiences = [
    {
      year: "2020 - Hiện tại",
      title: "Senior Business Development Manager",
      company: "Tech Solutions Vietnam",
      location: "Hồ Chí Minh",
      description: "Phát triển và duy trì mối quan hệ với 50+ đối tác chiến lược, tăng doanh thu 150% trong 3 năm.",
      achievements: [
        "Mở rộng thị trường mới tại 5 tỉnh thành",
        "Xây dựng đội ngũ sales 20+ người",
        "Đạt giải thưởng Best Partner Award 2023"
      ]
    },
    {
      year: "2017 - 2020",
      title: "Sales Team Leader",
      company: "Digital Marketing Agency",
      location: "Hà Nội",
      description: "Quản lý đội ngũ 10 sales, phát triển kênh B2B cho các sản phẩm digital marketing.",
      achievements: [
        "Tăng trưởng doanh số 120% năm 2019",
        "Xây dựng quy trình sales chuẩn hóa",
        "Đào tạo 30+ sales professionals"
      ]
    },
    {
      year: "2015 - 2017",
      title: "Business Development Executive",
      company: "E-commerce Platform",
      location: "Hồ Chí Minh",
      description: "Phụ trách phát triển đối tác merchant và mở rộng danh mục sản phẩm.",
      achievements: [
        "Onboard 100+ merchants",
        "Thiết lập quan hệ với top brands",
        "Tăng GMV 80% trong 2 năm"
      ]
    }
  ];

  return (
    <section id="experience" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient text-center mb-12 lg:mb-16">
            Kinh nghiệm
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary via-gold to-primary/20" />

            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`relative grid md:grid-cols-2 gap-8 ${
                    index % 2 === 0 ? "md:text-right" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className={index % 2 === 0 ? "md:pr-12" : "md:col-start-2 md:pl-12"}>
                    <div className="bg-card border border-border rounded-xl p-6 sm:p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
                      <div className={`flex items-center gap-2 mb-3 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">{exp.year}</span>
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {exp.title}
                      </h3>
                      
                      <div className={`flex items-center gap-2 text-foreground/80 mb-4 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                        <span className="font-medium">{exp.company}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="text-sm">{exp.location}</span>
                        </div>
                      </div>
                      
                      <p className="text-foreground/70 mb-4">{exp.description}</p>
                      
                      <div className="space-y-2">
                        {exp.achievements.map((achievement, i) => (
                          <div key={i} className={`flex items-start gap-2 ${index % 2 === 0 ? "md:justify-end md:text-right" : ""}`}>
                            <Award className="h-4 w-4 text-primary mt-1 shrink-0" />
                            <span className="text-sm text-foreground/80">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="hidden md:block absolute left-1/2 top-8 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background glow-gold" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
