# Troubleshooting: Blank Admin Pages 🔧

## Issue: Admin pages show blank/white screen

This happens when:
1. Vercel hasn't deployed the latest code yet
2. Supabase environment variables are missing in Vercel
3. JavaScript errors in the browser console

---

## ✅ Solution Steps

### Step 1: Check Vercel Deployment

1. **Go to:** https://vercel.com/dashboard
2. **Click** your **fleur-finds** project
3. **Go to Deployments tab**
4. **Look for these commits** (should be at the top):
   - "Add admin access guide"
   - "Add Vercel-Supabase connection guide"
   - "Add e-commerce functionality with products and promos management"

5. **If you don't see them:**
   - Click the **⋯ menu** on the latest deployment
   - Click **"Redeploy"**
   - Wait 1-2 minutes for it to complete

### Step 2: Verify Environment Variables

1. **In Vercel:** Settings → Environment Variables
2. **You MUST have these TWO variables:**

   ```
   NEXT_PUBLIC_SUPABASE_URL = https://jzkfwsezcphtwentgtsh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_k-9JrVBC2eRDZOaEainAfg_5-WlbU16
   ```

3. **Make sure:**
   - Both have ✓ Production, ✓ Preview, ✓ Development checked
   - No typos in the variable names
   - Values are correct (copy from Supabase)

4. **After adding/fixing variables:**
   - Go to Deployments
   - Redeploy the site

### Step 3: Check Browser Console

When you visit `/admin/login` and see a blank page:

1. **Press F12** or **Right-click → Inspect**
2. **Go to Console tab**
3. **Look for errors** (usually red text)

**Common errors:**

**"Failed to fetch" or "Network error"**
- Environment variables are wrong
- Supabase URL is incorrect

**"Invalid API key"**
- ANON_KEY is wrong
- Copy it again from Supabase Settings → API Keys

**"404 Not Found"**
- Admin pages not deployed yet
- Redeploy on Vercel

### Step 4: Clear Cache and Hard Reload

Sometimes browsers cache old versions:

1. **On your Vercel site**, press:
   - **Windows/Linux:** `Ctrl + Shift + R`
   - **Mac:** `Cmd + Shift + R`

2. Or clear browser cache:
   - Chrome: Settings → Privacy → Clear browsing data
   - Check "Cached images and files"
   - Click "Clear data"

---

## 🧪 Test Locally First

To verify everything works:

1. **In your terminal:**
   ```bash
   cd /Users/jirehb.custodio/Flowertown_web
   npm run dev
   ```

2. **Open browser:** http://localhost:3000/admin/login

3. **If it works locally but not on Vercel:**
   - Problem is with Vercel deployment or environment variables
   - Follow Steps 1-2 above

4. **If it's blank locally too:**
   - Check terminal for errors
   - Check browser console (F12)

---

## 📋 Complete Checklist

Work through this in order:

### A. GitHub & Vercel
- [ ] Latest code is on GitHub (check: https://github.com/egcustodio/fleur-finds)
- [ ] Vercel shows recent deployments (within last hour)
- [ ] Deployment status is "Ready" (green checkmark)
- [ ] Can visit your main site homepage (shows products)

### B. Supabase Setup
- [ ] Ran `supabase-setup.sql` in Supabase SQL Editor
- [ ] Tables exist: products, promos, stories (check Table Editor)
- [ ] Sample products visible in products table (6 rows)

### C. Vercel Environment Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` exists
- [ ] Value is `https://jzkfwsezcphtwentgtsh.supabase.co`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` exists
- [ ] Value is `sb_publishable_k-9JrVBC2eRDZOaEainAfg_5-WlbU16`
- [ ] Both checked for Production, Preview, Development
- [ ] Redeployed after adding variables

### D. Admin Access
- [ ] Created admin user in Supabase Authentication
- [ ] User is auto-confirmed (email confirmed)
- [ ] Have correct email and password

### E. Browser
- [ ] Cleared cache (Ctrl+Shift+R or Cmd+Shift+R)
- [ ] No JavaScript errors in console (F12)
- [ ] Can access /admin/login (not 404)

---

## 🔍 What You Should See

### On `/admin/login` (when working):
- Fleur Finds logo/branding
- "Admin Login" heading
- Email input field
- Password input field
- "Sign In" button
- Soft colors (dusty rose/greige palette)

### If you see blank white page:
- Open Console (F12)
- Screenshot any errors
- Check the steps above

---

## 💡 Quick Fixes

### Fix 1: Redeploy Vercel
```
1. Vercel Dashboard → Your Project
2. Deployments tab
3. Click ⋯ on latest
4. Click "Redeploy"
```

### Fix 2: Add Environment Variables
```
1. Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add the two NEXT_PUBLIC variables
4. Redeploy
```

### Fix 3: Update .env.local Locally
If testing locally, create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://jzkfwsezcphtwentgtsh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_k-9JrVBC2eRDZOaEainAfg_5-WlbU16
```

---

## 🆘 Still Blank?

**Share this info:**
1. Vercel deployment URL
2. Browser console errors (screenshot)
3. Which step failed in the checklist above

**Quick test:**
Visit your homepage first - do you see the 6 sample products?
- ✅ YES → Environment variables work, admin pages might not be deployed
- ❌ NO → Environment variables issue or database not set up

---

**Most common cause: Environment variables not added to Vercel or Vercel needs to redeploy!** 🚀
