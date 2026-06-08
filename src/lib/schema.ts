import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Leads capturados por el sitio (formulario de contacto, y más adelante el chatbot).
 * Schema mínimo y estándar para que un CRM posterior pueda construir sobre él.
 */
export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  service: text("service"), // servicio de interés
  message: text("message"),
  locale: text("locale").default("es").notNull(), // 'es' | 'en'
  source: text("source").default("form").notNull(), // 'form' | 'bot' | 'manual'
  sourceUrl: text("source_url"),
  status: text("status").default("new").notNull(), // new | contacted | won | lost
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
