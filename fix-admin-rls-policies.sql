-- Fix RLS Policies for Admin Functionality
-- Run this in your Supabase SQL Editor to ensure admin can add/edit/delete

-- Drop and recreate policies for authenticated users

-- PRODUCTS TABLE
DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.products;
CREATE POLICY "Authenticated users can insert products" ON public.products
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update products" ON public.products
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete products" ON public.products
    FOR DELETE TO authenticated USING (true);

-- STORIES TABLE
DROP POLICY IF EXISTS "Authenticated users can manage stories" ON public.stories;
CREATE POLICY "Authenticated users can insert stories" ON public.stories
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update stories" ON public.stories
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete stories" ON public.stories
    FOR DELETE TO authenticated USING (true);

-- STORY ITEMS TABLE
DROP POLICY IF EXISTS "Authenticated users can manage story items" ON public.story_items;
CREATE POLICY "Authenticated users can insert story_items" ON public.story_items
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update story_items" ON public.story_items
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete story_items" ON public.story_items
    FOR DELETE TO authenticated USING (true);

-- PROMOS TABLE
DROP POLICY IF EXISTS "Authenticated users can manage promos" ON public.promos;
CREATE POLICY "Authenticated users can insert promos" ON public.promos
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update promos" ON public.promos
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete promos" ON public.promos
    FOR DELETE TO authenticated USING (true);

-- SITE CONTENT TABLE
DROP POLICY IF EXISTS "Authenticated users can manage site content" ON public.site_content;
CREATE POLICY "Authenticated users can insert site_content" ON public.site_content
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update site_content" ON public.site_content
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete site_content" ON public.site_content
    FOR DELETE TO authenticated USING (true);

-- ORDERS TABLE
DROP POLICY IF EXISTS "Authenticated users can manage orders" ON public.orders;
CREATE POLICY "Authenticated users can update orders" ON public.orders
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete orders" ON public.orders
    FOR DELETE TO authenticated USING (true);

-- ORDER ITEMS TABLE
DROP POLICY IF EXISTS "Authenticated users can manage order items" ON public.order_items;
CREATE POLICY "Authenticated users can update order_items" ON public.order_items
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete order_items" ON public.order_items
    FOR DELETE TO authenticated USING (true);

-- PRODUCT REVIEWS TABLE
DROP POLICY IF EXISTS "Authenticated users can manage reviews" ON public.product_reviews;
CREATE POLICY "Authenticated users can update reviews" ON public.product_reviews
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete reviews" ON public.product_reviews
    FOR DELETE TO authenticated USING (true);

-- CONTACT INQUIRIES TABLE
DROP POLICY IF EXISTS "Authenticated users can manage inquiries" ON public.contact_inquiries;
CREATE POLICY "Authenticated users can update inquiries" ON public.contact_inquiries
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete inquiries" ON public.contact_inquiries
    FOR DELETE TO authenticated USING (true);

-- NEWSLETTER SUBSCRIBERS TABLE
DROP POLICY IF EXISTS "Authenticated users can manage subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Authenticated users can update subscribers" ON public.newsletter_subscribers
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete subscribers" ON public.newsletter_subscribers
    FOR DELETE TO authenticated USING (true);

-- Grant SELECT to authenticated users on all tables
GRANT SELECT ON public.products TO authenticated;
GRANT SELECT ON public.stories TO authenticated;
GRANT SELECT ON public.story_items TO authenticated;
GRANT SELECT ON public.promos TO authenticated;
GRANT SELECT ON public.site_content TO authenticated;
GRANT SELECT ON public.orders TO authenticated;
GRANT SELECT ON public.order_items TO authenticated;
GRANT SELECT ON public.product_reviews TO authenticated;
GRANT SELECT ON public.contact_inquiries TO authenticated;
GRANT SELECT ON public.newsletter_subscribers TO authenticated;
