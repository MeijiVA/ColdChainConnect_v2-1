import { RequestHandler } from "express";
import { randomUUID } from "crypto";
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import {
  receipts,
  delivery_items,
  deliveries,
  invoices,
} from "../db/schema";
import { AuthRequest } from "../middleware/auth";
import { logAction } from "../middleware/audit-logger";

// ─── GET /api/receipts ────────────────────────────────────────────────────────
// Returns all receipts (joined data is resolved on the client via separate
// /api/customers, /api/trucks, /api/invoices calls — same pattern as deliveries).

export const listReceipts: RequestHandler = async (_req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.json([]);
    }

    const all = await db.select().from(receipts).orderBy(receipts.confirmed_at);
    res.json(all);
  } catch (error) {
    console.error("Error fetching receipts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ─── POST /api/deliveries/:id/items/:itemId/confirm ───────────────────────────
// Called by the mobile app (or the admin UI) to confirm a delivery stop.
// Side-effects:
//   1. Sets delivery_item.status = "completed", completed_at, receipt_number
//   2. Sets invoice.status = "paid", payment_status = "paid"
//   3. Creates a receipts row
//   4. If every item in the delivery is now completed, sets delivery.status = "completed"

export const confirmDeliveryItem: RequestHandler = async (
  req: AuthRequest,
  res
) => {
  const { id: deliveryId, itemId } = req.params;
  const { notes, confirmed_by } = req.body ?? {};

  if (!process.env.DATABASE_URL) {
    return res.status(503).json({ error: "Database not configured" });
  }

  try {
    // 1. Load the item
    const item = await db.query.delivery_items.findFirst({
      where: and(
        eq(delivery_items.id, itemId),
        eq(delivery_items.delivery_id, deliveryId)
      ),
    });

    if (!item) {
      return res.status(404).json({ error: "Delivery item not found" });
    }
    if (item.status === "completed") {
      return res.status(409).json({ error: "Delivery item already confirmed" });
    }

    // 2. Load the parent delivery to get the truck_id
    const delivery = await db.query.deliveries.findFirst({
      where: eq(deliveries.id, deliveryId),
    });

    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    // 3. Generate receipt number: OR-YYYYMMDD-XXXX
    const now = new Date();
    const datePart = now
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");
    const suffix = randomUUID().slice(0, 4).toUpperCase();
    const receiptNumber = `OR-${datePart}-${suffix}`;

    const receiptId = randomUUID();

    // 4. Mark delivery item as completed
    await db
      .update(delivery_items)
      .set({
        status: "completed",
        completed_at: now,
        receipt_number: receiptNumber,
        updated_at: now,
      })
      .where(eq(delivery_items.id, itemId));

    // 5. Mark invoice as paid
    await db
      .update(invoices)
      .set({
        status: "paid",
        payment_status: "paid",
        updated_at: now,
      })
      .where(eq(invoices.id, item.invoice_id));

    // 6. Create the receipt record
    await db.insert(receipts).values({
      id: receiptId,
      receipt_number: receiptNumber,
      delivery_item_id: itemId,
      customer_id: item.destination_customer_id,
      truck_id: delivery.truck_id,
      invoice_id: item.invoice_id,
      confirmed_by: confirmed_by ?? req.user?.userId ?? null,
      notes: notes ?? null,
      confirmed_at: now,
    });

    // 7. Check if all items in the delivery are completed → mark delivery done
    const remainingItems = await db.query.delivery_items.findMany({
      where: and(
        eq(delivery_items.delivery_id, deliveryId),
      ),
    });

    const allDone = remainingItems.every((i) =>
      i.id === itemId ? true : i.status === "completed"
    );

    if (allDone) {
      await db
        .update(deliveries)
        .set({ status: "completed", updated_at: now })
        .where(eq(deliveries.id, deliveryId));
    }

    // 8. Audit log
    if (req.user) {
      await logAction(
        req.user.userId,
        "confirm",
        "delivery_item",
        itemId,
        { status: item.status },
        { status: "completed", receipt_number: receiptNumber }
      );
    }

    const newReceipt = await db.query.receipts.findFirst({
      where: eq(receipts.id, receiptId),
    });

    res.status(201).json(newReceipt);
  } catch (error) {
    console.error("Error confirming delivery item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
