-- Create community_readers table for storing reader sign-up data
CREATE TABLE public.community_readers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  age INTEGER,
  location TEXT,
  occupation TEXT,
  reading_experience TEXT, -- beginner, intermediate, advanced
  favorite_genres TEXT[], -- array of genres
  reading_frequency TEXT, -- daily, weekly, monthly
  recent_book_purchases TEXT,
  preferred_book_formats TEXT[], -- physical, ebook, audiobook
  social_media_handles JSONB, -- {instagram: "", goodreads: "", etc}
  why_join_community TEXT,
  monthly_book_budget TEXT,
  review_writing_experience TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  admin_notes TEXT,
  reviews_given INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.community_readers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can create reader applications" 
ON public.community_readers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all reader applications" 
ON public.community_readers 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "Admins can update reader applications" 
ON public.community_readers 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::user_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_community_readers_updated_at
BEFORE UPDATE ON public.community_readers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();