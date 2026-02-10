# Portfolio CMS

Website portfolio cá nhân với Admin CMS đầy đủ. Dễ dàng nhân bản cho bất kỳ ai.

## 🚀 Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Supabase (Auth, Database, Storage)
- Framer Motion

## ⚙️ Cài đặt & Chạy

```bash
git clone <repository-url>
cd <project-folder>
npm install
npm run dev
```

## 🗄️ Setup Database (Supabase)

Chạy các file SQL theo thứ tự trong **Supabase SQL Editor**:

| Thứ tự | File | Mô tả |
|--------|------|--------|
| 1 | `sql/001_schema.sql` | Tạo tất cả tables, functions, indexes |
| 2 | `sql/002_rls_policies.sql` | Thiết lập Row Level Security |
| 3 | `sql/003_storage.sql` | Tạo storage bucket cho upload ảnh |
| 4 | `sql/004_seed_admin.sql` | Gán quyền admin (chạy sau khi đăng ký) |

### Hướng dẫn chi tiết:

1. Tạo project mới trên [supabase.com](https://supabase.com)
2. Vào **SQL Editor** → chạy lần lượt `001` → `002` → `003`
3. Cập nhật `.env`:
   ```env
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"
   ```
4. Chạy app → vào `/admin` → đăng ký tài khoản
5. Lấy UUID của user vừa tạo:
   ```sql
   SELECT id, email FROM auth.users;
   ```
6. Chạy `004_seed_admin.sql` (thay `YOUR_USER_UUID` bằng UUID thật)

## 🎨 Tính năng Admin CMS

- **Hero**: Tên, chức danh, ảnh profile, ảnh nền, CV
- **Về tôi**: Tiêu đề, mô tả, hình ảnh
- **Kỹ năng**: Danh sách kỹ năng
- **Kinh nghiệm**: Timeline kinh nghiệm
- **Học vấn**: Quá trình học tập
- **Chứng chỉ**: Chứng chỉ & credentials
- **Dự án**: Portfolio dự án với chi tiết
- **Blog**: Bài viết với categories, tags, lượt xem
- **Store**: Sản phẩm & đơn hàng
- **Liên hệ**: Email, phone, Google Maps
- **Chatbot**: Training chatbot tự động
- **Giao diện**: Theme, logo, navigation, footer

## 🗺️ Google Maps

1. Vào [Google Maps](https://www.google.com/maps)
2. Tìm địa điểm → Share → Embed a map
3. Copy URL hoặc dán cả thẻ iframe vào Admin > Liên hệ

## 📦 Deploy lên Vercel

1. Push code lên GitHub
2. Import vào Vercel
3. Thêm Environment Variables
4. Deploy

File `vercel.json` đã có sẵn để xử lý SPA routing.

## 📧 Tùy chỉnh SEO

Sửa các file sau cho phù hợp:
- `index.html` - Meta tags mặc định
- `src/components/SEOHead.tsx` - Dynamic SEO
- `public/robots.txt` - Crawl rules
- `public/sitemap.xml` - Sitemap URLs
