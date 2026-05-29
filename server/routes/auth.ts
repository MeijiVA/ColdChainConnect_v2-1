import { RequestHandler } from "express";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  refreshToken,
} from "../auth";
import { LoginRequest, LoginResponse, LogoutResponse } from "@shared/api";
import { AuthRequest } from "../middleware/auth";

export const handleLogin: RequestHandler<{}, LoginResponse | object> = async (
  req,
  res
) => {
  const { username, password } = req.body as LoginRequest;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  try {
    // Demo mode: allow any login with username
    if (!process.env.DATABASE_URL) {
      const token = signToken({
        userId: "demo-" + username,
        username: username,
        role: "admin",
      });

      return res.json({
        token,
        user: {
          id: "demo-" + username,
          username: username,
          role: "admin",
        },
      } as LoginResponse);
    }

    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    } as LoginResponse);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleLogout: RequestHandler<{}, LogoutResponse> = (_req, res) => {
  res.json({ message: "Logged out successfully" });
};

export const handleRefresh: RequestHandler = (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const newToken = signToken(req.user);
  res.json({ token: newToken });
};

export const handleCreateUser: RequestHandler = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res
      .status(400)
      .json({ error: "Username, password, and role required" });
  }

  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const userId = randomUUID();

    await db.insert(users).values({
      id: userId,
      username,
      password_hash: hashedPassword,
      role,
    });

    res.status(201).json({
      id: userId,
      username,
      role,
    });
  } catch (error) {
    console.error("User creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
