import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { shareholders } from "@/db/schema/index";
import type { selectAllBusinessShareholders } from "@/db/queries/index";

// Define and export a type based on the success result of the selectAllBusinessShareholders function.
export type BusinessShareholder = NonNullable<
  Awaited<ReturnType<typeof selectAllBusinessShareholders>>["businesses"]
>[0];

// Define and export a type from the Shareholders schema with the priority field omitted.
export type Shareholder = Omit<typeof shareholders.$inferSelect, "priority">;

export const insertShareholderSchema = createInsertSchema(shareholders, {
  sharePercentage: z.coerce
    .number()
    .min(0, { message: "Must be greater than 0" })
    .max(100, { message: "Must be less than or equal to 100" }),
  insuranceCoverage: z.coerce
    .number()
    .min(0, { message: "Insurance Coverage cannot be less than $0.00" }),
})
  .omit({ businessId: true })
  .extend({
    business: z.object({
      value: z.string(),
      label: z.string(),
    }),
  });

// Define and export a type based on the insertShareholder schema.
export type InsertShareholder = z.infer<typeof insertShareholderSchema>;
