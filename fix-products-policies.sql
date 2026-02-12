-- Complete fix for product add/edit/delete issues
-- Run this in your Supabase SQL Editor

-- First, verify the products table exists with all required columns
DO $$ 
BEGIN
    -- Check if quantity column exists, add if not
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'quantity'
    ) THEN
        ALTER TABLE public.products ADD COLUMN quantity INTEGER DEFAULT 0;
    END IF;

    -- Check if in_stock column exists, add if not
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'in_stock'
    ) THEN
        ALTER TABLE public.products ADD COLUMN in_stock BOOLEAN DEFAULT true;
    END IF;

    -- Check if featured column exists, add if not
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'featured'
    ) THEN
        ALTER TABLE public.products ADD COLUMN featured BOOLEAN DEFAULT false;
    END IF;

    -- Check if order column exists, add if not
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'order'
    ) THEN
        ALTER TABLE public.products ADD COLUMN "order" INTEGER DEFAULT 0;
    END IF;
END $$;

-- Drop ALL existing policies for products table
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;

-- Enable RLS on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create new policies with proper permissions

-- 1. Allow everyone to SELECT (view) products
CREATE POLICY "Anyone can view products"
ON public.products
FOR SELECT
USING (true);

-- 2. Allow authenticated users to INSERT products
CREATE POLICY "Authenticated users can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. Allow authenticated users to UPDATE products
CREATE POLICY "Authenticated users can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. Allow authenticated users to DELETE products
CREATE POLICY "Authenticated users can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (true);

-- Grant necessary permissions to authenticated role
GRANT ALL ON public.products TO authenticated;
GRANT USAGE ON SEQUENCE products_id_seq TO authenticated;

-- Verify the policies were created
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;
