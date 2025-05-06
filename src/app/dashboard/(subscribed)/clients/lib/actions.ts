"use server";

import { revalidatePath } from "next/cache";
import { authProcedure } from "@/procedures/auth/actions";
import {
  insertBudget,
  insertClient,
  insertSettlingRequirements,
  insertTotalInsurableNeeds,
} from "@/db/queries/index";
import { insertClientSchema } from "@/app/dashboard/(subscribed)/clients/lib/schema";

// Uses auth procedure,
// Takes: An Insert Client schema.
// Inserts a new Client and the related data.
export const createNewClient = authProcedure
  .createServerAction()
  .input(insertClientSchema)
  .handler(async ({ input, ctx }) => {
    try {
      // Insert the client into the database and get the Id of the new Client.
      const { id } = await insertClient({
        ...input,
        annualIncome: input.annualIncome.toString(),
        kindeId: ctx.user.id,
        liquidityAllocatedTowardsGoals: "100",
      });

      if (!id) throw new Error("Failed to insert client");

      // If insertion is successful, insert the related Client data and clear the cache of the Clients page.
      await insertTotalInsurableNeeds(id);

      await insertSettlingRequirements(id);

      await insertBudget(id, input.annualIncome);

      revalidatePath("/dashboard/clients");
    } catch (error) {
      // On error, throw a custom error message.
      console.log(error);
      throw new Error(
        "Something went wrong with adding the client to the database"
      );
    }
  });
