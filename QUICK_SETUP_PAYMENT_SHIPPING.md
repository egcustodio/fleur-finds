# ✅ Quick Setup: Payment & Shipping Features

## 🎯 What Was Added

### Payment Options
- ✅ **50% Down Payment** - Customer pays half now, half later
- ✅ **100% Full Payment** - Customer pays complete amount
- ✅ **No COD** - Removed as per your requirement

### Shipping Fee
- ✅ **FREE** for Naga City and Pili, Camarines Sur
- ✅ **₱100** for all other locations

---

## 🚀 Setup Steps (DO THIS NOW)

### Step 1: Update Database
Run this SQL in Supabase (https://supabase.com/dashboard):

```sql
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS shipping_fee DECIMAL(10, 2) DEFAULT 0;

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_amount_type TEXT DEFAULT 'full';
```

**Quick way:** Copy the SQL from `add-shipping-payment-columns.sql` file

### Step 2: Test the Features
1. Go to your website
2. Add products to cart
3. Proceed to checkout
4. Enter different addresses to test shipping:
   - Try "123 Main St, Naga City" → Should show FREE shipping
   - Try "456 Road, Pili, Camarines Sur" → Should show FREE shipping  
   - Try "789 Ave, Manila" → Should show ₱100 shipping
5. Continue to payment page
6. You should see two payment amount options:
   - 50% Down Payment
   - 100% Full Payment

---

## 📋 How Customers Will See It

### At Checkout
```
Subtotal:       ₱1,500.00
Discount:       -₱150.00
Shipping Fee:   FREE 🎉  (or ₱100.00)
─────────────────────────
Total:          ₱1,350.00
```

### At Payment Selection
```
Choose Payment Amount:

○ 50% Down Payment
  Pay ₱675.00 now
  Balance: ₱675.00 - Pay later

● 100% Full Payment  
  Pay ₱1,350.00 now
  ✓ Complete payment • No balance
```

---

## ⚠️ Important Notes

1. **No COD Available**
   - Manual payment option now says "Bank transfer only - No COD"
   - Minimum 50% down payment required

2. **Shipping Calculation**
   - Automatically detects "naga city" or "pili" in address
   - Case-insensitive matching
   - If customer enters "Naga City" or "NAGA CITY" → FREE shipping

3. **Balance Payment**
   - For 50% orders, customer pays remaining 50% later
   - Order confirmation shows payment breakdown
   - Admin can see payment_amount_type in orders

---

## 🧪 Test Checklist

- [ ] Database columns added (run SQL above)
- [ ] Checkout shows shipping fee correctly
- [ ] Naga City address = FREE shipping
- [ ] Pili address = FREE shipping
- [ ] Other address = ₱100 shipping
- [ ] Payment page shows 50% and 100% options
- [ ] 50% option calculates correctly
- [ ] Order confirmation shows balance info
- [ ] Manual payment mentions "No COD"

---

## 📖 Full Documentation

For complete details, see: **PAYMENT_SHIPPING_UPDATE.md**

Ready to test! 🎉
