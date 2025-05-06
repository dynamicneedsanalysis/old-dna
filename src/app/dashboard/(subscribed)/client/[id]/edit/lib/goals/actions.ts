"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { mightFail } from "@/lib/utils";
import {
  ownsClientProcedure,
  ownsGoalProcedure,
} from "@/procedures/auth/actions";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { clients } from "@/db/schema/index";
import { deleteGoal, insertGoal, updateGoal } from "@/db/queries/index";
import {
  insertGoalSchema,
  editLiquidityAllocatedTowardsGoalsSchema,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/goals/schema";

// Uses ownsClientProcedure to insert a new Goal into the database.
// Takes: The insertGoalSchema.
export const createGoal = ownsClientProcedure
  .createServerAction()
  .input(insertGoalSchema)
  .handler(async ({ input }) => {
    const { error } = await insertGoal(input.clientId, input);

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with adding the goal to the database"
      );
    }
    revalidatePath("/", "layout");
  });

// Uses ownsGoalProcedure to update a Goal in the database.
// Takes: The insertGoalSchema.
export const editGoal = ownsGoalProcedure
  .createServerAction()
  .input(insertGoalSchema)
  .handler(async ({ input }) => {
    const { error } = await updateGoal(input.goalId, input);

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with updating the goal in the database"
      );
    }
    revalidatePath("/", "layout");
  });

// Uses ownsClientProcedure to delete a Goal from the database.
// Takes: A Goal Id.
export const deleteGoalAction = ownsClientProcedure
  .createServerAction()
  .input(z.object({ goalId: z.number() }))
  .handler(async ({ input }) => {
    const { error } = await deleteGoal({
      id: input.goalId,
      clientId: input.clientId,
    });

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with deleting the goal from the database"
      );
    }
    revalidatePath("/", "layout");
  });

// Uses ownsClientProcedure to update the liquidity allocated towards goals in the database.
// Takes: The editLiquidityAllocatedTowardsGoalsSchema.
export const editLiquidityAllocatedTowardsGoals = ownsClientProcedure
  .createServerAction()
  .input(editLiquidityAllocatedTowardsGoalsSchema)
  .handler(async ({ input }) => {
    const { error } = await mightFail(() =>
      db
        .update(clients)
        .set({
          liquidityAllocatedTowardsGoals:
            input.liquidityAllocatedTowardsGoals.toString(),
        })
        .where(eq(clients.id, input.clientId))
    );

    if (error) {
      console.log(error);
      throw new Error(
        "Something went wrong with updating the client in the database"
      );
    }
    revalidatePath("/", "layout");
  });
