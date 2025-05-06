"use server";

import { revalidatePath } from "next/cache";
import { ownsClientProcedure } from "@/procedures/auth/actions";
import { updateClient } from "@/db/queries/index";
import { insertClientSchema as updateClientSchema } from "@/app/dashboard/(subscribed)/clients/lib/schema";

// Uses ownsClientProcedure to update a Client in the database.
// Takes: The updateClientSchema.
export const editClient = ownsClientProcedure
  .createServerAction()
  .input(updateClientSchema)
  .handler(async ({ input }) => {
    const { error } = await updateClient(input.clientId, input);

    if (error) {
      console.log(error);
      throw new Error(
        "Something went wrong with updating the client in the database"
      );
    }
    revalidatePath("/", "layout");
  });
