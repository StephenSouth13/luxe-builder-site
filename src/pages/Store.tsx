import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package } from "lucide-react";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Store = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data;
    }
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*, product_categories(name)')
        .eq('published', true)
        .order('sort_order');

      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, color, size }: { productId: string; color?: string; size?: string }) => {
      if (!user) {
        navigate('/admin');
        throw new Error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      }

      // Check if item already exists in cart
      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('selected_color', color || '')
        .eq('selected_size', size || '')
        .maybeSingle();

      if (existing) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + 1 })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity: 1,
            selected_color: color,
            selected_size: size
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Đã thêm vào giỏ hàng");
      queryClient.invalidateQueries({ queryKey: ['cart-items'] });
      queryClient.invalidateQueries({ queryKey: ['cart-count'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Không thể thêm vào giỏ hàng");
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto py-20 text-center">
          <p>Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-20">
      <SEOHead 
        title="Cửa hàng - Sản phẩm chất lượng"
        description="Khám phá các sản phẩm chất lượng cao với giá tốt nhất"
      />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Cửa hàng</h1>
            <p className="text-muted-foreground">Khám phá sản phẩm chất lượng</p>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả sản phẩm</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {products.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Chưa có sản phẩm</h2>
            <p className="text-muted-foreground">Các sản phẩm sẽ được cập nhật sớm</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const discountedPrice = product.price * (1 - (product.discount_percent || 0) / 100);
              
              return (
                <Card key={product.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                  <div 
                    onClick={() => navigate(`/products/${product.slug || product.id}`)}
                    className="relative"
                  >
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                    {product.discount_percent > 0 && (
                      <Badge className="absolute top-2 right-2 bg-red-500">
                        -{product.discount_percent}%
                      </Badge>
                    )}
                    {product.stock_quantity === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="secondary">Hết hàng</Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                    {product.brand && (
                      <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        {product.discount_percent > 0 && (
                          <p className="text-sm text-muted-foreground line-through">
                            {product.price.toLocaleString()}đ
                          </p>
                        )}
                        <p className="text-xl font-bold text-primary">
                          {discountedPrice.toLocaleString()}đ
                        </p>
                      </div>
                      <Badge variant="outline">
                        Còn {product.stock_quantity}
                      </Badge>
                    </div>
                    
                    <Button
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCartMutation.mutate({ 
                          productId: product.id,
                          color: product.colors?.[0],
                          size: product.sizes?.[0]
                        });
                      }}
                      disabled={product.stock_quantity === 0 || addToCartMutation.isPending}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Thêm vào giỏ
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
