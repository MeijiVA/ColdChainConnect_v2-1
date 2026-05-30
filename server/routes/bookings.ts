import { RequestHandler } from "express";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { bookings, booking_items, invoices, agents } from "../db/schema";
import { AuthRequest } from "../middleware/auth";
import { logAction } from "../middleware/audit-logger";

export const listBookings: RequestHandler = async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) return res.json([]);

    const { status } = req.query;
    const whereClause = status ? eq(bookings.status, status as any) : undefined;

    const allBookings = await db.query.bookings.findMany({
      where: whereClause,
      with: {
        booking_items: true,
        customer: true,
        truck: true,
      },
    });

    res.json(allBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createBooking: RequestHandler = async (req: AuthRequest, res) => {
  const { customer_id, items } = req.body;

  if (!customer_id || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: "Customer ID and items array are required" });
  }

  try {
    const bookingId = randomUUID();

    await db.insert(bookings).values({
      id: bookingId,
      customer_id,
      status: "pending",
    });

    for (const item of items) {
      await db.insert(booking_items).values({
        id: randomUUID(),
        booking_id: bookingId,
        product_id: item.product_id,
        qty_ordered: item.qty_ordered,
      });
    }

    const newBooking = await db.query.bookings.findFirst({
      where: eq(bookings.id, bookingId),
      with: { booking_items: true, customer: true, truck: true },
    });

    if (req.user) {
      await logAction(req.user.userId, "create", "booking", bookingId, undefined, newBooking);
    }

    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBookingStatus: RequestHandler = async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { status, driver_id } = req.body;

  if (!status && !driver_id) {
    return res.status(400).json({ error: "Status or driver_id is required" });
  }

  try {
    const existing = await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
    });

    if (!existing) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const updates: any = { updated_at: new Date() };
    if (status) updates.status = status;
    if (driver_id) updates.truck_id = driver_id;

    await db.update(bookings).set(updates).where(eq(bookings.id, id));

    // When a truck is assigned, auto-create an invoice
    let newInvoice = null;
    if (driver_id && req.user) {
      // Use the logged-in user's ID directly — invoices.agent_id references users.id
      const agentId = req.user.userId;
      const invoiceId = randomUUID();

      try {
        await db.insert(invoices).values({
          id: invoiceId,
          booking_id: id,
          agent_id: agentId,
          status: "issued",
          payment_status: "unpaid",
        });

        newInvoice = await db.query.invoices.findFirst({
          where: eq(invoices.id, invoiceId),
        });

        await logAction(req.user.userId, "create", "invoice", invoiceId, undefined, newInvoice);
      } catch (invoiceErr) {
        console.error("Error creating invoice (truck still assigned):", invoiceErr);
        // Don't fail the whole request — truck assignment succeeded
      }
    }

    const updated = await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
      with: { booking_items: true, customer: true, truck: true },
    });

    if (req.user) {
      await logAction(req.user.userId, "update", "booking", id, existing, updated);
    }

    res.json({ booking: updated, invoice: newInvoice });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
