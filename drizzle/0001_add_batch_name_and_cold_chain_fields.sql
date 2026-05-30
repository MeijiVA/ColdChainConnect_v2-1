-- Migration: Add batch_name and cold-chain fields to inventory_batches
-- Run this once against your database: psql $DATABASE_URL -f drizzle/0001_add_batch_name_and_cold_chain_fields.sql

ALTER TABLE inventory_batches
  ADD COLUMN IF NOT EXISTS batch_name TEXT,
  ADD COLUMN IF NOT EXISTS supplier_name TEXT,
  ADD COLUMN IF NOT EXISTS received_date TEXT,
  ADD COLUMN IF NOT EXISTS temperature_log TEXT,
  ADD COLUMN IF NOT EXISTS storage_zone TEXT;
