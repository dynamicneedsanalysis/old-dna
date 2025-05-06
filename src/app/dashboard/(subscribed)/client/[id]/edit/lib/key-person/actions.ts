"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  ownsBusinessProcedure,
  ownsBusinessEntityProcedure,
} from "@/procedures/auth/actions";
import {
  deleteKeyPerson,
  insertKeyPerson,
  updateKeyPerson,
} from "@/db/queries/index";
import { insertKeyPersonSchema } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/key-person/schema";

// Uses ownsBusinessProcedure to insert a new Key Person into the database.
// Takes: The insertKeyPersonSchema.
export const createKeyPerson = ownsBusinessProcedure
  .createServerAction()
  .input(insertKeyPersonSchema)
  .handler(async ({ input }) => {
    const { error } = await insertKeyPerson(input);

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with adding the key person to the database"
      );
    }
    revalidatePath("/", "layout");
  });

// Uses ownsBusinessEntityProcedure to update a Key Person in the database.
// Takes: The insertKeyPersonSchema.
export const editKeyPerson = ownsBusinessEntityProcedure
  .createServerAction()
  .input(insertKeyPersonSchema)
  .handler(async ({ input }) => {
    const { error } = await updateKeyPerson(input.entitytId, input);

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with updating the key person in the database"
      );
    }
    revalidatePath("/", "layout");
  });

// Uses ownsBusinessProcedure to delete a Key Person from the database.
// Takes: A Key Person Id.
export const deleteKeyPersonAction = ownsBusinessProcedure
  .createServerAction()
  .input(z.object({ keyPersonId: z.number() }))
  .handler(async ({ input }) => {
    const { error } = await deleteKeyPerson({
      id: input.keyPersonId,
      businessId: input.businessId,
    });

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with deleting the key person from the database"
      );
    }
    revalidatePath("/", "layout");
  });
