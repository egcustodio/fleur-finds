# How to Access Your Admin Panel 🔐

## ✅ Your Admin Pages ARE Already Created and Pushed to GitHub!

All admin functionality exists. Here's what you have:

### 📁 Admin Pages:
- `/admin/login` - Admin login page
- `/admin/dashboard` - Main dashboard
- `/admin/products` - Product management (ADD/EDIT/DELETE)
- `/admin/promos` - Promo code management

---

## 🌐 Access on Your Live Site

### Step 1: Find Your Vercel URL
Go to https://vercel.com/dashboard and find your deployed site URL.
It looks like: `https://fleur-finds-xxx.vercel.app`

### Step 2: Visit Admin Login
```
https://your-site.vercel.app/admin/login
```

### Step 3: Create Admin Account First!

**Before you can log in, create an admin user in Supabase:**

1. Go to: https://supabase.com/dashboard/project/jzkfwsezcphtwentgtsh
2. Click **Authentication** → **Users**
3. Click **"Add User"**
4. Enter:
   - Email: `your-email@example.com`
   - Password: `StrongPassword123!`
   - ✅ Check **"Auto Confirm User"**
5. Click **"Create User"**

### Step 4: Log In
1. Visit `https://your-site.vercel.app/admin/login`
2. Enter your email and password
3. You'll be redirected to the dashboard!

---

## 🎯 What Each Admin Page Does

### `/admin/products`
- **Add products:** Click "Add Product" button
- **Edit products:** Click "Edit" on any product
- **Delete products:** Click trash icon
- **Fields:** Title, description, price, image URL, category, in stock, featured

### `/admin/promos`
- **Create discount codes:** Click "Add Promo"
- **Set discounts:** Percentage OR fixed amount
- **Dates:** Optional start/end dates
- **Toggle active/inactive:** One-click activation

---

## 🔍 Troubleshooting

### "404 on /admin/login"
- Make sure Vercel deployed the latest code
- Check Deployments tab in Vercel
- Trigger a redeploy if needed

### "Can't log in"
- Did you create a user in Supabase Authentication?
- Did you check "Auto Confirm User"?
- Try the password reset if needed

### "No products showing"
Run this in Supabase SQL Editor to add sample products:
1. Go to Supabase → SQL Editor
2. Copy all of `supabase-setup.sql`
3. Run it
4. This creates tables + 6 sample products

---

## 📋 Quick Setup Checklist

- [ ] Supabase environment variables added to Vercel
- [ ] Ran `supabase-setup.sql` in Supabase
- [ ] Created admin user in Supabase Authentication
- [ ] Vercel site deployed successfully
- [ ] Can access `/admin/login`

---

**Your admin panel is ready! Visit /admin/login on your live site!** 🚀
