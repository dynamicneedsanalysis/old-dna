import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { assetBeneficiaries, clients } from "@/db/schema/index";
import { ASSET_TYPES } from "@/constants/index";

export const assetTypesEnum = pgEnum("asset_types", ASSET_TYPES);

export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  initialValue: numeric("initial_value", { precision: 14, scale: 2 }).notNull(),
  currentValue: numeric("current_value", { precision: 14, scale: 2 }).notNull(),
  yearAcquired: integer("year_acquired").notNull(),
  rate: numeric("rate", { precision: 6, scale: 3 }).notNull(),
  term: numeric("term", { precision: 6, scale: 3 }),
  type: assetTypesEnum("type").notNull(),
  isTaxable: boolean("is_taxable").notNull(),
  isLiquid: boolean("is_liquid").notNull(),
  toBeSold: boolean("to_be_sold").notNull(),
  clientId: integer("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const assetsRelations = relations(assets, ({ many, one }) => ({
  assetBeneficiaries: many(assetBeneficiaries),
  clients: one(clients, {
    fields: [assets.clientId],
    references: [clients.id],
  }),
}));
