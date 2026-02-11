# 💳 Payment Gateway Setup Guide for Flowertown

This guide explains how to integrate payment gateways (PayMongo, PayMaya, GCash) into your Flowertown e-commerce website.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [PayMongo Setup](#paymongo-setup)
3. [PayMaya Setup](#paymaya-setup)
4. [GCash Setup](#gcash-setup)
5. [Implementation Guide](#implementation-guide)
6. [Environment Variables](#environment-variables)
7. [Testing & Going Live](#testing--going-live)

---

## 🎯 Overview

### Current Payment Flow
Currently, Flowertown operates as a **catalog website** where customers:
1. Browse products and add to cart
2. Fill out checkout form with delivery details
3. Submit order (saved to database)
4. Admin receives order notification
5. Admin contacts customer to arrange payment (bank transfer, cash on delivery, etc.)

### With Payment Gateway Integration
With payment gateways, the flow becomes:
1. Browse products and add to cart
2. Fill out checkout form
3. **Select payment method** (Credit Card, GCash, PayMaya, etc.)
4. **Process payment immediately**
5. Order automatically confirmed
6. Customer receives payment confirmation
7. Admin sees paid orders in dashboard

---

## 💰 PayMongo Setup

**PayMongo** is the most popular payment gateway in the Philippines, supporting credit/debit cards, GCash, and GrabPay.

### Step 1: Create PayMongo Account

1. Visit [https://paymongo.com](https://paymongo.com)
2. Click **"Sign Up"**
3. Fill in business details:
   - Business Name: **Flowertown**
   - Business Type: **Retail/E-commerce**
   - Email: **flowertown1496@gmail.com**
4. Verify your email
5. Complete KYC (Know Your Customer) requirements:
   - Submit valid ID (Government-issued)
   - Business registration documents (if registered)
   - Bank account details for payouts

### Step 2: Get API Keys

1. Log in to [PayMongo Dashboard](https://dashboard.paymongo.com)
2. Navigate to **"Developers"** → **"API Keys"**
3. You'll see two sets of keys:
   - **Test Keys** (for development/testing)
   - **Live Keys** (for production)

**Copy these keys:**
```
Test Public Key: pk_test_xxxxxxxxxxxxxxxxxxxxx
Test Secret Key: sk_test_xxxxxxxxxxxxxxxxxxxxx

Live Public Key: pk_live_xxxxxxxxxxxxxxxxxxxxx
Live Secret Key: sk_live_xxxxxxxxxxxxxxxxxxxxx
```

⚠️ **IMPORTANT:** Never expose your Secret Key in client-side code!

### Step 3: Enable Payment Methods

In PayMongo Dashboard:
1. Go to **"Settings"** → **"Payment Methods"**
2. Enable the methods you want:
   - ✅ **Credit/Debit Cards** (Visa, Mastercard)
   - ✅ **GCash** (E-wallet)
   - ✅ **GrabPay** (E-wallet)
   - ✅ **PayMaya** (E-wallet)

### Step 4: Set Up Webhooks

Webhooks notify your website when payments succeed/fail.

1. Go to **"Developers"** → **"Webhooks"**
2. Click **"Add Endpoint"**
3. Enter URL: `https://your-domain.vercel.app/api/paymongo/webhook`
4. Select events to listen to:
   - ✅ `payment.paid`
   - ✅ `payment.failed`
   - ✅ `source.chargeable`
5. Copy the **Webhook Secret** (starts with `whsec_`)

---

## 📱 PayMaya Setup

**PayMaya** is a popular e-wallet in the Philippines.

### Step 1: Create PayMaya Developer Account

1. Visit [https://developers.paymaya.com](https://developers.paymaya.com)
2. Click **"Sign Up"**
3. Create developer account
4. Submit business information

### Step 2: Get API Credentials

1. Log in to [PayMaya Developer Portal](https://developers.paymaya.com/dashboard)
2. Navigate to **"API Credentials"**
3. Copy:
   ```
   Sandbox Public Key: pk-xxxxxxxxxxxxxxxxxxxxx
   Sandbox Secret Key: sk-xxxxxxxxxxxxxxxxxxxxx
   
   Production Public Key: pk-xxxxxxxxxxxxxxxxxxxxx
   Production Secret Key: sk-xxxxxxxxxxxxxxxxxxxxx
   ```

### Step 3: Configure Webhooks

1. In Developer Portal, go to **"Webhooks"**
2. Add webhook URL: `https://your-domain.vercel.app/api/paymaya/webhook`
3. Select events:
   - ✅ `PAYMENT_SUCCESS`
   - ✅ `PAYMENT_FAILED`
   - ✅ `PAYMENT_EXPIRED`

---

## 💚 GCash Setup

**GCash** can be integrated via PayMongo (recommended) or direct GCash API.

### Option A: Via PayMongo (Recommended)
If you set up PayMongo, GCash is automatically included. No additional setup needed!

### Option B: Direct GCash Integration

1. Contact GCash Business Support: **business@gcash.com**
2. Request merchant account
3. Submit requirements:
   - Business registration
   - Valid ID
   - Bank account details
4. Wait for approval (1-2 weeks)
5. Receive API credentials

**Note:** For small businesses, PayMongo's GCash integration is easier and faster.

---

## 🛠️ Implementation Guide

### Install Dependencies

```bash
npm install @paymongo/paymongo-js
```

### Create Environment Variables

Add to `.env.local`:

```env
# PayMongo
NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
PAYMONGO_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
PAYMONGO_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx

# PayMaya
NEXT_PUBLIC_PAYMAYA_PUBLIC_KEY=pk-xxxxxxxxxxxxxxxxxxxxx
PAYMAYA_SECRET_KEY=sk-xxxxxxxxxxxxxxxxxxxxx

# Payment Settings
NEXT_PUBLIC_PAYMENT_MODE=test # or 'live' for production
```

### Update `.env.local` File

Create or update `/Users/jirehb.custodio/Flowertown_web/.env.local`:

```env
# Existing Supabase variables
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# PayMongo API Keys (Add these)
NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
PAYMONGO_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
PAYMONGO_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx

# PayMaya API Keys (Add these)
NEXT_PUBLIC_PAYMAYA_PUBLIC_KEY=pk-xxxxxxxxxxxxxxxxxxxxx
PAYMAYA_SECRET_KEY=sk-xxxxxxxxxxxxxxxxxxxxx

# Payment Mode (Add this)
NEXT_PUBLIC_PAYMENT_MODE=test
```

### Create Payment API Route

Create `/src/app/api/paymongo/payment/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { amount, description, email, name } = await request.json();

    // Create PayMongo Payment Intent
    const response = await fetch("https://api.paymongo.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString("base64")}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: amount * 100, // Convert to cents (₱100 = 10000 cents)
            currency: "PHP",
            payment_method_allowed: ["card", "gcash", "paymaya", "grab_pay"],
            description,
            statement_descriptor: "Flowertown",
            metadata: {
              customer_email: email,
              customer_name: name,
            },
          },
        },
      }),
    });

    const paymentIntent = await response.json();

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.data.attributes.client_key,
      paymentIntentId: paymentIntent.data.id,
    });
  } catch (error) {
    console.error("PayMongo error:", error);
    return NextResponse.json(
      { success: false, error: "Payment creation failed" },
      { status: 500 }
    );
  }
}
```

### Create Webhook Handler

Create `/src/app/api/paymongo/webhook/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const WEBHOOK_SECRET = process.env.PAYMONGO_WEBHOOK_SECRET!;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for server operations
);

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("paymongo-signature");

    // Verify webhook signature (security)
    // Implementation depends on PayMongo's signature verification

    const event = JSON.parse(payload);

    if (event.data.attributes.type === "payment.paid") {
      const paymentIntent = event.data.attributes.data;
      const orderId = paymentIntent.attributes.metadata.order_id;

      // Update order status in database
      await supabase
        .from("orders")
        .update({
          status: "confirmed",
          payment_status: "paid",
          payment_method: paymentIntent.attributes.payment_method_used,
          payment_intent_id: paymentIntent.id,
        })
        .eq("id", orderId);

      console.log(`Order ${orderId} marked as paid`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 400 });
  }
}
```

### Update Checkout Page

Modify `/src/app/checkout/page.tsx` to include payment integration:

```typescript
// Add after order creation in handleSubmit function

// Create payment
const paymentResponse = await fetch("/api/paymongo/payment", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    amount: total,
    description: `Flowertown Order - ${orderItems.length} items`,
    email: formData.email,
    name: formData.name,
  }),
});

const { clientSecret, paymentIntentId } = await paymentResponse.json();

// Update order with payment intent ID
await supabase
  .from("orders")
  .update({ payment_intent_id: paymentIntentId })
  .eq("id", orderId);

// Redirect to PayMongo checkout page
window.location.href = `https://checkout.paymongo.com/pay/${clientSecret}`;
```

### Add Payment Status Column to Orders Table

Run this SQL in Supabase SQL Editor:

```sql
-- Add payment tracking columns
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent ON orders(payment_intent_id);
```

---

## 🔐 Environment Variables

### Vercel Deployment

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Add each variable:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_PAYMONGO_PUBLIC_KEY` | `pk_test_xxx...` | Production + Preview + Development |
| `PAYMONGO_SECRET_KEY` | `sk_test_xxx...` | Production + Preview + Development |
| `PAYMONGO_WEBHOOK_SECRET` | `whsec_xxx...` | Production + Preview + Development |
| `NEXT_PUBLIC_PAYMAYA_PUBLIC_KEY` | `pk-xxx...` | Production + Preview + Development |
| `PAYMAYA_SECRET_KEY` | `sk-xxx...` | Production + Preview + Development |
| `NEXT_PUBLIC_PAYMENT_MODE` | `test` | Development & Preview |
| `NEXT_PUBLIC_PAYMENT_MODE` | `live` | Production |

4. Click **"Save"**
5. Redeploy your application

---

## 🧪 Testing & Going Live

### Testing with PayMongo

PayMongo provides test cards:

**Successful Payment:**
- Card Number: `4343434343434345`
- Expiry: Any future date (e.g., `12/25`)
- CVC: Any 3 digits (e.g., `123`)

**Failed Payment:**
- Card Number: `4571736000000075`
- Expiry: Any future date
- CVC: Any 3 digits

**GCash Test:**
1. Select GCash during checkout
2. You'll be redirected to GCash test page
3. Click "Authorize Test Payment"

### Testing Checklist

- [ ] Test successful card payment
- [ ] Test failed card payment
- [ ] Test GCash payment
- [ ] Verify order status updates in admin dashboard
- [ ] Check webhook receives payment notifications
- [ ] Test with different amounts (₱100, ₱1000, ₱5000)
- [ ] Verify email notifications sent

### Going Live

1. **Complete PayMongo Verification**
   - Submit all KYC documents
   - Wait for approval (usually 1-3 business days)

2. **Switch to Live Keys**
   - Update `.env.local` with live keys (`pk_live_xxx`, `sk_live_xxx`)
   - Update Vercel environment variables to live keys
   - Change `NEXT_PUBLIC_PAYMENT_MODE` to `live`

3. **Update Webhook URL**
   - In PayMongo Dashboard, update webhook to production URL
   - Test webhook using PayMongo's "Send Test Webhook" feature

4. **Test Real Transaction**
   - Make a small real purchase (₱50-100)
   - Verify payment processes correctly
   - Check money arrives in your bank account

5. **Launch** 🚀

---

## 💡 Best Practices

### Security
- ✅ **Never** expose secret keys in client code
- ✅ Always validate webhooks with signatures
- ✅ Use HTTPS for all payment pages
- ✅ Store payment data securely (never log full card numbers)

### User Experience
- ✅ Show loading states during payment processing
- ✅ Display clear error messages for failed payments
- ✅ Send email confirmations for successful payments
- ✅ Allow customers to retry failed payments
- ✅ Show payment method icons (Visa, Mastercard, GCash logos)

### Business
- ✅ Monitor failed payments and follow up with customers
- ✅ Set up daily/weekly payout schedules
- ✅ Keep track of PayMongo fees (usually 3.5% + ₱15 per transaction)
- ✅ Reconcile payments with bank deposits regularly

---

## 📞 Support Contacts

### PayMongo
- Email: support@paymongo.com
- Help Center: https://help.paymongo.com
- Developer Docs: https://developers.paymongo.com

### PayMaya
- Email: developer@paymaya.com
- Developer Portal: https://developers.paymaya.com
- Support: https://paymaya.com/business/contact-us

### GCash
- Email: business@gcash.com
- Merchant Support: 2882
- Website: https://www.gcash.com/business

---

## 🎓 Additional Resources

- [PayMongo PHP SDK](https://github.com/paymongo/paymongo-php)
- [PayMongo API Reference](https://developers.paymongo.com/reference)
- [Next.js API Routes Guide](https://nextjs.org/docs/api-routes/introduction)
- [Supabase Server-Side Auth](https://supabase.com/docs/guides/auth/server-side-rendering)

---

## 🤝 Need Help?

If you need assistance implementing payments:

1. Check PayMongo documentation first
2. Contact me at **flowertown1496@gmail.com**
3. Hire a developer on Upwork/Fiverr (search "PayMongo integration Next.js")

---

**Last Updated:** February 12, 2025  
**Version:** 1.0  
**Author:** Flowertown Development Team
