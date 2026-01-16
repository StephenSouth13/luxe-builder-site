-- Add public read access to contacts table for displaying contact info
-- Drop restrictive policies first
DROP POLICY IF EXISTS "Admins can view contacts" ON public.contacts;

-- Create a new policy that allows anyone to view contacts
CREATE POLICY "Anyone can view contacts"
ON public.contacts
FOR SELECT
USING (true);