"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ownsClientProcedure } from "@/procedures/auth/actions";
import { deleteClient } from "@/db/queries/index";

// Use ownsClientProcedure to get the Client Id and the User.
export const deleteClientAction = ownsClientProcedure
  .createServerAction()
  .handler(async ({ ctx }) => {
    // Use the Client Id and the User to delete the Client from the database.
    const { error } = await deleteClient({
      id: ctx.clientId,
      kindeId: ctx.user.id,
    });
    if (error) {
      console.error(error.message);
      throw new Error(
        "Something went wrong with deleting the client from the database"
      );
    }

    // Clear the cache of the layout and redirect to the Clients page.
    revalidatePath("/", "layout");
    redirect("/dashboard/clients");
  });
