-- Add missing foreign key constraints one by one with error handling

-- First, check if books_user_id_fkey exists, if not create it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'books_user_id_fkey' 
        AND table_name = 'books'
    ) THEN
        ALTER TABLE public.books 
        ADD CONSTRAINT books_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint for orders.service_id -> services.id if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'orders_service_id_fkey' 
        AND table_name = 'orders'
    ) THEN
        ALTER TABLE public.orders 
        ADD CONSTRAINT orders_service_id_fkey 
        FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE RESTRICT;
    END IF;
END $$;

-- Add foreign key constraint for reviews.book_id -> books.id if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'reviews_book_id_fkey' 
        AND table_name = 'reviews'
    ) THEN
        ALTER TABLE public.reviews 
        ADD CONSTRAINT reviews_book_id_fkey 
        FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;
    END IF;
END $$;