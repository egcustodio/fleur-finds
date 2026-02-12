# 🚀 Quick Setup Guide - Admin Fix

## Run These Steps in Order:

### Step 1: Fix Database Policies (REQUIRED)
Go to **Supabase Dashboard** → **SQL Editor** → Click **New Query**

Copy and paste this entire block, then click **Run**:

```sql
-- Fix RLS Policies for Admin Functionality
DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.products;
CREATE POLICY "Authenticated users can insert products" ON public.products
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update products" ON public.products
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete products" ON public.products
    FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage stories" ON public.stories;
CREATE POLICY "Authenticated users can insert stories" ON public.stories
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update stories" ON public.stories
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete stories" ON public.stories
    FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage promos" ON public.promos;
CREATE POLICY "Authenticated users can insert promos" ON public.promos
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update promos" ON public.promos
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete promos" ON public.promos
    FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage site content" ON public.site_content;
CREATE POLICY "Authenticated users can insert site_content" ON public.site_content
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update site_content" ON public.site_content
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete site_content" ON public.site_content
    FOR DELETE TO authenticated USING (true);
```

✅ You should see: **Success. No rows returned**

---

### Step 2: Initialize Site Content (If Not Done Yet)
Still in **SQL Editor**, run this:

```sql
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
```

✅ You should see rows inserted/updated

---

### Step 3: Test Admin Functionality

#### 3a. Login
1. Go to: `http://localhost:3000/admin/login`
2. Login with your admin credentials
3. ✅ Should redirect to dashboard

#### 3b. Test Products
1. Go to: `http://localhost:3000/admin/products`
2. Click **"Add Product"** button
3. Fill in:
   - Title: "Test Bouquet"
   - Description: "Beautiful flowers"
   - Price: 99.99
   - Category: "Bouquets"
   - Quantity: 10
4. Click **"Add Product"**
5. ✅ Should see green toast: "Product added successfully!"

#### 3c. Test Instagram Stories
1. Go to: `http://localhost:3000/admin/dashboard`
2. Ensure "Instagram Stories" tab is active
3. Click **"Add Story"** button
4. Fill in:
   - Story Title: "Wedding Special"
   - Cover Image URL: (paste any image URL)
   - Display Order: 1
5. Click **"Add Story"**
6. ✅ Should see green toast: "Story added successfully!"

#### 3d. Test Content Editor
1. Still in dashboard
2. Click **"Page Content"** tab
3. Edit Hero Title to something new
4. Click **"Save Hero Section"**
5. ✅ Should see: "Hero content saved successfully!"
6. Visit homepage to see changes

---

## ✅ Verification Checklist

- [ ] RLS policies updated in Supabase
- [ ] Site content initialized
- [ ] Can login to admin
- [ ] Can add products (see success toast)
- [ ] Can edit products
- [ ] Can delete products
- [ ] Can add Instagram stories
- [ ] Can edit stories
- [ ] Can delete stories
- [ ] Can save hero content
- [ ] Can save about content
- [ ] Can save SEO settings
- [ ] Can save social media links
- [ ] Changes appear on homepage

---

## 🐛 If Something Doesn't Work

### Error: "Please log in to..."
**Fix**: Logout and login again at `/admin/login`

### Error: "Error saving product/story"
**Fix**: 
1. Check browser console (F12)
2. Verify RLS policies were run (Step 1)
3. Make sure you're logged in

### No toast notifications
**Fix**: Hard refresh page (Cmd/Ctrl + Shift + R)

### Products/Stories not showing
**Fix**: 
1. Check Supabase → Table Editor
2. Verify `products` and `stories` tables exist
3. Check browser console for errors

---

## 📚 Documentation

For detailed information, see:
- `ADMIN_FUNCTIONALITY_FIX.md` - Complete fix documentation
- `CONTENT_MANAGEMENT_GUIDE.md` - Content management system guide
- `fix-admin-rls-policies.sql` - Full RLS policy fixes
- `seed-site-content.sql` - Full site content initialization

---

**All admin sections are now fully functional! 🎉**
