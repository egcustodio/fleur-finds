# Connect Supabase to Vercel 🚀

## Step 1: Get Your Supabase Credentials

1. **Go to your Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project (or create a new one)

2. **Get your Project URL and API Keys:**
   - Click on **Settings** (gear icon in sidebar)
   - Click on **API**
   - You'll see:
     - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
     - **anon/public key** (starts with `eyJhbGci...`)
     - **service_role key** (starts with `eyJhbGci...` - different from anon)

3. **Copy these values** - you'll need them in the next step!

---

## Step 2: Run the Database Setup SQL

Before connecting to Vercel, set up your database tables:

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase-setup.sql` from your project
4. Paste it into the SQL Editor
5. Click **Run** or press `Ctrl/Cmd + Enter`

✅ This creates:
- Products table with 6 sample products
- Promos table for discount codes
- Stories table for Instagram-style stories
- All security policies (RLS)
- Storage bucket for images

---

## Step 3: Add Environment Variables to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your **fleur-finds** project

2. **Navigate to Settings:**
   - Click **Settings** tab
   - Click **Environment Variables** in the left sidebar

3. **Add these variables ONE BY ONE:**

   **Variable 1:**
   - **Name:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** Your Project URL (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **Environment:** Check all: Production, Preview, Development
   - Click **Save**

   **Variable 2:**
   - **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** Your anon/public key (the long eyJhbGci... string)
   - **Environment:** Check all: Production, Preview, Development
   - Click **Save**

4. **Redeploy your site:**
   - Go to **Deployments** tab
   - Click the ⋯ menu on your latest deployment
   - Click **Redeploy**
   - Or just push a new commit to trigger auto-deploy

### Option B: Via Vercel CLI

If you have Vercel CLI installed:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your Supabase URL when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your anon key when prompted

# Redeploy
vercel --prod
```

---

## Step 4: Create Admin Account

You need a Supabase admin account to manage products and promos:

1. **Go to Supabase Dashboard → Authentication → Users**
2. **Click "Add User" or "Invite User"**
3. **Enter:**
   - Email: Your admin email
   - Password: Create a strong password
   - Check "Auto Confirm User" (so you don't need to verify email)
4. **Click "Create User"**

This account can now log in at `/admin/login` on your site!

---

## Step 5: Verify Everything Works

1. **Visit your deployed Vercel site**
2. **Check the homepage:**
   - You should see the 6 sample products displayed
   - If you see "Loading products..." forever or "No products available", check your environment variables

3. **Test Admin Login:**
   - Go to `https://your-site.vercel.app/admin/login`
   - Log in with the admin account you created
   - You should see the dashboard

4. **Test Product Management:**
   - Click "Products" in the admin sidebar
   - You should see the 6 sample products
   - Try adding a new product
   - Check if it appears on the homepage

---

## Troubleshooting

### Products not showing on homepage?

**Check environment variables:**
```bash
# In your Vercel dashboard, verify:
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci... (long string)
```

**Check browser console:**
- Open your site
- Press F12 or right-click → Inspect
- Go to Console tab
- Look for errors related to Supabase

### Can't log in to admin?

1. **Verify user was created** in Supabase → Authentication → Users
2. **Check email confirmation** - make sure you checked "Auto Confirm User"
3. **Try password reset** if needed

### Database queries failing?

1. **Verify SQL was run** - Go to Supabase → Table Editor
2. You should see tables: `products`, `promos`, `stories`, `story_items`, `site_content`
3. Click `products` table - you should see 6 sample products

### Still having issues?

**Check Vercel deployment logs:**
1. Go to Vercel Dashboard → Deployments
2. Click on your latest deployment
3. Check the **Runtime Logs** for errors

---

## Optional: Set Up Storage for Product Images

If you want to upload product images directly (instead of using external URLs):

1. **In Supabase Dashboard → Storage**
2. You should see a `flowers` bucket (created by the SQL script)
3. Click on it
4. **Upload test images** by dragging files
5. Click on an image → Click "Get URL" → Copy the public URL
6. Use this URL in your product's "Image URL" field in the admin panel

---

## Quick Reference Card

### Your Credentials (keep these safe!)

```
Supabase Project URL: https://_____________________.supabase.co
Supabase Anon Key: eyJhbGci_________________________________
Admin Email: _______________________________________
Admin Password: _______________________________________
```

### Important URLs

- **Supabase Dashboard:** https://supabase.com/dashboard
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Your Site:** https://your-site.vercel.app
- **Admin Login:** https://your-site.vercel.app/admin/login
- **Product Manager:** https://your-site.vercel.app/admin/products
- **Promo Manager:** https://your-site.vercel.app/admin/promos

---

## Success Checklist ✅

- [ ] Supabase project created
- [ ] Got Project URL and Anon Key
- [ ] Ran `supabase-setup.sql` in SQL Editor
- [ ] Added environment variables to Vercel
- [ ] Redeployed Vercel site
- [ ] Created admin user in Supabase
- [ ] Can see products on homepage
- [ ] Can log in to `/admin/login`
- [ ] Can add/edit products in admin panel
- [ ] Can create promo codes

---

**Once all checkboxes are complete, your e-commerce flower shop is fully live! 🌸✨**
