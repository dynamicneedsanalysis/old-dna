"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  ownsBusinessProcedure,
  ownsClientProcedure,
} from "@/procedures/auth/actions";
import {
  deleteBusiness,
  insertBusiness,
  updateBusiness,
} from "@/db/queries/index";
import { insertBusinessSchema } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/businesses/schema";

// Uses ownsClientProcedure to insert a new Business into the database.
// Takes: The insertBusinessSchema.
export const createBusiness = ownsClientProcedure
  .createServerAction()
  .input(insertBusinessSchema)
  .handler(async ({ input }) => {
    const { error } = await insertBusiness(input.clientId, input);

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with adding the business to the database"
      );
    }
    revalidatePath("/", "layout");
  });

// Uses ownsBusinessProcedure to update a Business in the database.
// Takes: The insertBusinessSchema.
export const editBusiness = ownsBusinessProcedure
  .createServerAction()
  .input(insertBusinessSchema)
  .handler(async ({ input }) => {
    const { error } = await updateBusiness(input.businessId, input);

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with updating the business in the database"
      );
    }
    revalidatePath("/", "layout");
  });

// Uses ownsClientProcedure to delete a Business from the database.
// Takes: A Business Id.
export const deleteBusinessAction = ownsClientProcedure
  .createServerAction()
  .input(z.object({ businessId: z.number() }))
  .handler(async ({ input }) => {
    const { error } = await deleteBusiness({
      id: input.businessId,
      clientId: input.clientId,
    });

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with deleting the business from the database"
      );
    }
    revalidatePath("/", "layout");
  });
