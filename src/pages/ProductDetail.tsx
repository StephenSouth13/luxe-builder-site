import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Clock, 
  Star,
  CheckCircle,
  GraduationCap,
  Package
} from "lucide-react";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_categories(name)')
        .eq('slug', slug)
        .eq('published', true)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        navigate('/admin');
        throw new Error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      }

      if (!product) throw new Error("Product not found");

      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .eq('selected_color', selectedColor || '')
        .eq('selected_size', selectedSize || '')
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + 1 })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity: 1,
            selected_color: selectedColor,
            selected_size: selectedSize
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(isCourse ? "Đã đăng ký khóa học" : "Đã thêm vào giỏ hàng");
      queryClient.invalidateQueries({ queryKey: ['cart-items'] });
      queryClient.invalidateQueries({ queryKey: ['cart-count'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể thực hiện thao tác");
    }
  });

  const isCourse = (product as any)?.product_type === 'course';

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-20 px-4">
          <div className="max-w-7xl mx-auto py-20">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-video bg-muted animate-pulse rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted animate-pulse rounded w-3/4"></div>
                <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
                <div className="h-12 bg-muted animate-pulse rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-20 px-4">
          <div className="max-w-7xl mx-auto py-20 text-center">
            <Package className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
            <p className="text-muted-foreground mb-6">Sản phẩm này có thể đã bị xóa hoặc không tồn tại</p>
            <Button onClick={() => navigate('/store')}>Quay lại cửa hàng</Button>
          </div>
        </div>
      </>
    );
  }

  const discountedPrice = product.price * (1 - (product.discount_percent || 0) / 100);
  const displayImage = selectedImage || product.image_url;

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 px-4 pb-20">
        <SEOHead 
          title={`${product.name} - ${isCourse ? 'Khóa học' : 'Cửa hàng'}`}
          description={product.description || ""}
        />
        <div className="max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6 hover:bg-primary/10"
            onClick={() => navigate('/store')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại cửa hàng
          </Button>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {displayImage ? (
                <Card className="overflow-hidden mb-4 border-border/50">
                  <div className="relative">
                    <img 
                      src={displayImage} 
                      alt={product.name}
                      className="w-full h-[400px] lg:h-[500px] object-cover"
                    />
                    {isCourse && (
                      <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                        <GraduationCap className="h-4 w-4 mr-1" /> Khóa học
                      </Badge>
                    )}
                  </div>
                </Card>
              ) : (
                <Card className="overflow-hidden mb-4 border-border/50">
                  <div className="w-full h-[400px] lg:h-[500px] bg-muted flex items-center justify-center">
                    {isCourse ? (
                      <GraduationCap className="h-24 w-24 text-muted-foreground" />
                    ) : (
                      <Package className="h-24 w-24 text-muted-foreground" />
                    )}
                  </div>
                </Card>
              )}
              
              {product.images && product.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {[product.image_url, ...product.images].filter(Boolean).map((img: string, idx: number) => (
                    <Card 
                      key={idx}
                      className={`overflow-hidden cursor-pointer transition-all ${
                        (selectedImage === img || (!selectedImage && idx === 0)) 
                          ? 'ring-2 ring-primary' 
                          : 'hover:ring-2 hover:ring-primary/50'
                      }`}
                      onClick={() => setSelectedImage(img)}
                    >
                      <img 
                        src={img} 
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={isCourse ? "default" : "secondary"}>
                    {isCourse ? (
                      <><GraduationCap className="h-3 w-3 mr-1" /> Khóa học</>
                    ) : (
                      <><Package className="h-3 w-3 mr-1" /> Sản phẩm</>
                    )}
                  </Badge>
                  {product.featured && (
                    <Badge variant="outline" className="text-primary border-primary">
                      <Star className="h-3 w-3 mr-1 fill-current" /> Nổi bật
                    </Badge>
                  )}
                </div>
                
                {product.brand && (
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    {isCourse && <Users className="h-4 w-4" />}
                    <span>{isCourse ? `Giảng viên: ${product.brand}` : product.brand}</span>
                  </div>
                )}
                
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>
                
                {/* Price Section */}
                <div className="flex items-center gap-4 mb-4">
                  {product.discount_percent > 0 && (
                    <>
                      <p className="text-2xl text-muted-foreground line-through">
                        {product.price.toLocaleString()}đ
                      </p>
                      <Badge className="bg-destructive text-destructive-foreground">
                        -{product.discount_percent}%
                      </Badge>
                    </>
                  )}
                </div>
                
                <p className="text-4xl font-bold text-primary mb-6">
                  {discountedPrice.toLocaleString()}đ
                </p>

                {/* Stock/Slots Info */}
                <div className="flex items-center gap-3 mb-6">
                  <Badge 
                    variant={product.stock_quantity > 0 ? "default" : "secondary"}
                    className="py-1.5 px-3"
                  >
                    {isCourse ? (
                      <><Users className="h-4 w-4 mr-1" /> {product.stock_quantity > 0 ? `Còn ${product.stock_quantity} chỗ` : 'Đã đóng đăng ký'}</>
                    ) : (
                      product.stock_quantity > 0 ? `Còn ${product.stock_quantity} sản phẩm` : "Hết hàng"
                    )}
                  </Badge>
                </div>
              </div>

              {/* Course Features */}
              {isCourse && (
                <Card className="p-5 bg-primary/5 border-primary/20">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Bạn sẽ nhận được
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-3 w-3 text-primary" />
                      </div>
                      Truy cập đầy đủ nội dung khóa học
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-3 w-3 text-primary" />
                      </div>
                      Hỗ trợ trực tiếp từ giảng viên
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="h-3 w-3 text-primary" />
                      </div>
                      Học mọi lúc, mọi nơi
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="h-3 w-3 text-primary" />
                      </div>
                      Chứng chỉ hoàn thành
                    </li>
                  </ul>
                </Card>
              )}

              {/* Product Options */}
              {!isCourse && (product.colors?.length > 0 || product.sizes?.length > 0) && (
                <Card className="p-5 border-border/50">
                  <h3 className="font-semibold mb-4">Tùy chọn sản phẩm</h3>
                  
                  {product.colors && product.colors.length > 0 && (
                    <div className="mb-4">
                      <Label className="mb-2 block text-sm text-muted-foreground">Màu sắc</Label>
                      <Select value={selectedColor} onValueChange={setSelectedColor}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Chọn màu sắc" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.colors.map((color: string) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <Label className="mb-2 block text-sm text-muted-foreground">Kích cỡ</Label>
                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Chọn kích cỡ" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.sizes.map((size: string) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </Card>
              )}

              {/* Action Button */}
              <Button
                className="w-full py-6 text-lg"
                size="lg"
                onClick={() => addToCartMutation.mutate()}
                disabled={product.stock_quantity === 0 || addToCartMutation.isPending}
              >
                {isCourse ? (
                  <><GraduationCap className="h-5 w-5 mr-2" /> Đăng ký khóa học ngay</>
                ) : (
                  <><ShoppingCart className="h-5 w-5 mr-2" /> Thêm vào giỏ hàng</>
                )}
              </Button>

              {/* Descriptions */}
              {product.description && (
                <Card className="p-5 border-border/50">
                  <h3 className="font-semibold mb-3">{isCourse ? 'Giới thiệu khóa học' : 'Mô tả ngắn'}</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </Card>
              )}

              {product.full_description && (
                <Card className="p-5 border-border/50">
                  <h3 className="font-semibold mb-3">{isCourse ? 'Nội dung chi tiết' : 'Mô tả chi tiết'}</h3>
                  <div 
                    className="prose-content text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.full_description) }}
                  />
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
