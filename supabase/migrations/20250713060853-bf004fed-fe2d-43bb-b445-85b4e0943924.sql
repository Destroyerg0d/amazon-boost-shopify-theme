-- Create help center articles table
CREATE TABLE public.help_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  author_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'published',
  view_count INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community posts table
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[],
  author_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'published',
  is_solved BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  upvotes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community replies table
CREATE TABLE public.community_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  is_solution BOOLEAN NOT NULL DEFAULT false,
  is_support_reply BOOLEAN NOT NULL DEFAULT false,
  upvotes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community votes table
CREATE TABLE public.community_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.community_replies(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, reply_id),
  CHECK ((post_id IS NOT NULL AND reply_id IS NULL) OR (post_id IS NULL AND reply_id IS NOT NULL))
);

-- Enable RLS
ALTER TABLE public.help_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_votes ENABLE ROW LEVEL SECURITY;

-- RLS policies for help_articles
CREATE POLICY "Anyone can view published articles" ON public.help_articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all articles" ON public.help_articles
  FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- RLS policies for community_posts
CREATE POLICY "Anyone can view published posts" ON public.community_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can create posts" ON public.community_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own posts" ON public.community_posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all posts" ON public.community_posts
  FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- RLS policies for community_replies
CREATE POLICY "Anyone can view replies" ON public.community_replies
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create replies" ON public.community_replies
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own replies" ON public.community_replies
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all replies" ON public.community_replies
  FOR ALL USING (has_role(auth.uid(), 'admin'::user_role));

-- RLS policies for community_votes
CREATE POLICY "Users can view all votes" ON public.community_votes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own votes" ON public.community_votes
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_help_articles_category ON public.help_articles(category);
CREATE INDEX idx_help_articles_featured ON public.help_articles(featured);
CREATE INDEX idx_community_posts_category ON public.community_posts(category);
CREATE INDEX idx_community_posts_author ON public.community_posts(author_id);
CREATE INDEX idx_community_replies_post ON public.community_replies(post_id);
CREATE INDEX idx_community_votes_post ON public.community_votes(post_id);
CREATE INDEX idx_community_votes_reply ON public.community_votes(reply_id);

-- Create function to update view count
CREATE OR REPLACE FUNCTION increment_view_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'help_articles' THEN
    UPDATE public.help_articles 
    SET view_count = view_count + 1 
    WHERE id = NEW.id;
  ELSIF TG_TABLE_NAME = 'community_posts' THEN
    UPDATE public.community_posts 
    SET view_count = view_count + 1 
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle vote updates
CREATE OR REPLACE FUNCTION update_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'upvote' THEN
      IF NEW.post_id IS NOT NULL THEN
        UPDATE public.community_posts SET upvotes = upvotes + 1 WHERE id = NEW.post_id;
      ELSIF NEW.reply_id IS NOT NULL THEN
        UPDATE public.community_replies SET upvotes = upvotes + 1 WHERE id = NEW.reply_id;
      END IF;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'upvote' THEN
      IF OLD.post_id IS NOT NULL THEN
        UPDATE public.community_posts SET upvotes = upvotes - 1 WHERE id = OLD.post_id;
      ELSIF OLD.reply_id IS NOT NULL THEN
        UPDATE public.community_replies SET upvotes = upvotes - 1 WHERE id = OLD.reply_id;
      END IF;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_help_articles_updated_at
  BEFORE UPDATE ON public.help_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_replies_updated_at
  BEFORE UPDATE ON public.community_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER community_vote_counts_trigger
  AFTER INSERT OR DELETE ON public.community_votes
  FOR EACH ROW EXECUTE FUNCTION update_vote_counts();