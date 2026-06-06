-- Add snapshot columns to invoices table
ALTER TABLE "invoices"
  ADD COLUMN IF NOT EXISTS "receipt_number" text,
  ADD COLUMN IF NOT EXISTS "customer_name" text,
  ADD COLUMN IF NOT EXISTS "customer_address" text,
  ADD COLUMN IF NOT EXISTS "customer_payment_type" text,
  ADD COLUMN IF NOT EXISTS "discount_rate" numeric(5,4) DEFAULT 0.02,
  ADD COLUMN IF NOT EXISTS "gross_amount" numeric(12,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS "discount_amount" numeric(12,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS "total_amount" numeric(12,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS "prepared_by" text;

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS "invoice_items" (
  "id" text PRIMARY KEY,
  "invoice_id" text NOT NULL REFERENCES "invoices"("id") ON DELETE CASCADE,
  "product_id" text NOT NULL,
  "product_name" text NOT NULL,
  "product_sku" text,
  "qty_ordered" integer NOT NULL,
  "unit_price" numeric(10,2) NOT NULL,
  "amount" numeric(12,2) NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
