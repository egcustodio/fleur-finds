# 🎛️ Admin Shipping Settings Guide

## ✨ What's New

You can now **edit shipping fees directly from the Admin Dashboard** - no code changes needed!

---

## 🚀 How to Access

1. Go to your website's admin panel
2. Click **"Settings"** in the sidebar
3. Scroll down to **"Shipping Settings"** section

---

## ⚙️ Settings You Can Change

### 1. **Default Shipping Fee**
- This is the standard shipping cost for customers
- **Current Default:** ₱100
- **How to change:**
  1. Type the new amount in the "Default Shipping Fee" field
  2. Click "Save Shipping Settings"

### 2. **Free Shipping Locations**
- Add cities/areas that get FREE shipping
- **Current locations:** Naga City, Pili Camarines Sur

**To add a location:**
1. Type the city name (e.g., "Manila", "Quezon City")
2. Click "Add"
3. Click "Save Shipping Settings"

**To remove a location:**
1. Click "Remove" next to the location
2. Click "Save Shipping Settings"

---

## 💡 How It Works

When a customer checks out:

1. **Customer enters delivery address:**
   - "123 Main St, Naga City" → System detects "naga city"
   - Result: FREE shipping ✅

2. **System checks free shipping list:**
   - If address contains any location from your list → FREE
   - If not found → Charges default fee (₱100)

3. **Total is calculated:**
   ```
   Subtotal:       ₱1,500
   Shipping:       FREE 🎉  (or ₱100)
   ───────────────────────
   Total:          ₱1,500
   ```

---

## 📋 Examples

### Example 1: Change Shipping Fee to ₱150
```
Before: ₱100 for non-free areas
After:  ₱150 for non-free areas

Steps:
1. Go to Admin → Settings
2. Change "Default Shipping Fee" to 150
3. Click "Save Shipping Settings"
```

### Example 2: Add Manila as Free Shipping
```
Before: Only Naga City & Pili get free shipping
After:  Naga City, Pili, AND Manila get free shipping

Steps:
1. Go to Admin → Settings
2. Type "manila" in the location field
3. Click "Add"
4. Click "Save Shipping Settings"
```

### Example 3: Offer Free Shipping Nationwide
```
Option 1: Set default fee to 0
Option 2: Add all major cities to free shipping list

Steps for Option 1:
1. Change "Default Shipping Fee" to 0
2. Click "Save Shipping Settings"
```

---

## 🎯 Use Cases

### Promo: Free Shipping Weekend
1. Set default fee to **0**
2. Weekend ends? Change back to **100**

### Expand Free Shipping Areas
Add more locations:
- Manila
- Quezon City
- Makati
- Pasig
- Taguig
- etc.

### Different Fees for Different Regions
**Current limitation:** Only one default fee

**Workaround:** 
- Add major cities to free shipping list
- Set higher default fee for provinces

---

## 🔧 Database Setup (One-Time)

**First time setup?** Run this SQL in Supabase:

```sql
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS shipping_fee DECIMAL(10, 2) DEFAULT 0;

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_amount_type TEXT DEFAULT 'full';

INSERT INTO public.site_content (section, content) VALUES
    ('shipping', '{
        "defaultFee": 100,
        "freeShippingLocations": ["naga city", "pili, camarines sur"]
    }')
ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content;
```

Or copy from file: `add-shipping-payment-columns.sql`

---

## ✅ Testing

After changing settings:

1. **Test free shipping:**
   - Add items to cart
   - Enter "123 St, Naga City" as address
   - Should show "FREE 🎉"

2. **Test paid shipping:**
   - Add items to cart  
   - Enter "456 Ave, Manila" as address
   - Should show your default fee amount

---

## 🎨 Admin UI Preview

```
┌─────────────────────────────────────────┐
│ 🚚 Shipping Settings                    │
├─────────────────────────────────────────┤
│                                         │
│ Default Shipping Fee (₱)                │
│ ┌─────────────────────┐                │
│ │ 100                 │                 │
│ └─────────────────────┘                │
│ This fee applies to locations not       │
│ listed in free shipping areas           │
│                                         │
│ Free Shipping Locations                 │
│ ┌─────────────────────┬──────┐         │
│ │ Add location...     │ Add  │         │
│ └─────────────────────┴──────┘         │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ Naga City            [Remove]   │    │
│ │ Pili, Camarines Sur  [Remove]   │    │
│ └─────────────────────────────────┘    │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ 💾 Save Shipping Settings       │    │
│ └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

---

## 🆘 Troubleshooting

**Settings not saving?**
- Check database migration was run
- Verify you're logged in as admin
- Check browser console for errors

**Shipping fee not updating on checkout?**
- Settings are cached - refresh the checkout page
- Clear browser cache
- Check if location name matches exactly

**Free shipping not working?**
- Location name must be part of the address
- Not case-sensitive: "NAGA CITY" = "naga city"
- Check for typos in location names

---

## 📱 Customer Experience

### Before (Hardcoded):
- Admin can't change fees
- Need developer to update code
- Fixed at ₱100

### After (Editable):
- Admin changes fees anytime
- No developer needed ✅
- Fully flexible 🎉

---

## 🔐 Admin Only

Only authenticated admin users can:
- View Settings page
- Change shipping fees
- Add/remove free shipping locations

Customers cannot access or modify these settings.

---

**Need help?** Check the full documentation in `PAYMENT_SHIPPING_UPDATE.md`
