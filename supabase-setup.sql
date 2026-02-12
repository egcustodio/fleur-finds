-- Stories table
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Story items table
CREATE TABLE IF NOT EXISTS public.story_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
    image TEXT NOT NULL,
    caption TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Products table (for e-commerce)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image TEXT,
    category TEXT,
    in_stock BOOLEAN DEFAULT true,
    quantity INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Promo/Discount table
CREATE TABLE IF NOT EXISTS public.promos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    discount_percentage INTEGER,
    discount_amount DECIMAL(10, 2),
    code TEXT UNIQUE,
    active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Site content table (for customizable content)
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section TEXT NOT NULL UNIQUE,
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT,
    notes TEXT,
    subtotal DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    promo_code TEXT,
    status TEXT DEFAULT 'pending',
    rental_start_date TIMESTAMP WITH TIME ZONE,
    rental_end_date TIMESTAMP WITH TIME ZONE,
    payment_status TEXT DEFAULT 'pending',
    payment_method TEXT,
    payment_intent_id TEXT,
    paymongo_payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add index for faster payment lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent ON public.orders(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_paymongo_payment ON public.orders(paymongo_payment_id);

-- Order items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    product_title TEXT NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Contact inquiries table
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    subscribed BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Product reviews table
CREATE TABLE IF NOT EXISTS public.product_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Wishlists table
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(session_id, product_id)
);

-- Rental bookings table
CREATE TABLE IF NOT EXISTS public.rental_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Stories are viewable by everyone" ON public.stories;
DROP POLICY IF EXISTS "Story items are viewable by everyone" ON public.story_items;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Active promos are viewable by everyone" ON public.promos;
DROP POLICY IF EXISTS "Site content is viewable by everyone" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated users can manage stories" ON public.stories;
DROP POLICY IF EXISTS "Authenticated users can manage story items" ON public.story_items;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can manage promos" ON public.promos;
DROP POLICY IF EXISTS "Authenticated users can manage site content" ON public.site_content;
DROP POLICY IF EXISTS "Orders are viewable by everyone" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Order items are viewable by everyone" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Contact inquiries are viewable by authenticated users" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.product_reviews;
DROP POLICY IF EXISTS "Anyone can submit reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Authenticated users can manage orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can manage order items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can manage inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Authenticated users can manage reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Anyone can submit inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated users can manage subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can add to wishlist" ON public.wishlists;
DROP POLICY IF EXISTS "Anyone can view wishlists" ON public.wishlists;
DROP POLICY IF EXISTS "Anyone can remove from wishlist" ON public.wishlists;
DROP POLICY IF EXISTS "Rental bookings viewable by authenticated" ON public.rental_bookings;
DROP POLICY IF EXISTS "Authenticated users can manage bookings" ON public.rental_bookings;

-- Policies for public read access
CREATE POLICY "Stories are viewable by everyone" ON public.stories
    FOR SELECT USING (true);

CREATE POLICY "Story items are viewable by everyone" ON public.story_items
    FOR SELECT USING (true);

CREATE POLICY "Products are viewable by everyone" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Active promos are viewable by everyone" ON public.promos
    FOR SELECT USING (active = true);

CREATE POLICY "Site content is viewable by everyone" ON public.site_content
    FOR SELECT USING (true);

-- Policies for authenticated users (admin) - full access
CREATE POLICY "Authenticated users can manage stories" ON public.stories
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage story items" ON public.story_items
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage products" ON public.products
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage promos" ON public.promos
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage site content" ON public.site_content
    FOR ALL USING (auth.role() = 'authenticated');

-- Orders policies
CREATE POLICY "Orders are viewable by everyone" ON public.orders
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create orders" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can manage orders" ON public.orders
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Order items are viewable by everyone" ON public.order_items
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create order items" ON public.order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can manage order items" ON public.order_items
    FOR ALL USING (auth.role() = 'authenticated');

-- Contact inquiries policies
CREATE POLICY "Anyone can submit inquiries" ON public.contact_inquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can manage inquiries" ON public.contact_inquiries
    FOR ALL USING (auth.role() = 'authenticated');

-- Newsletter policies
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can manage subscribers" ON public.newsletter_subscribers
    FOR ALL USING (auth.role() = 'authenticated');

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON public.product_reviews
    FOR SELECT USING (approved = true OR auth.role() = 'authenticated');

CREATE POLICY "Anyone can submit reviews" ON public.product_reviews
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can manage reviews" ON public.product_reviews
    FOR ALL USING (auth.role() = 'authenticated');

-- Wishlist policies
CREATE POLICY "Anyone can view wishlists" ON public.wishlists
    FOR SELECT USING (true);

CREATE POLICY "Anyone can add to wishlist" ON public.wishlists
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can remove from wishlist" ON public.wishlists
    FOR DELETE USING (true);

-- Rental bookings policies
CREATE POLICY "Rental bookings viewable by authenticated" ON public.rental_bookings
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage bookings" ON public.rental_bookings
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert default products (WITHOUT IMAGES - admin will add their own)
INSERT INTO public.products (title, description, price, category, featured, "order") VALUES
    ('Classic Rose Bouquet', 'Elegant arrangement of fresh red roses', 89.99, 'Fresh Flowers', true, 1),
    ('Wildflower Mix', 'Vibrant collection of seasonal wildflowers', 65.00, 'Fresh Flowers', true, 2),
    ('Dried Lavender Bundle', 'Fragrant dried lavender, long-lasting', 45.00, 'Dried Flowers', false, 3),
    ('Elegant Vase', 'Handcrafted ceramic vase, perfect for any bouquet', 55.00, 'Vases', false, 4),
    ('Custom Arrangement', 'Bespoke floral design for your special occasion', 120.00, 'Custom', true, 5),
    ('Sympathy Arrangement', 'Thoughtful white lilies and roses', 95.00, 'Sympathy', false, 6)
ON CONFLICT DO NOTHING;

-- Insert default site settings
INSERT INTO public.site_content (section, content) VALUES
    ('contact', '{
        "address": "Naga City & Pili, Camarines Sur",
        "phone": "09171271659",
        "email": "flowertown1496@gmail.com",
        "phoneNote": "TEXT ONLY"
    }'),
    ('hours', '{
        "days": "Mon - Sun",
        "hours": "9:00 AM - 9:00 PM"
    }'),
    ('bio', '{
        "tagline": "Rent • Rewear • Recreate",
        "description": "Discover the charm of Fleur Finds"
    }')
ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content;

-- Insert default stories (WITHOUT IMAGES - admin will add their own)
INSERT INTO public.stories (title, cover_image, "order") VALUES
    ('Fresh Flowers', '', 1),
    ('Dried Bouquets', '', 2),
    ('Vases & Gifts', '', 3),
    ('Custom Orders', '', 4),
    ('Events', '', 5)
ON CONFLICT DO NOTHING;

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('flowers', 'flowers', true)
ON CONFLICT DO NOTHING;

-- Drop existing storage policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- Storage policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'flowers');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'flowers' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON storage.objects FOR UPDATE USING (bucket_id = 'flowers' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE USING (bucket_id = 'flowers' AND auth.role() = 'authenticated');
