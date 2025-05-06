"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  ownsBusinessProcedure,
  ownsBusinessEntityProcedure,
} from "@/procedures/auth/actions";
import {
  deleteShareholder,
  insertShareholder,
  updateShareholder,
} from "@/db/queries/index";
import { insertShareholderSchema } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/shareholders/schema";

// Uses ownsBusinessProcedure to insert a new Shareholder into the database.
// Takes: The insertShareholderSchema.
export const createShareholder = ownsBusinessProcedure
  .createServerAction()
  .input(insertShareholderSchema)
  .handler(async ({ input }) => {
    const { error } = await insertShareholder(input);

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with adding the shareholders to the database"
      );
    }
    revalidatePath("/", "layout");
  });

// Uses ownsBusinessEntityProcedure to update a Shareholder in the database.
// Takes: The insertShareholderSchema.
export const editShareholder = ownsBusinessEntityProcedure
  .createServerAction()
  .input(insertShareholderSchema)
  .handler(async ({ input }) => {
    const { error } = await updateShareholder(input.entitytId, input);

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with updating the shareholder in the database"
      );
    }
    revalidatePath("/", "layout");
  });

// Uses ownsBusinessProcedure to delete a Shareholder from the database.
// Takes: A Shareholder Id.
export const deleteShareholderAction = ownsBusinessProcedure
  .createServerAction()
  .input(z.object({ shareholderId: z.number() }))
  .handler(async ({ input }) => {
    const { error } = await deleteShareholder({
      id: input.shareholderId,
      businessId: input.businessId,
    });
    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with deleting the shareholder from the database"
      );
    }
    revalidatePath("/", "layout");
  });
