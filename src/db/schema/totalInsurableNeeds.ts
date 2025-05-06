import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { clients } from "@/db/schema/index";

export const totalInsurableNeeds = pgTable("total_insurable_needs", {
  id: serial("id").primaryKey(),
  purpose: text("purpose").notNull(),
  priority: integer("priority").notNull().default(100),
  clientId: integer("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
