import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { beneficiaries } from "@/db/schema/index";
import type { selectAllBeneficiaries } from "@/db/queries/index";

// Define and export a type of the success result of the selectAllBeneficiaries function.
export type Beneficiary = NonNullable<
  Awaited<ReturnType<typeof selectAllBeneficiaries>>["beneficiaries"]
>[0];

export const insertBeneficiarySchema = createInsertSchema(beneficiaries, {
  allocation: z.coerce.number(),
}).omit({
  clientId: true,
});

// Define and export a type based on the insertBeneficiary schema.
export type InsertBeneficiary = z.infer<typeof insertBeneficiarySchema>;
