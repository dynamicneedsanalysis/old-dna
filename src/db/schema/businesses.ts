import {
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { clients, keyPeople, shareholders } from "@/db/schema/index";

export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  valuation: numeric("valuation", { precision: 14, scale: 2 }).notNull(),
  purchasePrice: numeric("purchase_price", {
    precision: 14,
    scale: 2,
  }).notNull(),
  yearAcquired: smallint("year_acquired").notNull(),
  ebitda: numeric("ebitda", { precision: 14, scale: 2 }).notNull(),
  appreciationRate: numeric("appreciation_rate", {
    precision: 6,
    scale: 3,
  }).notNull(),
  term: numeric("term", { precision: 6, scale: 3 }),
  toBeSold: boolean("to_be_sold").notNull(),
  clientId: integer("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  clientSharePercentage: numeric("client_share_percentage", {
    precision: 6,
    scale: 3,
  }).notNull(),
  clientShareholderInsuranceContribution: numeric(
    "client_shareholder_insurance_contribution",
    {
      precision: 14,
      scale: 2,
    }
  ).notNull(),
  clientEbitdaContributed: numeric("client_ebitda_Contributed", {
    precision: 6,
    scale: 3,
  }).notNull(),
  clientEbitdaInsuranceContribution: numeric(
    "client_ebitda_insurance_contribution",
    {
      precision: 14,
      scale: 2,
    }
  ).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const businessesRelations = relations(businesses, ({ one, many }) => ({
  client: one(clients, {
    fields: [businesses.clientId],
    references: [clients.id],
  }),
  shareholders: many(shareholders),
  keyPeople: many(keyPeople),
}));
