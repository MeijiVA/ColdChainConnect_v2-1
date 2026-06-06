-- Make delivery_item_id nullable in accounts_receivable
-- Required so agent return credits (which have no delivery item) can be inserted
ALTER TABLE accounts_receivable ALTER COLUMN delivery_item_id DROP NOT NULL;
