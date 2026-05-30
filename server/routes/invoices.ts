import { RequestHandler } from "express";
import { randomUUID } from "crypto";
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { invoices } from "../db/schema";
import { AuthRequest } from "../middleware/auth";
import { logAction } from "../middleware/audit-logger";

export const listInvoices: RequestHandler = async (req, res) => {
  try {
    const { status, payment_status, unpaid } = req.query;

    let whereConditions = [];

    if (status) {
      whereConditions.push((invoices.status as any) === status);
    }

    if (unpaid === "true") {
      whereConditions.push((invoices.payment_status as any) === "unpaid");
    } else if (payment_status) {
      whereConditions.push((invoices.payment_status as any) === payment_status);
    }

    const allInvoices = await db.query.invoices.findMany({
      where:
        whereConditions.length > 0
          ? and(...(whereConditions as any))
          : undefined,
    });

    res.json(allInvoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createInvoice: RequestHandler = async (
  req: AuthRequest,
  res
) => {
  const { booking_id, agent_id } = req.body;

  if (!booking_id || !agent_id) {
    return res
      .status(400)
      .json({ error: "Booking ID and agent ID are required" });
  }

  try {
    const id = randomUUID();
    await db.insert(invoices).values({
      id,
      booking_id,
      agent_id,
      status: "draft",
      payment_status: "unpaid",
    });

    const newInvoice = await db.query.invoices.findFirst({
      where: eq(invoices.id, id),
    });

    if (req.user) {
      await logAction(
        req.user.userId,
        "create",
        "invoice",
        id,
        undefined,
        newInvoice
      );
    }

    res.status(201).json(newInvoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateInvoiceStatus: RequestHandler = async (
  req: AuthRequest,
  res
) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  try {
    const existing = await db.query.invoices.findFirst({
      where: eq(invoices.id, id),
    });

    if (!existing) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    await db
      .update(invoices)
      .set({
        status,
        updated_at: new Date(),
      })
      .where(eq(invoices.id, id));

    const updated = await db.query.invoices.findFirst({
      where: eq(invoices.id, id),
    });

    if (req.user) {
      await logAction(
        req.user.userId,
        "update",
        "invoice",
        id,
        existing,
        updated
      );
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating invoice status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateInvoicePaymentStatus: RequestHandler = async (
  req: AuthRequest,
  res
) => {
  const { id } = req.params;
  const { payment_status } = req.body;

  if (!payment_status) {
    return res
      .status(400)
      .json({ error: "Payment status is required" });
  }

  try {
    const existing = await db.query.invoices.findFirst({
      where: eq(invoices.id, id),
    });

    if (!existing) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    await db
      .update(invoices)
      .set({
        payment_status,
        updated_at: new Date(),
      })
      .where(eq(invoices.id, id));

    const updated = await db.query.invoices.findFirst({
      where: eq(invoices.id, id),
    });

    if (req.user) {
      await logAction(
        req.user.userId,
        "update",
        "invoice_payment",
        id,
        existing,
        updated
      );
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating invoice payment status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
