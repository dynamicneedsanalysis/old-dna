import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { clients, goals } from "@/db/schema/index";

export const editLiquidityAllocatedTowardsGoalsSchema = createInsertSchema(
  clients,
  {
    liquidityAllocatedTowardsGoals: z.coerce
      .number()
      .min(0, { message: "Must be greater than 0" })
      .max(100, { message: "Must be less than or equal to 100" }),
  }
).pick({
  liquidityAllocatedTowardsGoals: true,
});

// Define and export a type based on the editLiquidityAllocatedTowardsGoals schema.
export type EditLiquidityAllocatedTowardsGoals = z.infer<
  typeof editLiquidityAllocatedTowardsGoalsSchema
>;

export type Goal = typeof goals.$inferSelect;
export const insertGoalSchema = createInsertSchema(goals, {
  amount: z.coerce
    .number()
    .min(0.01, { message: "Amount must be greater than $0.00" }),
}).omit({
  clientId: true,
});

// Define and export a type based on the insertGoal schema.
export type InsertGoal = z.infer<typeof insertGoalSchema>;
