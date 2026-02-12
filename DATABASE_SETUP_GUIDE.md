# 🔧 Complete Database Setup Guide

## Two Options to Fix Your Database

### Option 1: Just Add Payment Columns (Recommended - Keeps Existing Data)

This only adds the missing payment columns without affecting your existing data.

**Step 1:** Go to Supabase SQL Editor
- https://supabase.com/dashboard
- Select your project
- Click **SQL Editor** → **New Query**

**Step 2:** Run this SQL:
```sql
-- Add payment tracking columns
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS paymongo_payment_id TEXT;

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent ON orders(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_paymongo_payment ON orders(paymongo_payment_id);
```

**Step 3:** Verify it worked:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name LIKE 'payment%';
```

You should see 4 rows: payment_status, payment_method, payment_intent_id, paymongo_payment_id

✅ **Done! Your database now has payment support.**

---

### Option 2: Full Database Reset (⚠️ DELETES ALL DATA)

Only do this if you want to start completely fresh with the latest schema.

**Step 1:** Delete all existing tables
- Go to Supabase Dashboard → Database → Tables
- Delete each table one by one

**Step 2:** Run the complete setup
- Go to SQL Editor → New Query
- Open your `supabase-setup.sql` file
- Copy ALL the SQL (317 lines)
- Paste and click **RUN**

**Step 3:** Verify
- Check that all tables exist
- Check that default products are inserted

⚠️ **Warning:** This will delete all:
- Products
- Orders
- Stories
- Reviews
- Everything!

---

## After Running Either Option

1. **Refresh your website** at http://localhost:3000
2. **Test the checkout flow**
3. **Verify no more errors**

---

## Common Errors & Solutions

### "policy already exists"
**Solution:** The updated `supabase-setup.sql` now has all the DROP POLICY statements. Just run it again.

### "column already exists"
**Solution:** That's fine! The `IF NOT EXISTS` clause prevents errors. Column was already there.

### "permission denied"
**Solution:** Make sure you're running SQL in Supabase dashboard, not in your app code.

---

## Quick Test After Setup

Run this query to verify everything:

```sql
-- Check orders table has payment columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders'
ORDER BY column_name;
```

You should see:
- ✅ customer_email
- ✅ customer_name
- ✅ customer_phone
- ✅ delivery_address
- ✅ discount
- ✅ notes
- ✅ payment_intent_id ← NEW
- ✅ payment_method ← NEW
- ✅ payment_status ← NEW
- ✅ paymongo_payment_id ← NEW
- ✅ promo_code
- ✅ rental_end_date
- ✅ rental_start_date
- ✅ status
- ✅ subtotal
- ✅ total

---

**Recommendation:** Use **Option 1** if you have existing orders/products you want to keep!
