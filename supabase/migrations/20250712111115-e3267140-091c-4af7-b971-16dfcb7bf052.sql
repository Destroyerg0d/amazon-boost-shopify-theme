-- Enable real-time for review_plans table
ALTER TABLE review_plans REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE review_plans;