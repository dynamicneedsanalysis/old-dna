import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { clients } from "@/db/schema/index";
import type { selectAllClients } from "@/db/queries/clients";

// Define and export a type based on the success result of the selectAllClients function.
export type Client = NonNullable<
  Awaited<ReturnType<typeof selectAllClients>>["clients"]
>[number];

export const insertClientSchema = createInsertSchema(clients, {
  lifeExpectancy: z.coerce
    .number()
    .min(0, { message: "Must be greater than 0" }),
  annualIncome: z.coerce
    .number()
    .min(0.01, { message: "Must be greater than $0.00" }),
  sex: z.enum(["M", "F"], { message: "You must select the sex." }),
  smokingStatus: z.boolean({
    message: "Please indicate the if they're a smoker.",
  }),
  health: z.enum(["PP", "P", "RP", "R"], {
    message: "Please select a health class for the client",
  }),
}).omit({
  id: true,
  liquidityAllocatedTowardsGoals: true,
  kindeId: true,
  coverLetter: true,
  hasOnboarded: true,
  reasonsWhy: true,
});

// Export the inferred type of the insertClient schema.
export type InsertClient = z.infer<typeof insertClientSchema>;
