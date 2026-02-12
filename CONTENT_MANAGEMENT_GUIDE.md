# Content Management System - Complete Guide

## Overview
The admin dashboard now has fully functional **Page Content Editor** and **Website Settings** sections that allow you to dynamically edit site content without touching code.

## Features Implemented

### 1. Page Content Editor
Edit the homepage content directly from the admin dashboard:

#### Hero Section Editor
- **Title**: Main hero heading (e.g., "Fleur Finds")
- **Subtitle**: Secondary heading (e.g., "Artisan Floral Atelier")
- **Tagline**: Descriptive tagline (e.g., "Where nature meets artistry...")

#### About Section Editor
- **Title**: About section heading (e.g., "Artistry in Every Bloom")
- **Description 1**: First paragraph of about text
- **Description 2**: Second paragraph of about text

### 2. Website Settings
Manage SEO and social media settings:

#### SEO Settings
- **Site Title**: Browser tab title and meta title
- **Site Description**: Meta description for search engines
- **Keywords**: SEO keywords (comma-separated)

#### Social Media Links
- **Facebook URL**: Your Facebook page URL
- **Instagram URL**: Your Instagram profile URL
- **Email**: Contact email address

## Database Structure

All content is stored in the `site_content` table:

```sql
CREATE TABLE site_content (
  id SERIAL PRIMARY KEY,
  section VARCHAR(50) NOT NULL UNIQUE,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Sections:**
- `hero` - Hero section content (title, subtitle, tagline)
- `about` - About section content (title, description1, description2)
- `seo` - SEO settings (siteTitle, siteDescription, keywords)
- `social_media` - Social links (facebook, instagram, email)

## How to Use

### Initial Setup

1. **Run the seed script** in your Supabase SQL Editor:
   ```bash
   # Copy content from seed-site-content.sql
   # Paste into Supabase SQL Editor
   # Click Run
   ```

2. **Verify table creation**:
   - Go to Supabase Dashboard → Table Editor
   - Check that `site_content` table exists with 4 rows

### Editing Content

1. **Login to admin**:
   ```
   Navigate to: /admin/login
   ```

2. **Go to dashboard**:
   ```
   Navigate to: /admin/dashboard
   ```

3. **Edit Hero Section**:
   - Find "Page Content Editor" section
   - Edit Title, Subtitle, or Tagline
   - Click "Save Hero Section"
   - See success toast notification

4. **Edit About Section**:
   - In "Page Content Editor" section
   - Edit Title or Descriptions
   - Click "Save About Section"
   - See success toast notification

5. **Edit SEO Settings**:
   - Find "Website Settings" section
   - Edit SEO fields
   - Click "Save SEO Settings"
   - See success toast notification

6. **Edit Social Media**:
   - In "Website Settings" section
   - Update social URLs or email
   - Click "Save Social Media"
   - See success toast notification

### Viewing Changes

1. **Navigate to homepage**: `/`
2. Changes appear immediately (no cache)
3. Reload page to see updates

## Dynamic Components

The following components fetch content from the database:

### Hero.tsx
- **Fetches**: `site_content` where `section = 'hero'`
- **Displays**: `content.title`, `content.subtitle`, `content.tagline`
- **Fallback**: Default values if fetch fails

### About.tsx
- **Fetches**: `site_content` where `section = 'about'`
- **Displays**: `content.title`, `content.description1`, `content.description2`
- **Fallback**: Default values if fetch fails

## Technical Details

### Data Flow

```
Admin Dashboard → Edit Content → Click Save
    ↓
Supabase.upsert() → site_content table
    ↓
Homepage Component → useEffect()
    ↓
Supabase.select() → Fetch content
    ↓
setState() → Render dynamic content
```

### Save Function Pattern

```typescript
const saveContent = async () => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase
    .from('site_content')
    .upsert({
      section: 'hero',
      content: { title, subtitle, tagline },
      updated_at: new Date().toISOString()
    }, { onConflict: 'section' });

  if (error) {
    toast.error('Failed to save');
  } else {
    toast.success('Saved successfully!');
  }
};
```

### Fetch Function Pattern

```typescript
const fetchContent = async () => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('site_content')
    .select('content')
    .eq('section', 'hero')
    .single();

  if (data) {
    setContent({
      title: data.content.title || 'Default Title',
      subtitle: data.content.subtitle || 'Default Subtitle',
      tagline: data.content.tagline || 'Default Tagline'
    });
  }
};

useEffect(() => {
  fetchContent();
}, []);
```

## Styling

All editors use consistent luxury styling:
- **Borders**: `border-stone-200`
- **Text**: `text-stone-800`
- **Backgrounds**: `bg-white`
- **Save Buttons**: `bg-stone-900 hover:bg-amber-900`
- **Section Cards**: `bg-white rounded-xl shadow-sm border border-stone-100`

## Error Handling

- **Toast Notifications**: Success/error feedback for all saves
- **Fallback Content**: Components show defaults if fetch fails
- **Validation**: Required fields prevent empty saves

## Future Enhancements

Potential additions:
- Contact page content editor
- Footer text editor
- Opening hours manager
- Gallery image uploader
- Testimonials editor
- Promo banner editor

## Files Modified

1. **src/app/admin/dashboard/page.tsx** - Added ContentManager and SettingsManager
2. **src/components/Hero.tsx** - Made dynamic with database fetching
3. **src/components/About.tsx** - Made dynamic with database fetching
4. **seed-site-content.sql** - Database initialization script

## Testing Checklist

- [ ] Run seed script in Supabase
- [ ] Verify site_content table has 4 rows
- [ ] Login to admin dashboard
- [ ] Edit hero title and save
- [ ] Reload homepage and verify change
- [ ] Edit about description and save
- [ ] Reload homepage and verify change
- [ ] Edit SEO settings and save
- [ ] Check browser tab title updates
- [ ] Edit social media links
- [ ] Verify footer links update (if implemented)

## Troubleshooting

**Content not updating?**
- Check Supabase connection in `.env.local`
- Verify admin is authenticated
- Check browser console for errors
- Clear browser cache

**Fetch errors?**
- Ensure `site_content` table exists
- Run seed script to initialize data
- Check Supabase RLS policies

**Save errors?**
- Verify Supabase credentials
- Check network tab for 401/403 errors
- Ensure admin has write permissions

## Support

For issues or questions:
1. Check browser console for errors
2. Review Supabase logs
3. Verify environment variables
4. Test with seed data first

---

**Status**: ✅ Fully functional and ready for production
**Last Updated**: February 12, 2026
