import {
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { businesses } from "@/db/schema/index";

export const shareholders = pgTable("shareholders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sharePercentage: numeric("share_percentage", {
    precision: 6,
    scale: 3,
  }).notNull(),
  insuranceCoverage: numeric("insurance_coverage", {
    precision: 14,
    scale: 2,
  }).notNull(),
  priority: integer("priority").notNull().default(100),
  businessId: integer("business_id")
    .references(() => businesses.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const shareholdersRelations = relations(shareholders, ({ one }) => ({
  business: one(businesses, {
    fields: [shareholders.businessId],
    references: [businesses.id],
  }),
}));
