import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

type DB = ReturnType<typeof drizzle<typeof schema>>;

let client: DB | undefined;

function getClient(): DB {
  client ??= drizzle(neon(process.env.DATABASE_URL!), { schema });
  return client;
}

export const db = new Proxy({} as DB, {
  get(_t, prop) {
    const c = getClient();
    const v = c[prop as keyof DB];
    return typeof v === "function" ? v.bind(c) : v;
  },
});
