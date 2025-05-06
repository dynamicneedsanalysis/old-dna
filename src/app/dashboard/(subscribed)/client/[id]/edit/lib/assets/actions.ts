"use server";

import { revalidatePath } from "next/cache";
import { mightFail } from "@/lib/utils";
import { z } from "zod";
import { db } from "@/db";
import { clients } from "@/db/schema/index";
import { eq } from "drizzle-orm";
import {
  deleteAsset,
  insertAssetWithBeneficiaries,
  updateAssetWithBeneficiaries,
} from "@/db/queries/index";
import {
  ownsAssetProcedure,
  ownsClientProcedure,
} from "@/procedures/auth/actions";
import {
  editTaxFreezeAtYearSchema,
  insertAssetWithBeneficiariesSchema,
} from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/assets/schema";

// Uses ownsClientProcedure to insert a new Asset with Beneficiaries into the database.
// Takes: The insertAssetWithBeneficiariesSchema.
export const createAsset = ownsClientProcedure
  .createServerAction()
  .input(insertAssetWithBeneficiariesSchema)
  .handler(async ({ input, ctx }) => {
    const { assetBeneficiaries, ...asset } = input;
    const { error } = await insertAssetWithBeneficiaries(
      ctx.clientId,
      asset,
      assetBeneficiaries
    );

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with adding the asset to the database"
      );
    }
    revalidatePath("/", "layout");
  });

// Uses ownsAssetProcedure to update an Asset with Beneficiaries in the database.
// Takes: The insertAssetWithBeneficiariesSchema.
export const editAsset = ownsAssetProcedure
  .createServerAction()
  .input(insertAssetWithBeneficiariesSchema)
  .handler(async ({ input }) => {
    const { assetId, assetBeneficiaries, ...asset } = input;
    const { error } = await updateAssetWithBeneficiaries(
      assetId,
      asset,
      assetBeneficiaries
    );

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with updating the asset in the database"
      );
    }
    revalidatePath("/", "layout");
  });

// Uses ownsClientProcedure to delete an Asset from the database.
// Takes: An Asset Id.
export const deleteAssetAction = ownsClientProcedure
  .createServerAction()
  .input(z.object({ assetId: z.number() }))
  .handler(async ({ input }) => {
    const { error } = await deleteAsset(input.assetId, input.clientId);

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with deleting the asset from the database"
      );
    }
    revalidatePath("/", "layout");
  });

// Uses ownsClientProcedure to update the tax freeze at year of a Client in the database.
// Takes: The editTaxFreezeAtYearSchema.
export const editTaxFreezeAtYear = ownsClientProcedure
  .createServerAction()
  .input(editTaxFreezeAtYearSchema)
  .handler(async ({ input }) => {
    const { error } = await mightFail(() =>
      db
        .update(clients)
        .set({
          taxFreezeAtYear: input.taxFreezeAtYear,
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
