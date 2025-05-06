"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { newBusiness, type UpdateNewBusiness } from "@/db/schema/index";
import { eq } from "drizzle-orm";

// Takes: An update new Business object and the Client Id.
// Revalidates the New Business page on completion.
export async function updateNewBusiness(
  updateNewBusiness: UpdateNewBusiness,
  clientId: number
) {
  await db
    .update(newBusiness)
    .set(updateNewBusiness)
    .where(eq(newBusiness.clientId, clientId));
  revalidatePath(`/dashboard/client/${clientId}/new-business`);
}
