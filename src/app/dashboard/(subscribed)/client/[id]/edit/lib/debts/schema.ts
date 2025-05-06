import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { debts } from "@/db/schema/index";
import { MAX_DEBT_TERM } from "@/constants";

// Define and export a type from the Debt schema.
export type Debt = typeof debts.$inferSelect;

export const insertDebtSchema = createInsertSchema(debts, {
  rate: z.coerce.number(),
  term: z.coerce
    .number()
    .min(0, { message: "Actual term must be greater than 0" })
    .max(MAX_DEBT_TERM, { message: "Actual term cannot exceed 50" }),
  yearAcquired: z.coerce.number(),
  annualPayment: z.coerce
    .number()
    .min(0.01, { message: "Payment must be greater than $0.00" }),
  initialValue: z.coerce
    .number()
    .min(0.01, { message: "Initial Value must be greater than $0.00" }),
}).omit({ clientId: true, insurableFutureValue: true });

// Define and export a type based on the insertDebt schema.
export type InsertDebt = z.infer<typeof insertDebtSchema>;
