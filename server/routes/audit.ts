import { RequestHandler } from "express";
import { and, desc, gte, lte } from "drizzle-orm";
import { db } from "../db";
import { audit_logs } from "../db/schema";

export const listAuditLogs: RequestHandler = async (req, res) => {
  try {
    const { user_id, action, start_date, end_date, limit = "100" } = req.query;

    let whereConditions = [];

    if (user_id) {
      whereConditions.push((audit_logs.user_id as any) === user_id);
    }

    if (action) {
      whereConditions.push((audit_logs.action as any) === action);
    }

    if (start_date) {
      whereConditions.push(
        gte(audit_logs.created_at, new Date(start_date as string))
      );
    }

    if (end_date) {
      whereConditions.push(
        lte(audit_logs.created_at, new Date(end_date as string))
      );
    }

    const logs = await db.query.audit_logs.findMany({
      where:
        whereConditions.length > 0
          ? and(...(whereConditions as any))
          : undefined,
      orderBy: desc(audit_logs.created_at),
      limit: Math.min(parseInt(limit as string), 1000),
    });

    res.json(logs);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
