# 🔧 Fix Payment Columns Error

## Error Message
```
ERROR: 42703: column "payment_intent_id" does not exist
```

## Solution: Add Payment Columns to Database

### Step 1: Open Supabase SQL Editor

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your **Flowertown** project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run This SQL

Copy and paste this SQL and click **Run**:

```sql
-- Add payment tracking columns to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS paymongo_payment_id TEXT;

-- Add indexes for faster payment lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent ON orders(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_paymongo_payment ON orders(paymongo_payment_id);
```

### Step 3: Verify Columns Were Added

Run this verification query:

```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND column_name IN ('payment_status', 'payment_method', 'payment_intent_id', 'paymongo_payment_id')
ORDER BY column_name;
```

You should see 4 rows returned:
- ✅ payment_intent_id (text)
- ✅ payment_method (text)
- ✅ payment_status (text, default: 'pending')
- ✅ paymongo_payment_id (text)

### Step 4: Refresh Your Website

After running the SQL, refresh your website at http://localhost:3000

The error should be gone! ✅

---

## Why This Happened

The `supabase-setup.sql` file was updated with payment columns, but your **existing database** still has the old schema. This migration adds the missing columns to your live database.

---

## Alternative: Reset Database (⚠️ Warning: Deletes All Data)

If you want to start fresh with the complete schema:

1. In Supabase dashboard, go to **Database** → **Tables**
2. Delete all tables
3. Go to **SQL Editor**
4. Run the entire `supabase-setup.sql` file

**Note:** This will delete all existing orders, products, and data!

---

## What These Columns Do

- **payment_status** - Tracks if payment is pending, paid, or failed
- **payment_method** - Records which method was used (card, gcash, paymaya)
- **payment_intent_id** - PayMongo payment intent reference
- **paymongo_payment_id** - PayMongo transaction ID

---

**Need Help?** Run the SQL above in Supabase SQL Editor and the error will be fixed!
