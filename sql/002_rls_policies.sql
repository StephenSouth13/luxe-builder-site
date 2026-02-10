-- =============================================
-- Portfolio CMS - RLS Policies
-- Run this AFTER 001_schema.sql
-- =============================================

-- User Roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage roles"
ON public.user_roles FOR ALL TO authenticated
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Hero Section
CREATE POLICY "Anyone can view hero section"
ON public.hero_section FOR SELECT USING (true);

CREATE POLICY "Admins can insert hero section"
ON public.hero_section FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update hero section"
ON public.hero_section FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete hero section"
ON public.hero_section FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- About Section
CREATE POLICY "Anyone can view about section"
ON public.about_section FOR SELECT USING (true);

CREATE POLICY "Admins can insert about section"
ON public.about_section FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update about section"
ON public.about_section FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete about section"
ON public.about_section FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Skills
CREATE POLICY "Anyone can view skills"
ON public.skills FOR SELECT USING (true);

CREATE POLICY "Admins can manage skills"
ON public.skills FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Experiences
CREATE POLICY "Anyone can view experiences"
ON public.experiences FOR SELECT USING (true);

CREATE POLICY "Admins can manage experiences"
ON public.experiences FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Education
CREATE POLICY "Anyone can view education"
ON public.education FOR SELECT USING (true);

CREATE POLICY "Admins can manage education"
ON public.education FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Certificates
CREATE POLICY "Anyone can view certificates"
ON public.certificates FOR SELECT USING (true);

CREATE POLICY "Admins can manage certificates"
ON public.certificates FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Projects
CREATE POLICY "Anyone can view projects"
ON public.projects FOR SELECT USING (true);

CREATE POLICY "Admins can manage projects"
ON public.projects FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Blog Categories
CREATE POLICY "Anyone can view blog categories"
ON public.blog_categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage blog categories"
ON public.blog_categories FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Blogs
CREATE POLICY "Anyone can view published blogs"
ON public.blogs FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage blogs"
ON public.blogs FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Blog Tags
CREATE POLICY "Anyone can view tags"
ON public.blog_tags FOR SELECT USING (true);

CREATE POLICY "Admins can manage tags"
ON public.blog_tags FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Blog Post Tags
CREATE POLICY "Anyone can view post tags"
ON public.blog_post_tags FOR SELECT USING (true);

CREATE POLICY "Admins can manage post tags"
ON public.blog_post_tags FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Product Categories
CREATE POLICY "Anyone can view categories"
ON public.product_categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories"
ON public.product_categories FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Products
CREATE POLICY "Anyone can view published products"
ON public.products FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage products"
ON public.products FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete products"
ON public.products FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Cart Items
CREATE POLICY "Users can manage their own cart"
ON public.cart_items FOR ALL TO authenticated
USING (auth.uid() = user_id);

-- Orders
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
ON public.orders FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update orders"
ON public.orders FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Order Items
CREATE POLICY "Users can view their order items"
ON public.order_items FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM orders
  WHERE orders.id = order_items.order_id
  AND orders.user_id = auth.uid()
));

CREATE POLICY "Users can create order items"
ON public.order_items FOR INSERT TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM orders
  WHERE orders.id = order_items.order_id
  AND orders.user_id = auth.uid()
));

CREATE POLICY "Admins can manage order items"
ON public.order_items FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Contacts
CREATE POLICY "Anyone can view contacts"
ON public.contacts FOR SELECT USING (true);

CREATE POLICY "Admins can manage contacts"
ON public.contacts FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Contact Submissions
CREATE POLICY "Anyone can create submissions"
ON public.contact_submissions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view submissions"
ON public.contact_submissions FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update submissions"
ON public.contact_submissions FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete submissions"
ON public.contact_submissions FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Social Links
CREATE POLICY "Anyone can view social links"
ON public.social_links FOR SELECT USING (true);

CREATE POLICY "Admins can manage social links"
ON public.social_links FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Footer Links
CREATE POLICY "Anyone can view footer links"
ON public.footer_links FOR SELECT USING (true);

CREATE POLICY "Admins can manage footer links"
ON public.footer_links FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Chatbot Training
CREATE POLICY "Anyone can view active chatbot training"
ON public.chatbot_training FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage chatbot training"
ON public.chatbot_training FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Settings
CREATE POLICY "Anyone can view settings"
ON public.settings FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings"
ON public.settings FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
