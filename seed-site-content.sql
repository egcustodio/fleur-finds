-- Seed initial site content for dynamic editing
-- Run this in your Supabase SQL editor

-- Create site_content table if it doesn't exist
CREATE TABLE IF NOT EXISTS site_content (
  id SERIAL PRIMARY KEY,
  section VARCHAR(50) NOT NULL UNIQUE,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Hero section content
INSERT INTO site_content (section, content) 
VALUES ('hero', jsonb_build_object(
  'title', 'Fleur Finds',
  'subtitle', 'Artisan Floral Atelier',
  'tagline', 'Where nature meets artistry in timeless arrangements'
))
ON CONFLICT (section) DO UPDATE 
SET content = EXCLUDED.content, updated_at = NOW();

-- Insert About section content
INSERT INTO site_content (section, content)
VALUES ('about', jsonb_build_object(
  'title', 'Artistry in Every Bloom',
  'description1', 'We believe flowers are more than decoration—they are an expression of emotion, a celebration of beauty, and a testament to nature''s artistry. Each arrangement is thoughtfully composed with premium blooms sourced from the world''s finest growers and crafted with meticulous attention to detail.',
  'description2', 'Our bespoke service caters to discerning clients who appreciate refined aesthetics and uncompromising quality. Every creation tells a story of elegance, crafted to elevate moments into lasting memories.'
))
ON CONFLICT (section) DO UPDATE 
SET content = EXCLUDED.content, updated_at = NOW();

-- Insert SEO settings
INSERT INTO site_content (section, content)
VALUES ('seo', jsonb_build_object(
  'siteTitle', 'Fleur Finds - Luxury Floral Atelier',
  'siteDescription', 'Premium artisan floral arrangements crafted with meticulous attention to detail. Bespoke service for discerning clients who appreciate refined aesthetics.',
  'keywords', 'luxury flowers, artisan florals, premium bouquets, bespoke floral design, wedding flowers, event florals'
))
ON CONFLICT (section) DO UPDATE 
SET content = EXCLUDED.content, updated_at = NOW();

-- Insert Social Media links
INSERT INTO site_content (section, content)
VALUES ('social_media', jsonb_build_object(
  'facebook', 'https://facebook.com/fleurfinds',
  'instagram', 'https://instagram.com/fleurfinds',
  'email', 'hello@fleurfinds.com'
))
ON CONFLICT (section) DO UPDATE 
SET content = EXCLUDED.content, updated_at = NOW();
