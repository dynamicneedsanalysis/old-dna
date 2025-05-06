import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { businesses } from "@/db/schema/index";
import { MAX_BUSINESS_GROWTH_RATE } from "@/constants";

// Define and export a type from the Business schema.
export type Business = typeof businesses.$inferSelect;

export const insertBusinessSchema = createInsertSchema(businesses, {
  term: z.coerce
    .number()
    .min(1, { message: "Time Horizon must be greater than 0" })
    .nullable(),
  appreciationRate: z.coerce
    .number()
    .min(0, { message: "Growth Rate must be between 0 and 12" })
    .max(MAX_BUSINESS_GROWTH_RATE, {
      message: "Growth Rate must be between 0 and 12",
    }),
  valuation: z.coerce
    .number()
    .min(0.01, { message: "Market Value must be greater than $0.00" }),
  ebitda: z.coerce
    .number()
    .min(0.01, { message: "Corporation's Ebitda must be greater than $0.00" }),
  clientSharePercentage: z.coerce
    .number()
    .min(1, "Client must be a shareholder of the business")
    .max(100, "Client's Share percentage must be less than or equal to 100"),
  clientShareholderInsuranceContribution: z.coerce.number().min(0, {
    message:
      "Client's Shareholder Insurance Contribution cannot be less than $0.00",
  }),
  clientEbitdaContributed: z.coerce
    .number()
    .min(1, "Client must be have contributed to the ebitda")
    .max(100, "Client's ebitda contributed must be less than 100"),
  clientEbitdaInsuranceContribution: z.coerce.number().min(0, {
    message: "Client's Ebitda Insurance Contribution cannot be less than $0.00",
  }),
  purchasePrice: z.coerce.number().min(0.01, {
    message: "Purchase Price must be greater than or equal to $0.01",
  }),
  yearAcquired: z.coerce
    .number()
    .min(1, { message: "Year Acquired must be greater than 0" }),
}).omit({ clientId: true });

// Define and export a type based on the insertBusiness schema.
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
