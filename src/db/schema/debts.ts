import {
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { clients } from "@/db/schema/index";

export const debts = pgTable("debts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  initialValue: numeric("initial_value", { precision: 14, scale: 2 }).notNull(),
  yearAcquired: integer("year_acquired").notNull(),
  rate: numeric("rate", { precision: 6, scale: 3 }).notNull(),
  term: numeric("term", { precision: 6, scale: 3 }).notNull(),
  annualPayment: numeric("annual_payment", {
    precision: 14,
    scale: 2,
  }).notNull(),
  insurableFutureValue: numeric("insurable_future_value", {
    precision: 14,
    scale: 2,
  }).notNull(),
  clientId: integer("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const debtsRelations = relations(debts, ({ one }) => ({
  client: one(clients, {
    fields: [debts.clientId],
    references: [clients.id],
  }),
}));
