-- =============================================
-- Portfolio CMS - Complete Database Schema
-- Run this file FIRST in Supabase SQL Editor
-- =============================================

-- 1. Enum Types
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Database Functions (needed before tables for triggers)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_blogs_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_blog_view(blog_slug TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.blogs
    SET view_count = COALESCE(view_count, 0) + 1
    WHERE slug = blog_slug AND published = true;
END;
$$;

-- 3. Tables

-- User Roles
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Hero Section
CREATE TABLE public.hero_section (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL DEFAULT 'Your Name',
    title TEXT NOT NULL DEFAULT 'Your Title',
    quote TEXT NOT NULL DEFAULT 'Your tagline or quote here.',
    profile_image_url TEXT,
    background_image_url TEXT,
    cv_file_url TEXT,
    show_cv_button BOOLEAN DEFAULT true,
    show_contact_button BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.hero_section ENABLE ROW LEVEL SECURITY;

-- About Section
CREATE TABLE public.about_section (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    headline TEXT NOT NULL DEFAULT 'About Me',
    description TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.about_section ENABLE ROW LEVEL SECURITY;

-- Skills
CREATE TABLE public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Experiences
CREATE TABLE public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    description TEXT,
    achievements TEXT[] DEFAULT '{}',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- Education
CREATE TABLE public.education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year TEXT NOT NULL,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field TEXT,
    description TEXT,
    achievements TEXT[],
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

-- Certificates
CREATE TABLE public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date TEXT,
    expiry_date TEXT,
    credential_id TEXT,
    credential_url TEXT,
    description TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Projects
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    full_description TEXT,
    category TEXT NOT NULL,
    technologies TEXT[] DEFAULT '{}',
    image_url TEXT,
    link TEXT,
    slug TEXT,
    challenge TEXT,
    solution TEXT,
    metrics JSONB DEFAULT '[]'::jsonb,
    attachments JSONB DEFAULT '[]'::jsonb,
    video_url TEXT,
    featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_unique ON public.projects (slug);

-- Blog Categories
CREATE TABLE public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

-- Blogs
CREATE TABLE public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    category_id UUID REFERENCES public.blog_categories(id),
    view_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    scheduled_at TIMESTAMPTZ,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_blogs_view_count ON public.blogs(view_count DESC);

-- Blog Tags
CREATE TABLE public.blog_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#6366F1',
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON public.blog_tags(slug);

-- Blog Post Tags (Many-to-Many)
CREATE TABLE public.blog_post_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.blog_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(blog_id, tag_id)
);
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_blog_id ON public.blog_post_tags(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_tag_id ON public.blog_post_tags(tag_id);

-- Product Categories
CREATE TABLE public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Products
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    full_description TEXT,
    brand TEXT,
    price NUMERIC NOT NULL,
    discount_percent INTEGER DEFAULT 0,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    images TEXT[],
    colors TEXT[],
    sizes TEXT[],
    category_id UUID REFERENCES public.product_categories(id),
    product_type TEXT NOT NULL DEFAULT 'product',
    video_url TEXT,
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_products_product_type ON public.products(product_type);

-- Cart Items
CREATE TABLE public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    selected_size TEXT,
    selected_color TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Orders
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    delivery_time TEXT,
    customer_message TEXT,
    total_amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Order Items
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    product_name TEXT NOT NULL,
    product_price NUMERIC NOT NULL,
    quantity INTEGER NOT NULL,
    selected_size TEXT,
    selected_color TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Contacts
CREATE TABLE public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    map_embed_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Contact Submissions
CREATE TABLE public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    seen BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Social Links
CREATE TABLE public.social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL,
    url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Footer Links
CREATE TABLE public.footer_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section TEXT NOT NULL,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;

-- Chatbot Training
CREATE TABLE public.chatbot_training (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    keywords TEXT[] NOT NULL,
    language TEXT NOT NULL DEFAULT 'vi',
    priority INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.chatbot_training ENABLE ROW LEVEL SECURITY;

-- Settings
CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
