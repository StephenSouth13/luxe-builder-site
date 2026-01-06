-- Add hero buttons settings columns
-- First, let's update hero_section to support button visibility and CV upload
ALTER TABLE public.hero_section
ADD COLUMN IF NOT EXISTS show_contact_button boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS show_cv_button boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS cv_file_url text;

-- Add video_url to products table for video upload support
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS video_url text;

-- Add RLS policy for admin to delete products
CREATE POLICY "Admins can delete products"
ON public.products
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));