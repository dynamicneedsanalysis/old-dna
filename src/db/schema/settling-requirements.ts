import { createUpdateSchema } from "drizzle-zod";
import type { z } from "zod";
import {
  pgTable,
  varchar,
  boolean,
  timestamp,
  serial,
  integer,
} from "drizzle-orm/pg-core";
import { clients } from "@/db/schema/index";

export const settlingRequirements = pgTable("settling_requirements", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  policyNumber: varchar("policy_number", { length: 50 }),
  needsAnalysis: boolean("needs_analysis").default(false),
  policyDeliveryReceipt: boolean("policy_delivery_receipt").default(false),
  voidCheque: boolean("void_cheque").default(false),
  illustration: boolean("illustration").default(false),
  amendment: boolean("amendment").default(false),
  identificationNumber: boolean("identification_number").default(false),
  productPage: boolean("product_page").default(false),
  returnOfOriginalPolicy: boolean("return_of_original_policy").default(false),
  returnOfAlternatePolicy: boolean("return_of_alternate_policy").default(false),
  declarationOfInsurability: boolean("declaration_of_insurability").default(
    false
  ),
  chequeAmount: boolean("cheque_amount").default(false),
  pacAuthorization: boolean("pac_authorization").default(false),
  signedIllustration: boolean("signed_illustration").default(false),
  replacementForm: boolean("replacement_form").default(false),
  surrenderRequest: boolean("surrender_request").default(false),
  inForceNoRequirements: boolean("in_force_no_requirements").default(false),
  notTaken: boolean("not_taken").default(false),
  endorsement: boolean("endorsement").default(false),
  returnForReissue: boolean("return_for_reissue").default(false),
  questionnaire: boolean("questionnaire").default(false),
  otherRequirements: boolean("other_requirements").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const settlingRequirementsUpdateSchema = createUpdateSchema(
  settlingRequirements
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Export the inferred type of the settlingRequirementUpdate schema.
export type UpdateSettlingRequirements = z.infer<
  typeof settlingRequirementsUpdateSchema
>;
