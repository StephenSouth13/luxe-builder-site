-- Add scheduled_at column for blog scheduling
ALTER TABLE public.blogs 
ADD COLUMN scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create index for efficient querying of scheduled posts
CREATE INDEX idx_blogs_scheduled_at ON public.blogs(scheduled_at) 
WHERE scheduled_at IS NOT NULL AND published = false;

-- Add comment for documentation
COMMENT ON COLUMN public.blogs.scheduled_at IS 'Timestamp when the blog should be automatically published. NULL means no scheduling.';