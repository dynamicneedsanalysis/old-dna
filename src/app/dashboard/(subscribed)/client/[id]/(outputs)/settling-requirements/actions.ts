"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
  settlingRequirements,
  type UpdateSettlingRequirements,
} from "@/db/schema/index";
import { eq } from "drizzle-orm";

// Takes: An update Settling Requirements object and the Client Id.
// Revalidates the Settling Requirements page on completion.
export async function updateSettlingRequirements(
  updateSettlingRequirement: UpdateSettlingRequirements,
  clientId: number
) {
  await db
    .update(settlingRequirements)
    .set(updateSettlingRequirement)
    .where(eq(settlingRequirements.clientId, clientId));
  revalidatePath(`/dashboard/client/${clientId}/settling-requirements`);
}
