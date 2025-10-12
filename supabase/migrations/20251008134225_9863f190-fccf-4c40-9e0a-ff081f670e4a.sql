-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create posts table for affiliate products
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  affiliate_link TEXT NOT NULL,
  category TEXT,
  tags TEXT[],
  slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news_posts table for news articles
CREATE TABLE public.news_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  sections JSONB,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email subscribers table
CREATE TABLE public.email_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user roles table for admin access
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for posts
CREATE POLICY "Posts are viewable by everyone"
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert posts"
  ON public.posts FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update posts"
  ON public.posts FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete posts"
  ON public.posts FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for news_posts
CREATE POLICY "News posts are viewable by everyone"
  ON public.news_posts FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert news posts"
  ON public.news_posts FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update news posts"
  ON public.news_posts FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete news posts"
  ON public.news_posts FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for email subscribers
CREATE POLICY "Email subscribers are viewable by admins"
  ON public.email_subscribers FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert email subscribers"
  ON public.email_subscribers FOR INSERT
  WITH CHECK (true);

-- RLS Policies for user roles
CREATE POLICY "User roles are viewable by owner"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only admins can insert user roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for post images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for post images
CREATE POLICY "Post images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-images');

CREATE POLICY "Admins can upload post images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'post-images' AND 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update post images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'post-images' AND 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete post images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'post-images' AND 
    public.has_role(auth.uid(), 'admin')
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_posts_updated_at
  BEFORE UPDATE ON public.news_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();