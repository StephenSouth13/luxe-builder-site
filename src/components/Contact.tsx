import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import { ContactSkeleton } from "@/components/skeletons/SectionSkeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSectionLabels } from "@/hooks/useSectionLabels";

interface ContactRow {
  id: string;
  email: string;
  phone: string | null;
  location: string | null;
  map_embed_url: string | null;
}

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [contact, setContact] = useState<ContactRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getLabel } = useSectionLabels();

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase.from("contacts").select("*").limit(1).maybeSingle();
        if (data && !error) setContact(data as ContactRow);
      } catch (e) {
        console.error("Failed to load contact info", e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.from("contact_submissions").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message,
      });
      toast({
        title: "Tin nhắn đã được gửi!",
        description: "Cảm ơn bạn đã liên hệ. Tôi sẽ phản hồi sớm nhất có thể.",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      console.error("Failed to save submission", err);
      toast({ title: "Lỗi", description: "Không thể gửi tin nhắn, thử lại sau", variant: "destructive" });
    }
  };

  if (isLoading) return <ContactSkeleton />;

  const contactInfo = contact ? [
    { icon: Mail, label: "Email", value: contact.email || "", href: contact.email ? `mailto:${contact.email}` : null },
    { icon: Phone, label: "Phone", value: contact.phone || "", href: contact.phone ? `tel:${contact.phone}` : null },
    { icon: MapPin, label: "Location", value: contact.location || "", href: null }
  ].filter((i) => i.value) : [];

  return (
    <section id="contact" className="py-20 lg:py-32 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            {getLabel("contact")}
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 lg:mb-16">
            Hãy kết nối và cùng nhau tạo nên những giá trị bền vững
          </p>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold mb-6">Thông tin liên hệ</h3>
                <p className="text-foreground/70 mb-8">
                  Tôi luôn sẵn sàng lắng nghe và thảo luận về các cơ hội hợp tác mới. 
                  Đừng ngần ngại liên hệ với tôi qua các kênh dưới đây.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="font-medium hover:text-primary transition-colors">
                          {info.value}
                        </a>
                      ) : (
                        <p className="font-medium">{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {(() => {
                const raw = contact?.map_embed_url?.trim();
                const extractSrc = (input: string | null | undefined) => {
                  if (!input) return null;
                  if (input.startsWith("<")) {
                    const match = input.match(/src=["']([^"']+)["']/i);
                    return match ? match[1] : null;
                  }
                  const maybe = input.replace(/^\((.*)\)$/s, "$1");
                  return maybe || null;
                };
                const mapSrc = extractSrc(raw);
                return mapSrc ? (
                  <div className="rounded-lg overflow-hidden border border-border">
                    <iframe
                      src={mapSrc}
                      title="Google Map"
                      width="100%"
                      height="260"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                ) : null;
              })()}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Họ và tên</label>
                  <Input id="name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nguyễn Văn A" className="bg-card border-border focus:border-primary" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@example.com" className="bg-card border-border focus:border-primary" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">Số điện thoại</label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+84 123 456 789" className="bg-card border-border focus:border-primary" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Tin nhắn</label>
                  <Textarea id="message" required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Nội dung tin nhắn..." rows={6} className="bg-card border-border focus:border-primary resize-none" />
                </div>
                <Button type="submit" className="w-full gold-gradient hover:opacity-90 transition-opacity text-background font-semibold" size="lg">
                  <Send className="mr-2 h-5 w-5" />
                  Gửi tin nhắn
                </Button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
