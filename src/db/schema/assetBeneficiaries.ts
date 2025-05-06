import {
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { assets, beneficiaries } from "@/db/schema/index";

export const assetBeneficiaries = pgTable("asset_beneficiaries", {
  id: serial("id").primaryKey(),
  allocation: numeric("allocation", { precision: 6, scale: 3 }).notNull(),
  assetId: integer("asset_id")
    .references(() => assets.id, { onDelete: "cascade" })
    .notNull(),
  beneficiaryId: integer("beneficiary_id")
    .references(() => beneficiaries.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const assetBeneficiariesRelations = relations(
  assetBeneficiaries,
  ({ one }) => ({
    asset: one(assets, {
      fields: [assetBeneficiaries.assetId],
      references: [assets.id],
    }),
    beneficiaries: one(beneficiaries, {
      fields: [assetBeneficiaries.beneficiaryId],
      references: [beneficiaries.id],
    }),
  })
);
