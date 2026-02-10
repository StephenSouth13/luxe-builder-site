-- =============================================
-- Portfolio CMS - Seed Admin User
-- Run this AFTER creating your admin user via signup
-- =============================================

-- IMPORTANT: Replace 'YOUR_USER_UUID' with the actual UUID
-- from auth.users after you sign up at /admin
--
-- To find your user UUID, run:
--   SELECT id, email FROM auth.users;
--
-- Then run:
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_UUID', 'admin');
