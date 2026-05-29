import { RequestHandler } from "express";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { agents } from "../db/schema";
import { Agent } from "@shared/api";

export const listAgents: RequestHandler<{}, Agent[]> = async (req, res) => {
  try {
    const agentsList = await db.query.agents.findMany();
    res.json(agentsList);
  } catch (error) {
    console.error("List agents error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createAgent: RequestHandler<{}, Agent | object> = async (
  req,
  res
) => {
  const { name, email, phone, is_active = true } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const id = randomUUID();
    const newAgent = await db
      .insert(agents)
      .values({
        id,
        name,
        email,
        phone,
        is_active,
      })
      .returning();

    res.status(201).json(newAgent[0]);
  } catch (error: any) {
    console.error("Create agent error:", error);
    if (error.message?.includes("unique constraint")) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateAgent: RequestHandler<{ id: string }, Agent | object> = async (
  req,
  res
) => {
  const { id } = req.params;
  const { name, email, phone, is_active } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Agent ID is required" });
  }

  try {
    const agent = await db.query.agents.findFirst({
      where: eq(agents.id, id),
    });

    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    const updated = await db
      .update(agents)
      .set({
        name: name || agent.name,
        email: email || agent.email,
        phone: phone !== undefined ? phone : agent.phone,
        is_active: is_active !== undefined ? is_active : agent.is_active,
      })
      .where(eq(agents.id, id))
      .returning();

    res.json(updated[0]);
  } catch (error: any) {
    console.error("Update agent error:", error);
    if (error.message?.includes("unique constraint")) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAgent: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Agent ID is required" });
  }

  try {
    const agent = await db.query.agents.findFirst({
      where: eq(agents.id, id),
    });

    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    await db.delete(agents).where(eq(agents.id, id));

    res.json({ message: "Agent deleted successfully" });
  } catch (error) {
    console.error("Delete agent error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
