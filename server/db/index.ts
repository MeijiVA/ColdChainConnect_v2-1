import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect().then(() => {
  console.log("✓ Database connected");
}).catch((err: any) => {
  console.error("❌ Database connection failed:", err.message);
});

export const db = drizzle(client, { schema });