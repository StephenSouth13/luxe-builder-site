import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Ticket, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Voucher {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  used_count: number;
  active: boolean;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
}

const emptyForm = {
  code: "",
  description: "",
  discount_type: "percent",
  discount_value: 0,
  min_order_amount: 0,
  max_uses: null as number | null,
  active: true,
  starts_at: "",
  expires_at: "",
};

const AdminVouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const { data, error } = await supabase
        .from("vouchers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setVouchers(data || []);
    } catch (err: any) {
      toast({ title: "Lỗi", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsDialogOpen(true);
  };

  const openEdit = (v: Voucher) => {
    setEditingId(v.id);
    setForm({
      code: v.code,
      description: v.description || "",
      discount_type: v.discount_type,
      discount_value: v.discount_value,
      min_order_amount: v.min_order_amount || 0,
      max_uses: v.max_uses,
      active: v.active,
      starts_at: v.starts_at ? v.starts_at.slice(0, 16) : "",
      expires_at: v.expires_at ? v.expires_at.slice(0, 16) : "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.code.trim()) {
      toast({ title: "Lỗi", description: "Mã voucher không được để trống", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        description: form.description || null,
        discount_type: form.discount_type,
        discount_value: form.discount_value,
        min_order_amount: form.min_order_amount || 0,
        max_uses: form.max_uses || null,
        active: form.active,
        starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : new Date().toISOString(),
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      };

      if (editingId) {
        const { error } = await supabase.from("vouchers").update(payload).eq("id", editingId);
        if (error) throw error;
        toast({ title: "Đã cập nhật voucher" });
      } else {
        const { error } = await supabase.from("vouchers").insert(payload);
        if (error) throw error;
        toast({ title: "Đã tạo voucher mới" });
      }
      setIsDialogOpen(false);
      fetchVouchers();
    } catch (err: any) {
      toast({ title: "Lỗi", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa voucher này?")) return;
    try {
      const { error } = await supabase.from("vouchers").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Đã xóa voucher" });
      fetchVouchers();
    } catch (err: any) {
      toast({ title: "Lỗi", description: err.message, variant: "destructive" });
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase.from("vouchers").update({ active: !active }).eq("id", id);
      if (error) throw error;
      fetchVouchers();
    } catch (err: any) {
      toast({ title: "Lỗi", description: err.message, variant: "destructive" });
    }
  };

  const isExpired = (v: Voucher) => v.expires_at && new Date(v.expires_at) < new Date();
  const isMaxed = (v: Voucher) => v.max_uses !== null && v.used_count >= v.max_uses;

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Quản lý Voucher</h3>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Tạo voucher</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? "Sửa voucher" : "Tạo voucher mới"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Mã voucher *</Label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="VD: GIAM20" className="uppercase" />
              </div>
              <div>
                <Label>Mô tả</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Mô tả voucher..." rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Loại giảm giá</Label>
                  <Select value={form.discount_type} onValueChange={(v) => setForm({ ...form, discount_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Phần trăm (%)</SelectItem>
                      <SelectItem value="fixed">Cố định (VNĐ)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Giá trị giảm</Label>
                  <Input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })} min={0} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Đơn tối thiểu</Label>
                  <Input type="number" value={form.min_order_amount || 0} onChange={(e) => setForm({ ...form, min_order_amount: Number(e.target.value) })} min={0} />
                </div>
                <div>
                  <Label>Số lần dùng tối đa</Label>
                  <Input type="number" value={form.max_uses ?? ""} onChange={(e) => setForm({ ...form, max_uses: e.target.value ? Number(e.target.value) : null })} placeholder="Không giới hạn" min={1} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Bắt đầu</Label>
                  <Input type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} />
                </div>
                <div>
                  <Label>Hết hạn</Label>
                  <Input type="datetime-local" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                <Label>Kích hoạt</Label>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingId ? "Cập nhật" : "Tạo mới"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {vouchers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Chưa có voucher nào. Nhấn "Tạo voucher" để bắt đầu.
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Giảm giá</TableHead>
                <TableHead className="hidden md:table-cell">Đơn tối thiểu</TableHead>
                <TableHead className="hidden md:table-cell">Đã dùng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vouchers.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-mono font-bold">{v.code}</TableCell>
                  <TableCell>
                    {v.discount_type === "percent"
                      ? `${v.discount_value}%`
                      : `${v.discount_value.toLocaleString("vi-VN")}₫`}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {v.min_order_amount ? `${Number(v.min_order_amount).toLocaleString("vi-VN")}₫` : "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {v.used_count}{v.max_uses ? `/${v.max_uses}` : ""}
                  </TableCell>
                  <TableCell>
                    {isExpired(v) ? (
                      <Badge variant="secondary">Hết hạn</Badge>
                    ) : isMaxed(v) ? (
                      <Badge variant="secondary">Hết lượt</Badge>
                    ) : v.active ? (
                      <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30 cursor-pointer" onClick={() => toggleActive(v.id, v.active)}>
                        Hoạt động
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="cursor-pointer" onClick={() => toggleActive(v.id, v.active)}>
                        Tắt
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(v)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminVouchers;
