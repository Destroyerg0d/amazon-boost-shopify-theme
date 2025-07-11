-- Create user survey table
CREATE TABLE public.user_surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  writing_experience TEXT,
  previous_publishing TEXT,
  book_genres TEXT[],
  target_audience TEXT,
  marketing_budget TEXT,
  main_goals TEXT[],
  current_challenges TEXT[],
  book_status TEXT,
  how_did_you_hear TEXT,
  monthly_revenue_goal TEXT,
  primary_interest TEXT,
  additional_comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_surveys ENABLE ROW LEVEL SECURITY;

-- Create policies for user surveys
CREATE POLICY "Admins can view all surveys" 
ON public.user_surveys 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "Users can create their own survey" 
ON public.user_surveys 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own survey" 
ON public.user_surveys 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own survey" 
ON public.user_surveys 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_surveys_updated_at
BEFORE UPDATE ON public.user_surveys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();