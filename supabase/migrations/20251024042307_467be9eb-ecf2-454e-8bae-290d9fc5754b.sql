-- Create contacts table for contact information
CREATE TABLE public.contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  phone text,
  location text,
  map_embed_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Anyone can view contacts
CREATE POLICY "Anyone can view contacts"
ON public.contacts
FOR SELECT
USING (true);

-- Admins can manage contacts
CREATE POLICY "Admins can manage contacts"
ON public.contacts
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default contact data
INSERT INTO public.contacts (email, phone, location, map_embed_url)
VALUES (
  'trinhbalam@gmail.com',
  '+84 123 456 789',
  'Hà Nội, Việt Nam',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096946879686!2d105.78486547503194!3d21.028806980629524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab86ceb6f0e5%3A0x3a5adc597a11e3f5!2zSMOgIE7hu5lpLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s'
);