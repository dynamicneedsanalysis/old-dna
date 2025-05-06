"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  ownsClientProcedure,
  ownsDebtProcedure,
} from "@/procedures/auth/actions";
import { deleteDebt, insertDebt, updateDebt } from "@/db/queries/index";
import { insertDebtSchema } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/debts/schema";

// Uses ownsClientProcedure to insert a new Debt into the database.
// Takes: The insertDebtSchema.
export const createDebt = ownsClientProcedure
  .createServerAction()
  .input(insertDebtSchema)
  .handler(async ({ input }) => {
    // TODO: calculate the insurable future value dollars
    const { error } = await insertDebt(input.clientId, input);

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with adding the debt to the database"
      );
    }
    revalidatePath("/", "layout");
  });

// Uses ownsDebtProcedure to update a Debt in the database.
// Takes: The insertDebtSchema.
export const editDebt = ownsDebtProcedure
  .createServerAction()
  .input(insertDebtSchema)
  .handler(async ({ input }) => {
    const { error } = await updateDebt(input.debtId, input);

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with updating the debt in the database"
      );
    }
    revalidatePath("/", "layout");
  });

// Uses ownsClientProcedure to delete a Debt from the database.
// Takes: A Debt Id.
export const deleteDebtAction = ownsClientProcedure
  .createServerAction()
  .input(z.object({ debtId: z.number() }))
  .handler(async ({ input }) => {
    const { error } = await deleteDebt({
      id: input.debtId,
      clientId: input.clientId,
    });

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with deleting the debt from the database"
      );
    }
    revalidatePath("/", "layout");
  });
