import type { Config } from "drizzle-kit";
import { readFileSync } from "fs";

// Carga DATABASE_URL desde .env.local si no está en el entorno.
if (!process.env.DATABASE_URL) {
  try {
    process.env.DATABASE_URL = readFileSync(".env.local", "utf8")
      .match(/DATABASE_URL=(.+)/)?.[1]
      .trim();
  } catch {}
}

export default {
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
} satisfies Config;
