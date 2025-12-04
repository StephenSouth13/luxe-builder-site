# Supabase Complete Setup Guide

Hướng dẫn đầy đủ để thiết lập Supabase cho dự án Portfolio & E-commerce.

## Mục lục
1. [Cấu hình môi trường](#1-cấu-hình-môi-trường)
2. [Tạo Enum Types](#2-tạo-enum-types)
3. [Tạo Database Functions](#3-tạo-database-functions)
4. [Tạo Tables](#4-tạo-tables)
5. [Thiết lập RLS Policies](#5-thiết-lập-rls-policies)
6. [Storage Buckets](#6-storage-buckets)
7. [Triggers](#7-triggers)
8. [Kết nối Frontend](#8-kết-nối-frontend)
9. [Xác thực (Authentication)](#9-xác-thực-authentication)
10. [Các lệnh CRUD mẫu](#10-các-lệnh-crud-mẫu)

---

## 1. Cấu hình môi trường

### Biến môi trường (.env)
```env
VITE_SUPABASE_URL="https://[PROJECT_ID].supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="[ANON_KEY]"
VITE_SUPABASE_PROJECT_ID="[PROJECT_ID]"
```

### Supabase Client (src/integrations/supabase/client.ts)
```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

---

## 2. Tạo Enum Types

```sql
-- User roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
```

---

## 3. Tạo Database Functions

### Function kiểm tra role
```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
```

### Function tự động cập nhật updated_at
```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
```

### Function cho blogs
```sql
CREATE OR REPLACE FUNCTION public.handle_blogs_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
```

---

## 4. Tạo Tables

### 4.1 User Roles
```sql
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
```

### 4.2 Hero Section
```sql
CREATE TABLE public.hero_section (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Trịnh Bá Lâm',
  title text NOT NULL DEFAULT 'Sales & Business Development Expert',
  quote text NOT NULL DEFAULT 'Kết nối – Thuyết phục – Bứt phá doanh số cùng đối tác chiến lược.',
  profile_image_url text,
  background_image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.hero_section ENABLE ROW LEVEL SECURITY;
```

### 4.3 About Section
```sql
CREATE TABLE public.about_section (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  headline text NOT NULL DEFAULT 'Về tôi',
  description text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.about_section ENABLE ROW LEVEL SECURITY;
```

### 4.4 Skills
```sql
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
```

### 4.5 Experiences
```sql
CREATE TABLE public.experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year text NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  location text,
  description text,
  achievements text[] DEFAULT '{}'::text[],
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
```

### 4.6 Education
```sql
CREATE TABLE public.education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution text NOT NULL,
  degree text NOT NULL,
  field text,
  year text NOT NULL,
  description text,
  achievements text[],
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
```

### 4.7 Projects
```sql
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  full_description text,
  image_url text,
  link text,
  technologies text[] DEFAULT '{}'::text[],
  challenge text,
  solution text,
  slug text,
  metrics jsonb DEFAULT '[]'::jsonb,
  featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
```

### 4.8 Blog Categories
```sql
CREATE TABLE public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  color text DEFAULT '#3B82F6',
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
```

### 4.9 Blogs
```sql
CREATE TABLE public.blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text,
  content text NOT NULL,
  excerpt text,
  image_url text,
  category_id uuid REFERENCES public.blog_categories(id),
  published boolean DEFAULT false,
  featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
```

### 4.10 Product Categories
```sql
CREATE TABLE public.product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
```

### 4.11 Products
```sql
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text,
  description text,
  full_description text,
  category_id uuid REFERENCES public.product_categories(id),
  brand text,
  price numeric NOT NULL,
  discount_percent integer DEFAULT 0,
  stock_quantity integer NOT NULL DEFAULT 0,
  colors text[],
  sizes text[],
  image_url text,
  images text[],
  featured boolean DEFAULT false,
  published boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
```

### 4.12 Cart Items
```sql
CREATE TABLE public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid NOT NULL REFERENCES public.products(id),
  quantity integer NOT NULL DEFAULT 1,
  selected_color text,
  selected_size text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
```

### 4.13 Orders
```sql
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  delivery_time text,
  customer_message text,
  total_amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
```

### 4.14 Order Items
```sql
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id),
  product_id uuid NOT NULL REFERENCES public.products(id),
  product_name text NOT NULL,
  product_price numeric NOT NULL,
  quantity integer NOT NULL,
  selected_color text,
  selected_size text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
```

### 4.15 Contacts
```sql
CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  phone text,
  location text,
  map_embed_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
```

### 4.16 Contact Submissions
```sql
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  seen boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
```

### 4.17 Social Links
```sql
CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  url text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
```

### 4.18 Footer Links
```sql
CREATE TABLE public.footer_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  label text NOT NULL,
  url text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;
```

### 4.19 Chatbot Training
```sql
CREATE TABLE public.chatbot_training (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  keywords text[] NOT NULL,
  language text NOT NULL DEFAULT 'vi',
  priority integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chatbot_training ENABLE ROW LEVEL SECURITY;
```

### 4.20 Settings
```sql
CREATE TABLE public.settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
```

---

## 5. Thiết lập RLS Policies

### 5.1 User Roles
```sql
-- Users can view their own roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

-- Service role can manage roles
CREATE POLICY "Service role can manage roles" ON public.user_roles
FOR ALL USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);
```

### 5.2 Hero Section
```sql
CREATE POLICY "Anyone can view hero section" ON public.hero_section
FOR SELECT USING (true);

CREATE POLICY "Admins can insert hero section" ON public.hero_section
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update hero section" ON public.hero_section
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete hero section" ON public.hero_section
FOR DELETE USING (has_role(auth.uid(), 'admin'));
```

### 5.3 About Section
```sql
CREATE POLICY "Anyone can view about section" ON public.about_section
FOR SELECT USING (true);

CREATE POLICY "Admins can insert about section" ON public.about_section
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update about section" ON public.about_section
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete about section" ON public.about_section
FOR DELETE USING (has_role(auth.uid(), 'admin'));
```

### 5.4 Skills
```sql
CREATE POLICY "Anyone can view skills" ON public.skills
FOR SELECT USING (true);

CREATE POLICY "Admins can manage skills" ON public.skills
FOR ALL USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));
```

### 5.5 Experiences
```sql
CREATE POLICY "Anyone can view experiences" ON public.experiences
FOR SELECT USING (true);

CREATE POLICY "Admins can manage experiences" ON public.experiences
FOR ALL USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));
```

### 5.6 Education
```sql
CREATE POLICY "Anyone can view education" ON public.education
FOR SELECT USING (true);

CREATE POLICY "Admins can manage education" ON public.education
FOR ALL USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));
```

### 5.7 Projects
```sql
CREATE POLICY "Anyone can view projects" ON public.projects
FOR SELECT USING (true);

CREATE POLICY "Admins can manage projects" ON public.projects
FOR ALL USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));
```

### 5.8 Blog Categories
```sql
CREATE POLICY "Anyone can view blog categories" ON public.blog_categories
FOR SELECT USING (true);

CREATE POLICY "Admins can manage blog categories" ON public.blog_categories
FOR ALL USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));
```

### 5.9 Blogs
```sql
CREATE POLICY "Anyone can view published blogs" ON public.blogs
FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage blogs" ON public.blogs
FOR ALL USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));
```

### 5.10 Product Categories
```sql
CREATE POLICY "Anyone can view categories" ON public.product_categories
FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON public.product_categories
FOR ALL USING (has_role(auth.uid(), 'admin'));
```

### 5.11 Products
```sql
CREATE POLICY "Anyone can view published products" ON public.products
FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage products" ON public.products
FOR ALL USING (has_role(auth.uid(), 'admin'));
```

### 5.12 Cart Items
```sql
CREATE POLICY "Users can manage their own cart" ON public.cart_items
FOR ALL USING (auth.uid() = user_id);
```

### 5.13 Orders
```sql
CREATE POLICY "Users can create their own orders" ON public.orders
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own orders" ON public.orders
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON public.orders
FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders" ON public.orders
FOR UPDATE USING (has_role(auth.uid(), 'admin'));
```

### 5.14 Order Items
```sql
CREATE POLICY "Users can create order items" ON public.order_items
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view their order items" ON public.order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage order items" ON public.order_items
FOR ALL USING (has_role(auth.uid(), 'admin'));
```

### 5.15 Contacts
```sql
CREATE POLICY "Anyone can view contacts" ON public.contacts
FOR SELECT USING (true);

