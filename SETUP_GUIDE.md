# Flowertown PH - Complete Setup Guide

## 🎯 What You'll Build

A **premium, full-stack flower shop website** with:
- Instagram-style Stories feature
- Complete admin panel (like Wix)
- Supabase authentication
- Full content management system
- Premium, minimalist design

---

## 📋 Step-by-Step Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** (Sign up if needed)
3. Create a new organization (or use existing)
4. Click **"New Project"**
   - Name: `flowertown-ph`
   - Database Password: (save this securely)
   - Region: Choose closest to Philippines
   - Click **"Create new project"**

### Step 2: Setup Database

1. Wait for project to finish setting up (2-3 minutes)
2. Go to **SQL Editor** in left sidebar
3. Click **"New Query"**
4. Copy entire contents of `supabase-setup.sql` file
5. Paste and click **"Run"**
6. You should see: "Success. No rows returned"

### Step 3: Get API Keys

1. Go to **Project Settings** (gear icon bottom left)
2. Click **"API"** in the sidebar
3. Copy these values:
   - **Project URL** (starts with https://...)
   - **anon/public** key (long string starting with eyJ...)
   - **service_role** key (long string, below anon key)

### Step 4: Configure Environment

1. In your project root, create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key...
```

2. Replace the values with your keys from Step 3

### Step 5: Create Admin User

1. In Supabase, go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter:
   - Email: `admin@flowertown.ph` (or your email)
   - Password: Choose a strong password
   - **Check "Auto Confirm User"**
4. Click **"Create user"**

### Step 6: Enable Storage (for Images)

1. Go to **Storage** in Supabase sidebar
2. You should see a bucket called `flowers` (created by SQL script)
3. If not, click **"New bucket"**:
   - Name: `flowers`
   - Public bucket: **Yes**
   - Click **"Create"**

### Step 7: Test the Website

1. Start development server:
```bash
npm run dev
```

2. Visit `http://localhost:3000`
   - You should see the homepage with Stories section

3. Visit `http://localhost:3000/admin/login`
   - Login with admin credentials
   - You should see the dashboard

---

## 🎨 Customizing Your Site

### Adding Stories

1. Login to admin panel
2. Go to **Stories** tab
3. Click **"Add Story"**
4. Upload cover image
5. Add title (e.g., "Wedding Bouquets")
6. Click into story to add individual slides

### Editing Homepage Content

1. In admin panel, go to **Content** tab
2. Edit hero text, about section, contact info
3. Changes save automatically

### Upload Images

- All images stored in Supabase Storage
- Automatic optimization and CDN delivery
- Supports: JPG, PNG, WebP

---

## 🚀 Going Live

### Deploy to Vercel (Free)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **"Import Project"**
4. Select your GitHub repo
5. Add environment variables (same as .env.local)
6. Click **"Deploy"**
7. Done! Your site is live 🎉

### Custom Domain

1. In Vercel, go to project **Settings** → **Domains**
2. Add your domain (e.g., flowertown.ph)
3. Update DNS records (Vercel provides instructions)
4. SSL certificate auto-configured

---

## 📱 Features Overview

### Customer Features
✅ Instagram Stories (swipeable highlights)
✅ Product categories with images  
✅ Contact form with validation
✅ Newsletter subscription
✅ Mobile-responsive design
✅ Fast page loads (<2s)
✅ SEO optimized

### Admin Features
✅ Secure login (Supabase Auth)
✅ Stories manager (add/edit/delete)
✅ Content editor (all text)
✅ Image uploader
✅ Settings panel
✅ Real-time updates

---

## 🆘 Troubleshooting

### "Cannot connect to Supabase"
- Check .env.local has correct keys
- Restart dev server after adding .env.local
- Verify Supabase project is active

### "Stories not showing"
- Run SQL setup script in Supabase
- Check browser console for errors
- Verify .env.local is in project root

### "Admin login not working"
- Verify user created in Supabase Auth
- Check "Auto Confirm User" was enabled
- Try resetting password in Supabase

### Build errors
```bash
rm -rf .next
npm install
npm run build
```

---

## 📞 Support

Need help? Contact:
- **Email**: flowertown1496@gmail.com
- **Phone**: 09171271659

---

## 🎉 You're All Set!

Your premium flower shop website is ready to impress customers and make sales easier than ever.

**Next steps:**
1. Add your real flower photos
2. Customize text and branding
3. Test on mobile devices
4. Share with customers!

Happy selling! 🌸
