import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { keyPeople } from "@/db/schema/index";
import type { selectAllBusinessKeyPeople } from "@/db/queries/index";

// Define and export a type based on the success result of the selectAllBusinessKeyPeople function.
export type BusinessKeyPerson = NonNullable<
  Awaited<ReturnType<typeof selectAllBusinessKeyPeople>>["businesses"]
>[0];

// Define and export a type from the Key People schema.
export type KeyPerson = typeof keyPeople.$inferSelect;

export const insertKeyPersonSchema = createInsertSchema(keyPeople, {
  ebitdaContributionPercentage: z.coerce
    .number()
    .min(0, {
      message: "Must be greater than 0",
    })
    .max(100, {
      message: "Must be less than or equal to 100",
    }),
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

// Define and export a type based on the insertKeyPerson schema.
export type InsertKeyPerson = z.infer<typeof insertKeyPersonSchema>;