CREATE POLICY "Admins can manage contacts" ON public.contacts
FOR ALL USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));
```

### 5.16 Contact Submissions
```sql
CREATE POLICY "Anyone can create submissions" ON public.contact_submissions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view submissions" ON public.contact_submissions
FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update submissions" ON public.contact_submissions
FOR UPDATE USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete submissions" ON public.contact_submissions
FOR DELETE USING (has_role(auth.uid(), 'admin'));
```

### 5.17 Social Links
```sql
CREATE POLICY "Anyone can view social links" ON public.social_links
FOR SELECT USING (true);

CREATE POLICY "Admins can manage social links" ON public.social_links
FOR ALL USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));
```

### 5.18 Footer Links
```sql
CREATE POLICY "Anyone can view footer links" ON public.footer_links
FOR SELECT USING (true);

CREATE POLICY "Admins can manage footer links" ON public.footer_links
FOR ALL USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));
```

### 5.19 Chatbot Training
```sql
CREATE POLICY "Anyone can view active chatbot training" ON public.chatbot_training
FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage chatbot training" ON public.chatbot_training
FOR ALL USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));
```

### 5.20 Settings
```sql
CREATE POLICY "Anyone can view settings" ON public.settings
FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON public.settings
FOR ALL USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));
```

---

## 6. Storage Buckets

### Tạo bucket cho hình ảnh dự án
```sql
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true);
```

### RLS cho Storage
```sql
-- Allow public read access
CREATE POLICY "Public read access for project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

