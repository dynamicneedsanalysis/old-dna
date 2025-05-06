"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { utapi } from "@/lib/uploadthing/api";
import { ownsClientProcedure } from "@/procedures/auth/actions";
import { deleteDocument } from "@/db/queries/index";

// Uses ownsClientProcedure to delete a Document from the database.
// Takes: A Document ID.
// Revalidates the path to the Client's Documents page.
export const deleteDocumentAction = ownsClientProcedure
  .createServerAction()
  .input(z.object({ documentId: z.number() }))
  .handler(async ({ ctx, input }) => {
    // Delete the reference to the Document from the database.
    const { data, error } = await deleteDocument({
      id: input.documentId,
      clientId: input.clientId,
      userId: ctx.user.id,
    });

    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with deleting the document from the database"
      );
    }

    if (!data) {
      throw new Error(
        "Something went wrong with deleting the document from the database"
      );
    }

    // Delete the file from the separate Document storage.
    await utapi.deleteFiles(data.fileKey);

    revalidatePath(`/dashboard/client/${input.clientId}/documents`);
  });
