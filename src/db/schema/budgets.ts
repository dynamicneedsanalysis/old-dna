import {
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { clients } from "@/db/schema/index";

export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  income: numeric("income", { precision: 14, scale: 2 }).notNull(),
  clientId: integer("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const budgetsRelations = relations(budgets, ({ one }) => ({
  client: one(clients, {
    fields: [budgets.clientId],
    references: [clients.id],
  }),
}));
