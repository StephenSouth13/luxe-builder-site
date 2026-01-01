import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Package, 
  Search, 
  SlidersHorizontal, 
  BookOpen, 
  ShoppingBag,
  Users,
  Clock,
  Star,
  Sparkles,
  GraduationCap
} from "lucide-react";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const Store = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [productType, setProductType] = useState<string>("all");

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

  const { data: allProducts = [], isLoading } = useQuery({
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

  // Extract unique brands from products
  const availableBrands = useMemo(() => {
    const brands = allProducts
      .map(p => p.brand)
      .filter((brand): brand is string => !!brand);
    return Array.from(new Set(brands)).sort();
  }, [allProducts]);

  // Filter and sort products
  const products = useMemo(() => {
    let filtered = [...allProducts];

    // Product type filter
    if (productType !== 'all') {
      filtered = filtered.filter(p => (p as any).product_type === productType);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query)
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => p.brand && selectedBrands.includes(p.brand));
    }

    // Price range filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(p => {
        const price = p.price * (1 - (p.discount_percent || 0) / 100);
        switch (priceRange) {
          case 'under-100k': return price < 100000;
          case '100k-500k': return price >= 100000 && price < 500000;
          case '500k-1m': return price >= 500000 && price < 1000000;
          case 'over-1m': return price >= 1000000;
          default: return true;
        }
      });
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => {
          const priceA = a.price * (1 - (a.discount_percent || 0) / 100);
          const priceB = b.price * (1 - (b.discount_percent || 0) / 100);
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        filtered.sort((a, b) => {
          const priceA = a.price * (1 - (a.discount_percent || 0) / 100);
          const priceB = b.price * (1 - (b.discount_percent || 0) / 100);
          return priceB - priceA;
        });
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
        break;
      default:
        break;
    }

    return filtered;
  }, [allProducts, searchQuery, selectedBrands, priceRange, sortBy, productType]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBrands([]);
    setPriceRange("all");
    setSortBy("default");
    setSelectedCategory("all");
  };

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, color, size }: { productId: string; color?: string; size?: string }) => {
      if (!user) {
        navigate('/admin');
        throw new Error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      }

      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('selected_color', color || '')
        .eq('selected_size', size || '')
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
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-8 w-48 bg-muted rounded"></div>
            <div className="h-4 w-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const productCount = allProducts.filter(p => (p as any).product_type === 'product' || !(p as any).product_type).length;
  const courseCount = allProducts.filter(p => (p as any).product_type === 'course').length;

  return (
    <>
      <Header />
      <div className="min-h-screen pt-20 px-4 pb-20">
        <SEOHead
          title="Cửa hàng - Sản phẩm & Khóa học"
          description="Khám phá các sản phẩm chất lượng và khóa học giúp bạn phát triển kỹ năng"
        />
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Khám phá ngay</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              {productType === 'course' ? 'Khóa học' : productType === 'product' ? 'Sản phẩm' : 'Cửa hàng'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {productType === 'course' 
                ? 'Nâng cao kỹ năng với các khóa học chất lượng từ chuyên gia' 
                : productType === 'product'
                ? 'Sản phẩm chất lượng cao được chọn lọc kỹ càng'
                : 'Khám phá sản phẩm và khóa học chất lượng'}
            </p>
          </motion.div>

          {/* Product Type Tabs */}
          <Tabs value={productType} onValueChange={setProductType} className="mb-8">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 p-1 bg-card">
              <TabsTrigger 
                value="all" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Tất cả</span>
                <Badge variant="secondary" className="ml-1 text-xs">{allProducts.length}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="product" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Sản phẩm</span>
                <Badge variant="secondary" className="ml-1 text-xs">{productCount}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="course" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">Khóa học</span>
                <Badge variant="secondary" className="ml-1 text-xs">{courseCount}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search and Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col lg:flex-row gap-4 mb-6"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={productType === 'course' ? "Tìm khóa học..." : "Tìm sản phẩm..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-[200px] bg-card">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full lg:w-[200px] bg-card">
                <SelectValue placeholder="Khoảng giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả giá</SelectItem>
                <SelectItem value="under-100k">Dưới 100k</SelectItem>
                <SelectItem value="100k-500k">100k - 500k</SelectItem>
                <SelectItem value="500k-1m">500k - 1tr</SelectItem>
                <SelectItem value="over-1m">Trên 1tr</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-[200px] bg-card">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Mặc định</SelectItem>
                <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
                <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
                <SelectItem value="name-asc">Tên: A-Z</SelectItem>
                <SelectItem value="name-desc">Tên: Z-A</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full lg:w-auto">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Lọc thêm
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Bộ lọc nâng cao</SheetTitle>
                  <SheetDescription>
                    Lọc sản phẩm theo thương hiệu
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">
                      {productType === 'course' ? 'Giảng viên' : 'Thương hiệu'}
                    </h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {availableBrands.length > 0 ? (
                        availableBrands.map((brand) => (
                          <div key={brand} className="flex items-center space-x-2">
                            <Checkbox
                              id={`brand-${brand}`}
                              checked={selectedBrands.includes(brand)}
                              onCheckedChange={() => toggleBrand(brand)}
                            />
                            <Label
                              htmlFor={`brand-${brand}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {brand}
                            </Label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {productType === 'course' ? 'Không có giảng viên' : 'Không có thương hiệu'}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={clearFilters}
                  >
                    Xóa tất cả bộ lọc
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </motion.div>

          {/* Active Filters Display */}
          {(searchQuery || selectedBrands.length > 0 || priceRange !== 'all' || sortBy !== 'default' || selectedCategory !== 'all') && (
            <div className="flex flex-wrap gap-2 mb-4">
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Tìm: "{searchQuery}"
                </Badge>
              )}
              {selectedBrands.map(brand => (
                <Badge key={brand} variant="secondary" className="gap-1">
                  {brand}
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 text-xs"
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-6">
            Hiển thị {products.length} / {allProducts.length} {productType === 'course' ? 'khóa học' : 'sản phẩm'}
          </p>

          {products.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              {productType === 'course' ? (
                <GraduationCap className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              ) : (
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              )}
              <h2 className="text-2xl font-bold mb-2">
                {productType === 'course' ? 'Chưa có khóa học' : 'Chưa có sản phẩm'}
              </h2>
              <p className="text-muted-foreground">
                {productType === 'course' ? 'Các khóa học sẽ được cập nhật sớm' : 'Các sản phẩm sẽ được cập nhật sớm'}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => {
                const discountedPrice = product.price * (1 - (product.discount_percent || 0) / 100);
                const isCourse = (product as any).product_type === 'course';
                
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden group cursor-pointer hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col border-border/50 hover:border-primary/30">
                      <div 
                        onClick={() => navigate(`/products/${product.slug || product.id}`)}
                        className="relative overflow-hidden"
                      >
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-56 bg-muted flex items-center justify-center">
                            {isCourse ? (
                              <GraduationCap className="h-16 w-16 text-muted-foreground" />
                            ) : (
                              <Package className="h-16 w-16 text-muted-foreground" />
                            )}
                          </div>
                        )}
                        
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Type Badge */}
                        <Badge 
                          className={`absolute top-3 left-3 ${isCourse ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                        >
                          {isCourse ? (
                            <><GraduationCap className="h-3 w-3 mr-1" /> Khóa học</>
                          ) : (
                            <><ShoppingBag className="h-3 w-3 mr-1" /> Sản phẩm</>
                          )}
                        </Badge>
                        
                        {product.discount_percent && product.discount_percent > 0 && (
                          <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
                            -{product.discount_percent}%
                          </Badge>
                        )}
                        
                        {product.featured && (
                          <Badge className="absolute bottom-3 left-3 bg-primary/90 text-primary-foreground">
                            <Star className="h-3 w-3 mr-1 fill-current" /> Nổi bật
                          </Badge>
                        )}
                        
                        {product.stock_quantity === 0 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                            <Badge variant="secondary" className="text-lg py-2 px-4">
                              {isCourse ? 'Đã đóng' : 'Hết hàng'}
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          
                          {product.brand && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                              {isCourse ? <Users className="h-3 w-3" /> : null}
                              <span>{isCourse ? `Giảng viên: ${product.brand}` : product.brand}</span>
                            </div>
                          )}
                          
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {product.description}
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              {product.discount_percent && product.discount_percent > 0 && (
                                <p className="text-sm text-muted-foreground line-through">
                                  {product.price.toLocaleString()}đ
                                </p>
                              )}
                              <p className="text-xl font-bold text-primary">
                                {discountedPrice.toLocaleString()}đ
                              </p>
                            </div>
                            <Badge variant="outline" className="flex items-center gap-1">
                              {isCourse ? (
                                <><Users className="h-3 w-3" /> {product.stock_quantity} chỗ</>
                              ) : (
                                <>Còn {product.stock_quantity}</>
                              )}
                            </Badge>
                          </div>
                          
                          <Button
                            className="w-full group/btn"
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
                            {isCourse ? (
                              <><BookOpen className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" /> Đăng ký ngay</>
                            ) : (
                              <><ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" /> Thêm vào giỏ</>
                            )}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Store;
