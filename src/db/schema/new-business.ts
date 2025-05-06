import { createUpdateSchema } from "drizzle-zod";
import type { z } from "zod";
import {
  pgTable,
  varchar,
  boolean,
  text,
  timestamp,
  serial,
  integer,
  numeric,
} from "drizzle-orm/pg-core";
import { clients } from "@/db/schema/index";

export const newBusiness = pgTable("new_business", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  applicationNumber: varchar("application_number", { length: 50 }),
  Term: boolean("term").default(false),
  UL: boolean("UL").default(false),
  WholeLife: boolean("whole_life").default(false),
  DI: boolean("DI").default(false),
  CI: boolean("CI").default(false),
  // Mandatory items and attachments
  illustrationAttached: boolean("illustration_attached").default(false),

  // Premium details
  premiumChequeAmount: numeric("premium_cheque_amount", {
    precision: 10,
    scale: 2,
  }),

  // Payment related items
  prePrintedVoidCheque: boolean("pre_printed_void_cheque").default(false),
  preAuthorizedDebitForm: boolean("pre_authorized_debit_form").default(false),

  // Required forms and documents
  replacementForm: boolean("replacement_form").default(false),
  productPage: boolean("product_page").default(false),
  financials: boolean("financials").default(false),

  // Questionnaires and additional files
  completedQuestionnaires: text("completed_questionnaires"),
  linkedFile: text("linked_file"),

  // Supervision related documents
  clientSignedAdvisorDisclosure: boolean(
    "client_signed_advisor_disclosure"
  ).default(false),
  clientSignedFNA: boolean("client_signed_fna").default(false),

  // Other fields
  otherRequirements: text("other_requirements"),

  // Validation flags
  isUnderCloseSupervision: boolean("is_under_close_supervision").default(false),
  isDIApplication: boolean("is_di_application").default(false),
  hasExistingCoverage: boolean("has_existing_coverage").default(false),

  // Metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const newBusinessUpdateSchema = createUpdateSchema(newBusiness).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Export the inferred type of the newBusinessUpdate schema.
export type UpdateNewBusiness = z.infer<typeof newBusinessUpdateSchema>;
