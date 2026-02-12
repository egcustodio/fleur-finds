# Payment & Shipping Updates

## 🚀 New Features Implemented

### 1. **Flexible Payment Options**
Customers can now choose between:
- **50% Down Payment** - Pay half now, half later
- **100% Full Payment** - Pay the complete amount upfront

### 2. **Location-Based Shipping Fee**
- **FREE SHIPPING** for:
  - Naga City
  - Pili, Camarines Sur
- **₱100 Shipping Fee** for all other locations

### 3. **No Cash on Delivery (COD)**
- COD has been removed per seller requirement
- Minimum 50% down payment required for all orders
- Only bank transfer and online payment accepted

---

## 📋 How It Works

### Checkout Process

1. **Customer adds items to cart** and proceeds to checkout
2. **Enters delivery address**
   - System automatically calculates shipping fee
   - Shows "FREE 🎉" for Naga City/Pili
   - Shows "₱100" for other areas
3. **Reviews order summary** with:
   - Subtotal
   - Discount (if promo code applied)
   - Shipping Fee (or FREE)
   - Total

### Payment Selection

After order creation, customer chooses:

#### Option 1: Pay Online Now
1. Select payment amount:
   - **50% Down Payment** - Pay ₱X now, ₱X later
   - **Full Payment** - Pay ₱X now (no balance)
2. Choose payment method:
   - Credit/Debit Card
   - GCash
   - PayMaya
   - GrabPay
3. Complete payment via PayMongo
4. Receive instant confirmation

#### Option 2: Coordinate Payment
- No online payment
- Store contacts customer within 24 hours
- Arrange bank transfer (minimum 50% down payment)
- Schedule delivery after payment confirmation

---

## 🗄️ Database Changes

### New Columns Added to `orders` Table

```sql
shipping_fee         DECIMAL(10,2) DEFAULT 0      -- Shipping cost
payment_amount_type  TEXT DEFAULT 'full'          -- '50%' or 'full'
```

### Migration Required

Run this SQL in Supabase SQL Editor:

```sql
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS shipping_fee DECIMAL(10, 2) DEFAULT 0;

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_amount_type TEXT DEFAULT 'full';
```

Or use the file: `add-shipping-payment-columns.sql`

---

## 💻 Technical Implementation

### Shipping Fee Calculation

The system checks the delivery address for these keywords:

```typescript
const calculateShippingFee = (address: string) => {
  const lowerAddress = address.toLowerCase();
  const isNagaCity = lowerAddress.includes("naga city") || lowerAddress.includes("naga,");
  const isPili = lowerAddress.includes("pili") && lowerAddress.includes("camarines sur");
  
  if (isNagaCity || isPili) {
    return 0; // Free shipping
  }
  return 100; // ₱100 shipping fee
};
```

### Payment Amount Calculation

```typescript
const getPaymentAmount = () => {
  if (paymentAmountType === "50%") {
    return order.total * 0.5; // 50% down payment
  }
  return order.total; // Full payment
};
```

---

## 📦 Files Modified

### Frontend Components
- ✅ `src/app/checkout/page.tsx` - Added shipping calculation
- ✅ `src/app/payment/page.tsx` - Added payment amount selection
- ✅ `src/components/PaymentMethodSelector.tsx` - Updated to handle payment types
- ✅ `src/app/order-confirmation/page.tsx` - Shows payment breakdown

### Database
- ✅ `supabase-setup.sql` - Updated orders table schema
- ✅ `add-shipping-payment-columns.sql` - Migration file for existing databases

---

## 🎯 Customer Experience Examples

### Example 1: Naga City Customer - Full Payment
```
Cart Total:        ₱1,500.00
Discount:          -₱150.00 (WELCOME10)
Shipping Fee:      FREE 🎉
-----------------------------------
Total:             ₱1,350.00

Payment Option:    100% Full Payment
Amount to Pay Now: ₱1,350.00
Remaining Balance: ₱0.00
```

### Example 2: Manila Customer - 50% Down Payment
```
Cart Total:        ₱2,000.00
Discount:          ₱0.00
Shipping Fee:      ₱100.00
-----------------------------------
Total:             ₱2,100.00

Payment Option:    50% Down Payment
Amount to Pay Now: ₱1,050.00 (50%)
Remaining Balance: ₱1,050.00 (Pay later)
```

### Example 3: Pili Customer - Coordinate Payment
```
Cart Total:        ₱800.00
Discount:          ₱0.00
Shipping Fee:      FREE 🎉
-----------------------------------
Total:             ₱800.00

Payment Option:    Coordinate Payment
Next Steps:        Store will contact within 24hrs
                   Minimum 50% down payment required
                   Bank transfer only (No COD)
```

---

## ✅ Testing Checklist

Before going live, test these scenarios:

- [ ] **Naga City address** - Should show FREE shipping
- [ ] **Pili, Camarines Sur address** - Should show FREE shipping
- [ ] **Other location (e.g., Manila)** - Should show ₱100 shipping
- [ ] **50% payment option** - Should charge half the total
- [ ] **100% payment option** - Should charge full total
- [ ] **Manual payment mode** - Should show "No COD" warning
- [ ] **Order confirmation** - Shows correct payment breakdown
- [ ] **Admin orders page** - Displays payment_amount_type

---

## 🔐 Important Notes

### Payment Policy
- ❌ **NO Cash on Delivery (COD)**
- ✅ Minimum 50% down payment required
- ✅ Bank transfer accepted
- ✅ Online payment via PayMongo

### Shipping Policy
- ✅ Free shipping for Naga City and Pili, Camarines Sur
- ✅ ₱100 flat rate for all other areas within Philippines
- ✅ Automatic calculation based on delivery address

### Balance Payment
- For 50% down payment orders, customer pays remaining 50%:
  - Before delivery, OR
  - Upon delivery/pickup
- Store will coordinate final payment details

---

## 🆘 Support

If you encounter any issues:

1. Check database migration was applied
2. Verify shipping fee appears in checkout
3. Confirm payment options show correctly
4. Check order confirmation displays balance info

For technical support, review:
- `PAYMONGO_IMPLEMENTATION.md` - Payment setup
- `DATABASE_SETUP_GUIDE.md` - Database configuration
- `TROUBLESHOOTING.md` - Common issues
