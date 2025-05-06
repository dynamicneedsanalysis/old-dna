"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { utapi } from "@/lib/uploadthing/api";
import { ownsClientProcedure } from "@/procedures/auth/actions";
import {
  deleteIllustration,
  updateIllustration,
} from "@/db/queries/illustrations";

export const updateIllustrationAction = ownsClientProcedure
  .createServerAction()
  .input(
    z.object({ illustrationId: z.number(), policyName: z.string().trim() })
  )
  .handler(async ({ input }) => {
    // Update the Illustration in the database.
    const { error } = await updateIllustration(
      input.illustrationId,
      input.policyName
    );

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with deleting the illustration from the database"
      );
    }

    revalidatePath(`/dashboard/client/${input.clientId}/illustrations`);
  });

// Uses ownsClientProcedure to delete an Illustration from the database.
// Takes: A Document ID.
// Revalidates the path to the Client's Illustrations page.
export const deleteIllustrationAction = ownsClientProcedure
  .createServerAction()
  .input(z.object({ illustrationId: z.number() }))
  .handler(async ({ ctx, input }) => {
    // Delete the reference to the Illustration from the database.
    const { data, error } = await deleteIllustration({
      id: input.illustrationId,
      clientId: input.clientId,
      userId: ctx.user.id,
    });

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with deleting the illustration from the database"
      );
    }

    if (!data) {
      throw new Error(
        "Something went wrong with deleting the illustration from the database"
      );
    }

    // Delete the file from the separate Illustration storage.
    await utapi.deleteFiles(data.fileKey);

    revalidatePath(`/dashboard/client/${input.clientId}/illustrations`);
  });
