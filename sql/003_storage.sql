-- =============================================
-- Portfolio CMS - Storage Setup
-- Run this AFTER 002_rls_policies.sql
-- =============================================

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true);

-- Public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'project-images');

-- Admins can delete
CREATE POLICY "Admins can delete"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'project-images'
  AND has_role(auth.uid(), 'admin'::app_role)
);
