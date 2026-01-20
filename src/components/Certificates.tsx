import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Award, ExternalLink, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issue_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number | null;
}

const Certificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchCertificates = async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data) {
        setCertificates(data);
      }
    };

    fetchCertificates();
  }, []);

  // Don't render empty section
  if (certificates.length === 0) return null;

  return (
    <section ref={ref} className="py-12 sm:py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Chứng chỉ & Bằng cấp
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Các chứng chỉ chuyên môn và bằng cấp đã đạt được
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow group">
                {cert.image_url && (
                  <div className="relative h-36 sm:h-48 overflow-hidden">
                    <img
                      src={cert.image_url}
                      alt={cert.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardContent className={cert.image_url ? "p-4 sm:p-5" : "p-4 sm:p-5 pt-5 sm:pt-6"}>
                  <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                      <Award className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg leading-tight mb-1 line-clamp-2">
                        {cert.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{cert.issuer}</p>
                    </div>
                  </div>

                  {(cert.issue_date || cert.expiry_date) && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {cert.issue_date}
                        {cert.expiry_date && ` - ${cert.expiry_date}`}
                      </span>
                    </div>
                  )}

                  {cert.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {cert.description}
                    </p>
                  )}

                  {cert.credential_id && (
                    <p className="text-xs text-muted-foreground mb-3">
                      ID: {cert.credential_id}
                    </p>
                  )}

                  {cert.credential_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => window.open(cert.credential_url!, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Xem chứng chỉ
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;