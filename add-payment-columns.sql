-- PayMongo Payment Integration - Database Migration
-- Run this SQL in your Supabase SQL Editor

-- Add payment tracking columns to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS paymongo_payment_id TEXT;

-- Add indexes for faster payment lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent ON orders(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_paymongo_payment ON orders(paymongo_payment_id);

-- Verify columns were added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND column_name IN ('payment_status', 'payment_method', 'payment_intent_id', 'paymongo_payment_id')
ORDER BY column_name;
