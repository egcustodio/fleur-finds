-- Add shipping fee and payment amount type columns to orders table

-- Add shipping_fee column if it doesn't exist
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS shipping_fee DECIMAL(10, 2) DEFAULT 0;

-- Add payment_amount_type column if it doesn't exist
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_amount_type TEXT DEFAULT 'full';

-- Verify columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'orders'
  AND column_name IN ('shipping_fee', 'payment_amount_type')
ORDER BY column_name;
