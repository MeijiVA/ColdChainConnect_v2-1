import { Response } from "express";
import { randomUUID } from "crypto";
import { db } from "../db";
import { audit_logs } from "../db/schema";
import { AuthRequest } from "./auth";

export async function logAction(
  userId: string,
  action: string,
  resourceType: string,
  resourceId?: string,
  beforeState?: Record<string, unknown>,
  afterState?: Record<string, unknown>
) {
  try {
    // Skip if no database
    if (!process.env.DATABASE_URL || !db.insert) {
      return;
    }

    await db.insert(audit_logs).values({
      id: randomUUID(),
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      before_state: beforeState ? JSON.stringify(beforeState) : null,
      after_state: afterState ? JSON.stringify(afterState) : null,
    });
  } catch (error) {
    console.error("Failed to log action:", error);
  }
}

export async function auditLogMiddleware(
  req: AuthRequest,
  res: Response,
  next: () => void
) {
  if (!req.user) {
    return next();
  }

  const originalJson = res.json;
  res.json = function (data: any) {
    if (["POST", "PATCH", "DELETE"].includes(req.method) && req.user) {
      const resourceType = req.path.split("/")[2] || "unknown";
      logAction(
        req.user.userId,
        req.method.toLowerCase(),
        resourceType,
        req.params.id,
        undefined,
        data
      ).catch(console.error);
    }
    return originalJson.call(this, data);
  };

  next();
}
