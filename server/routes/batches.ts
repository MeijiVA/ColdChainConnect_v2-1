import { RequestHandler } from "express";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { inventory_batches } from "../db/schema";
import { AuthRequest } from "../middleware/auth";
import { logAction } from "../middleware/audit-logger";

export const listBatches: RequestHandler = async (_req, res) => {
  try {
    const allBatches = await db.query.inventory_batches.findMany();
    res.json(allBatches);
  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createBatch: RequestHandler = async (req: AuthRequest, res) => {
  const {
    product_id, pallet_id, qty_units,
    expiration_date_note, placement_location,
    batch_name, supplier_name, received_date, temperature_log, storage_zone,
  } = req.body;

  if (!product_id || !pallet_id || !qty_units) {
    return res.status(400).json({ error: "Product ID, pallet ID, and quantity are required" });
  }

  try {
    const id = randomUUID();
    await db.insert(inventory_batches).values({
      id, product_id, pallet_id, qty_units,
      expiration_date_note: expiration_date_note || null,
      placement_location: placement_location || null,
      batch_name: batch_name || null,
      supplier_name: supplier_name || null,
      received_date: received_date || null,
      temperature_log: temperature_log || null,
      storage_zone: storage_zone || null,
    });

    const newBatch = await db.query.inventory_batches.findFirst({ where: eq(inventory_batches.id, id) });
    if (req.user) await logAction(req.user.userId, "create", "batch", id, undefined, newBatch);
    res.status(201).json(newBatch);
  } catch (error) {
    console.error("Error creating batch:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBatch: RequestHandler = async (req: AuthRequest, res) => {
  const { id } = req.params;
  const {
    qty_units, expiration_date_note, placement_location,
    batch_name, supplier_name, received_date, temperature_log, storage_zone,
  } = req.body;

  try {
    const existing = await db.query.inventory_batches.findFirst({ where: eq(inventory_batches.id, id) });
    if (!existing) return res.status(404).json({ error: "Batch not found" });

    await db.update(inventory_batches).set({
      qty_units: qty_units ?? existing.qty_units,
      expiration_date_note: expiration_date_note ?? existing.expiration_date_note,
      placement_location: placement_location ?? existing.placement_location,
      batch_name: batch_name ?? existing.batch_name,
      supplier_name: supplier_name ?? existing.supplier_name,
      received_date: received_date ?? existing.received_date,
      temperature_log: temperature_log ?? existing.temperature_log,
      storage_zone: storage_zone ?? existing.storage_zone,
      updated_at: new Date(),
    }).where(eq(inventory_batches.id, id));

    const updated = await db.query.inventory_batches.findFirst({ where: eq(inventory_batches.id, id) });
    if (req.user) await logAction(req.user.userId, "update", "batch", id, existing, updated);
    res.json(updated);
  } catch (error) {
    console.error("Error updating batch:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteBatch: RequestHandler = async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    const existing = await db.query.inventory_batches.findFirst({ where: eq(inventory_batches.id, id) });
    if (!existing) return res.status(404).json({ error: "Batch not found" });
    await db.delete(inventory_batches).where(eq(inventory_batches.id, id));
    if (req.user) await logAction(req.user.userId, "delete", "batch", id, existing, undefined);
    res.json({ message: "Batch deleted" });
  } catch (error) {
    console.error("Error deleting batch:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
