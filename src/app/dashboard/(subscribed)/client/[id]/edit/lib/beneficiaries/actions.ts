"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  ownsBeneficiaryProcedure,
  ownsClientProcedure,
} from "@/procedures/auth/actions";
import {
  deleteBeneficiary,
  insertBeneficiary,
  updateBeneficiary,
} from "@/db/queries/index";
import { insertBeneficiarySchema } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/beneficiaries/schema";

// Uses ownsClientProcedure to insert a new Beneficiary into the database.
// Takes: The insertBeneficiarySchema.
export const createBeneficiary = ownsClientProcedure
  .createServerAction()
  .input(insertBeneficiarySchema)
  .handler(async ({ input }) => {
    const { error } = await insertBeneficiary(input.clientId, input);

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with adding the beneficiary to the database"
      );
    }
    revalidatePath("/", "layout");
  });

// Uses ownsBeneficiaryProcedure to update a Beneficiary in the database.
// Takes: The insertBeneficiarySchema.
export const editBeneficiary = ownsBeneficiaryProcedure
  .createServerAction()
  .input(insertBeneficiarySchema)
  .handler(async ({ input }) => {
    const { error } = await updateBeneficiary(input.beneficiaryId, input);

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with updating the beneficiary in the database"
      );
    }
    revalidatePath("/", "layout");
  });

// Uses ownsClientProcedure to delete a Beneficiary from the database.
// Takes: A Beneficiary Id.
export const deleteBeneficiaryAction = ownsClientProcedure
  .createServerAction()
  .input(z.object({ beneficiaryId: z.number() }))
  .handler(async ({ input }) => {
    const { error } = await deleteBeneficiary({
      id: input.beneficiaryId,
      clientId: input.clientId,
    });

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with deleting the beneficiary from the database"
      );
    }
    revalidatePath("/", "layout");
  });