-- Allow admin upload
CREATE POLICY "Admin can upload project images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images' 
  AND has_role(auth.uid(), 'admin')
);

-- Allow admin delete
CREATE POLICY "Admin can delete project images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-images' 
  AND has_role(auth.uid(), 'admin')
);
```

---

## 7. Triggers

### Trigger cập nhật updated_at cho các bảng
```sql
-- Hero section
CREATE TRIGGER update_hero_section_updated_at
BEFORE UPDATE ON public.hero_section
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- About section
CREATE TRIGGER update_about_section_updated_at
BEFORE UPDATE ON public.about_section
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Experiences
CREATE TRIGGER update_experiences_updated_at
BEFORE UPDATE ON public.experiences
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Education
CREATE TRIGGER update_education_updated_at
BEFORE UPDATE ON public.education
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Projects
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Blogs
CREATE TRIGGER update_blogs_updated_at
BEFORE UPDATE ON public.blogs
FOR EACH ROW EXECUTE FUNCTION handle_blogs_updated_at();

-- Products
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Orders
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 8. Kết nối Frontend

### Import Supabase Client
```typescript
import { supabase } from "@/integrations/supabase/client";
```

### Lấy dữ liệu (SELECT)
```typescript
// Lấy tất cả products
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('published', true)
  .order('sort_order');

// Lấy với relation
const { data, error } = await supabase
  .from('products')
  .select(`
    *,
    product_categories (
      id,
      name
    )
  `)
  .eq('published', true);

// Lấy 1 record
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('slug', slug)
  .maybeSingle();
```

### Thêm dữ liệu (INSERT)
```typescript
const { data, error } = await supabase
  .from('products')
  .insert({
    name: 'Product name',
    price: 100000,
    stock_quantity: 10
  })
  .select()
  .single();
```

### Cập nhật dữ liệu (UPDATE)
```typescript
const { error } = await supabase
  .from('products')
  .update({ name: 'New name', price: 150000 })
  .eq('id', productId);
```

### Xóa dữ liệu (DELETE)
```typescript
const { error } = await supabase
  .from('products')
  .delete()
  .eq('id', productId);
```

### Upload file
```typescript
const { data, error } = await supabase.storage
  .from('project-images')
  .upload(`products/${fileName}`, file);

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('project-images')
  .getPublicUrl(`products/${fileName}`);
```

---

## 9. Xác thực (Authentication)

### Đăng ký
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    emailRedirectTo: `${window.location.origin}/`
  }
});
```

### Đăng nhập
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

### Đăng xuất
```typescript
const { error } = await supabase.auth.signOut();
```

### Lấy user hiện tại
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

### Lấy session
```typescript
const { data: { session } } = await supabase.auth.getSession();
```

### Theo dõi thay đổi auth state
```typescript
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

### Kiểm tra admin role
```typescript
const { data: roleData, error } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', user.id)
  .eq('role', 'admin')
  .maybeSingle();

const isAdmin = !!roleData;
```

### Tạo admin user (chạy 1 lần)
```sql
-- Sau khi user đăng ký, thêm role admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('[USER_ID_FROM_AUTH]', 'admin');
```

---

## 10. Các lệnh CRUD mẫu

### React Query với Supabase
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ['products'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('published', true)
      .order('sort_order');
    
    if (error) throw error;
    return data;
  }
});

// Mutation
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: async (newProduct) => {
    const { data, error } = await supabase
      .from('products')
      .insert(newProduct)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  }
});
```

### Realtime Subscriptions
```typescript
useEffect(() => {
  const channel = supabase
    .channel('orders-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders'
      },
      (payload) => {
        console.log('Order changed:', payload);
        // Refresh data
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

---

## Lưu ý quan trọng

1. **Bảo mật**: Luôn sử dụng RLS policies để bảo vệ dữ liệu
2. **Auto-confirm email**: Bật trong Supabase Dashboard > Authentication > Settings để không cần xác nhận email khi test
3. **Environment variables**: Không commit file .env vào git
4. **Service Role Key**: Chỉ sử dụng ở server-side, không bao giờ expose ra client
5. **Indexes**: Thêm index cho các cột thường xuyên query để tăng performance

```sql
-- Ví dụ tạo index
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_blogs_slug ON public.blogs(slug);
```

---

## Thứ tự chạy SQL

1. Tạo enum types
2. Tạo functions
3. Tạo tables (theo thứ tự dependency)
4. Tạo RLS policies
5. Tạo triggers
6. Tạo storage buckets
7. Tạo indexes (optional)
8. Insert dữ liệu mẫu (optional)

---

**Cập nhật lần cuối**: 2025-12-04
