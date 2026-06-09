import { pgTable, uuid, text, timestamp, jsonb, integer, boolean } from "drizzle-orm/pg-core";

/** Calificación del lead (jsonb flexible; campos genéricos, ajustables por cliente). */
export type LeadQualification = {
  service?: string;
  company?: string;
  industry?: string;
  budget?: string;
  urgency?: string;
};

export type TranscriptMessage = { role: string; content: string };

export type LeadSource = "bot" | "form" | "manual";

export type UserRole = "admin" | "agent" | "viewer";

export type LeadStatus =
  | "new"
  | "contacted"
  | "following_up"
  | "proposal"
  | "won"
  | "lost";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").$type<UserRole>().default("agent").notNull(),
  active: boolean("active").default(true).notNull(),
  mustChangePassword: boolean("must_change_password").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  locale: text("locale").default("es"),
  sourceUrl: text("source_url"),
  qualification: jsonb("qualification").$type<LeadQualification>(),
  // Mensaje libre del formulario de contacto.
  message: text("message"),
  // Transcript completo del chatbot (para el registro; la UI muestra el summary).
  transcript: jsonb("transcript").$type<TranscriptMessage[]>(),
  summary: text("summary"),
  source: text("source").$type<LeadSource>().default("form").notNull(),
  status: text("status").$type<LeadStatus>().default("new").notNull(),
  assignedTo: uuid("assigned_to").references(() => users.id, { onDelete: "set null" }),
  valueAmount: integer("value_amount"),
  closedAt: timestamp("closed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const leadComments = pgTable("lead_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const leadEvents = pgTable("lead_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  kind: text("kind").notNull(),
  detail: text("detail").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const leadFiles = pgTable("lead_files", {
  id: uuid("id").primaryKey().defaultRandom(),
  leadId: uuid("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  pathname: text("pathname").notNull(),
  contentType: text("content_type"),
  size: integer("size"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
