-- Add video_url and attachments columns to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS video_url text,
ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb;

-- Add comment for clarity
COMMENT ON COLUMN public.projects.video_url IS 'YouTube or Vimeo embed URL for project video';
COMMENT ON COLUMN public.projects.attachments IS 'Array of attachment objects with name, url, and type (pdf, doc, etc)';

-- Add site_logo setting to settings table if not exists
INSERT INTO public.settings (key, value) 
VALUES ('site_logo', '')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value) 
VALUES ('site_logo_text', 'TBL')
ON CONFLICT (key) DO NOTHING;