"use server";

import { revalidatePath } from "next/cache";
import { ownsClientProcedure } from "@/procedures/auth/actions";
import { updateClientOnboardingStatus } from "@/db/queries/index";

// Uses ownsClientProcedure to check if the User owns the client.
// Returns: A success boolean and a message string.
export const updateClientOnboardingAction = ownsClientProcedure
  .createServerAction()
  .handler(async ({ ctx }) => {
    // Update the client onboarding status.
    // On success, clear the cache from layout and return a success message.
    const { error } = await updateClientOnboardingStatus(ctx.clientId);

    if (error) {
      throw error;
    }
    revalidatePath("/", "layout");

    return {
      success: true,
      message: "Client onboarding status updated successfully.",
    };
  });
