-- Add missing foreign key constraints to fix admin panel data fetching

-- Add foreign key constraint for books.user_id -> profiles.user_id
ALTER TABLE public.books 
ADD CONSTRAINT books_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add foreign key constraint for orders.user_id -> profiles.user_id  
ALTER TABLE public.orders 
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add foreign key constraint for orders.service_id -> services.id
ALTER TABLE public.orders 
ADD CONSTRAINT orders_service_id_fkey 
FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE RESTRICT;

-- Add foreign key constraint for reviews.book_id -> books.id
ALTER TABLE public.reviews 
ADD CONSTRAINT reviews_book_id_fkey 
FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;