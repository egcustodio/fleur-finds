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

-- Enable Row Level Security
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

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
        "address": "Magsaysay Avenue, Naga City 4400",
        "phone": "09171271659",
        "email": "flowertown1496@gmail.com",
        "phoneNote": "TEXT ONLY"
    }'),
    ('hours', '{
        "days": "Mon - Sun",
        "hours": "9:00 AM - 9:00 PM"
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
