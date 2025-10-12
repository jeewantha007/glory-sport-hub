-- Add slug column to posts table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create index for better performance on slug queries
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts (slug);

-- Populate existing posts with slugs based on their titles
UPDATE public.posts 
SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL AND title IS NOT NULL;

-- Remove leading/trailing hyphens that might have been created
UPDATE public.posts 
SET slug = TRIM(BOTH '-' FROM slug)
WHERE slug IS NOT NULL;

-- Ensure slugs are not empty
UPDATE public.posts 
SET slug = 'post-' || id
WHERE slug = '' OR slug IS NULL;