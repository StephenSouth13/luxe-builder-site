import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

const AdminStoreDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['store-stats'],
    queryFn: async () => {
      const [ordersRes, productsRes, revenueRes] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount, status').eq('status', 'approved')
      ]);

      const totalRevenue = revenueRes.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      return {
        totalOrders: ordersRes.count || 0,
        totalProducts: productsRes.count || 0,
        totalRevenue
      };
    }
  });

  const { data: topProducts = [] } = useQuery({
    queryKey: ['top-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          product_id,
          product_name,
          quantity
        `);

      if (error) throw error;

      const productSales = data.reduce((acc: any, item) => {
        if (!acc[item.product_id]) {
          acc[item.product_id] = {
            name: item.product_name,
            total: 0
          };
        }
        acc[item.product_id].total += item.quantity;
        return acc;
      }, {});

      return Object.values(productSales)
        .sort((a: any, b: any) => b.total - a.total)
        .slice(0, 5);
    }
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
              <p className="text-2xl font-bold">{stats?.totalRevenue.toLocaleString()}đ</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <ShoppingCart className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
              <p className="text-2xl font-bold">{stats?.totalOrders}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-full">
              <Package className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng sản phẩm</p>
              <p className="text-2xl font-bold">{stats?.totalProducts}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-bold">Sản phẩm bán chạy nhất</h2>
        </div>
        <div className="space-y-3">
          {topProducts.map((product: any, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">{product.name}</span>
              <span className="text-sm text-muted-foreground">Đã bán: {product.total}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminStoreDashboard;
