# ⚡ QUICK FIX - Payment Columns Error

## 🔴 ERROR YOU'RE SEEING
```
column "payment_intent_id" does not exist
```

## ✅ SOLUTION (2 Minutes)

### Copy This SQL:
```sql
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS paymongo_payment_id TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_payment_intent ON orders(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_paymongo_payment ON orders(paymongo_payment_id);
```

### Run It Here:
1. Open: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Paste the SQL above
6. Click **RUN** button
7. ✅ Done!

### Then:
- Refresh your website
- Error should be gone!

---

**That's it!** Your database now has the payment tracking columns.
