-- Add payment_reference to delivery_items
ALTER TABLE delivery_items ADD COLUMN IF NOT EXISTS payment_reference text;

-- Add payment_reference to receipts
ALTER TABLE receipts ADD COLUMN IF NOT EXISTS payment_reference text;

-- Agent returns table
CREATE TABLE IF NOT EXISTS agent_returns (
  id text PRIMARY KEY,
  invoice_id text NOT NULL REFERENCES invoices(id),
  customer_id text NOT NULL REFERENCES customers(id),
  product_id text NOT NULL REFERENCES products(id),
  product_name text NOT NULL,
  qty_returned integer NOT NULL,
  return_type varchar(20) NOT NULL DEFAULT 'good',
  reason text,
  status varchar(20) NOT NULL DEFAULT 'pending',
  restored_to_pallet_id text,
  ar_credit_id text,
  created_by text REFERENCES users(id),
  reviewed_by text,
  reviewed_at timestamp,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);
