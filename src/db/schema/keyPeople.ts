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

export const keyPeople = pgTable("key_people", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ebitdaContributionPercentage: numeric("ebitda_contribution_percentage", {
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

export const keyPeopleRelations = relations(keyPeople, ({ one }) => ({
  business: one(businesses, {
    fields: [keyPeople.businessId],
    references: [businesses.id],
  }),
}));
