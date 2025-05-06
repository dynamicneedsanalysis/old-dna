import {
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { assetBeneficiaries, clients } from "@/db/schema/index";

export const beneficiaries = pgTable("beneficiaries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  allocation: numeric("allocation", { precision: 6, scale: 3 }).notNull(),
  clientId: integer("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const beneficiariesRelations = relations(
  beneficiaries,
  ({ many, one }) => ({
    assetBeneficiaries: many(assetBeneficiaries),
    clients: one(clients, {
      fields: [beneficiaries.clientId],
      references: [clients.id],
    }),
  })
);
