import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const AdminOrders = () => {
  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              name,
              image_url
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      // Update order status
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (orderError) throw orderError;

      // If approved, update product stock
      if (status === 'approved') {
        const order = orders.find((o: any) => o.id === id);
        if (order) {
          for (const item of order.order_items) {
            const { data: product } = await supabase
              .from('products')
              .select('stock_quantity')
              .eq('id', item.product_id)
              .single();

            if (product) {
              await supabase
                .from('products')
                .update({ stock_quantity: product.stock_quantity - item.quantity })
                .eq('id', item.product_id);
            }
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success("Đã cập nhật trạng thái đơn hàng");
    }
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      pending: { variant: "secondary", icon: Clock, label: "Chờ duyệt" },
      approved: { variant: "default", icon: Check, label: "Đã duyệt" },
      rejected: { variant: "destructive", icon: X, label: "Từ chối" }
    };
    
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant as any}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const filterOrders = (status: string) => {
    return orders.filter((order: any) => order.status === status);
  };

  const OrderCard = ({ order }: { order: any }) => (
    <Collapsible>
      <Card className="p-4">
        <CollapsibleTrigger className="w-full">
          <div className="flex justify-between items-start">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{order.customer_name}</h3>
                {getStatusBadge(order.status)}
              </div>
              <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
              <p className="text-sm text-muted-foreground">{order.customer_address}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-primary">
                {Number(order.total_amount).toLocaleString()}đ
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString('vi-VN')}
              </p>
              <ChevronDown className="h-4 w-4 ml-auto mt-2" />
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-4 space-y-4">
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Chi tiết đơn hàng:</h4>
            <div className="space-y-2">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.products.name} x{item.quantity}
                    {item.selected_color && ` - ${item.selected_color}`}
                    {item.selected_size && ` - ${item.selected_size}`}
                  </span>
                  <span>{(Number(item.product_price) * item.quantity).toLocaleString()}đ</span>
                </div>
              ))}
            </div>
            {order.delivery_time && (
              <p className="text-sm mt-2">
                <strong>Thời gian nhận:</strong> {order.delivery_time}
              </p>
            )}
            {order.customer_message && (
              <p className="text-sm mt-2">
                <strong>Ghi chú:</strong> {order.customer_message}
              </p>
            )}
          </div>

          {order.status === 'pending' && (
            <div className="flex gap-2 border-t pt-4">
              <Button
                size="sm"
                onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'approved' })}
                disabled={updateStatusMutation.isPending}
              >
                <Check className="h-4 w-4 mr-1" />
                Duyệt đơn
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'rejected' })}
                disabled={updateStatusMutation.isPending}
              >
                <X className="h-4 w-4 mr-1" />
                Từ chối
              </Button>
            </div>
          )}
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Quản lý đơn hàng</h2>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Chờ duyệt ({filterOrders('pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Đã duyệt ({filterOrders('approved').length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Từ chối ({filterOrders('rejected').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-4">
          {filterOrders('pending').map((order: any) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-4">
          {filterOrders('approved').map((order: any) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-4">
          {filterOrders('rejected').map((order: any) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminOrders;
