import {
  serial,
  text,
  date,
  pgTable,
  smallint,
  pgEnum,
  numeric,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import {
  assets,
  beneficiaries,
  budgets,
  businesses,
  debts,
  goals,
} from "@/db/schema/index";

export const provinceEnum = pgEnum("province", [
  "AB",
  "BC",
  "MB",
  "NB",
  "NL",
  "NS",
  "NT",
  "NU",
  "ON",
  "PE",
  "QC",
  "SK",
  "YT",
]);

export const sexEnum = pgEnum("sex", ["M", "F"]);
export const healthEnum = pgEnum("health", ["PP", "P", "RP", "R"]);

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  birthDate: date("birth_date", { mode: "date" }).notNull(),
  province: provinceEnum("province").notNull(),
  annualIncome: numeric("annual_income", { precision: 14, scale: 2 }).notNull(),
  liquidityAllocatedTowardsGoals: numeric("liquidity_allocated_towards_goals", {
    precision: 6,
    scale: 3,
  }).notNull(),
  taxFreezeAtYear: smallint("tax_freeze_at_year")
    .notNull()
    .default(sql`EXTRACT(YEAR FROM CURRENT_DATE) + 20`),
  kindeId: text("kinde_id").notNull(),
  lifeExpectancy: smallint("life_expectancy").notNull(),
  hasOnboarded: boolean("has_onboarded").notNull().default(false),
  reasonsWhy: text("reasons_why").notNull().default(""),
  coverLetter: text("cover_letter").notNull().default(""),
  sex: sexEnum("sex").notNull(),
  smokingStatus: boolean("smoking_status").notNull(),
  health: healthEnum("health").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const clientsRelations = relations(clients, ({ many, one }) => ({
  assets: many(assets),
  businesses: many(businesses),
  budgets: one(budgets),
  beneficiaries: many(beneficiaries),
  debts: many(debts),
  goals: many(goals),
}));
