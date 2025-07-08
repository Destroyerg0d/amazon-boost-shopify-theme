-- First, let's see what triggers exist on the reviews table
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'reviews';