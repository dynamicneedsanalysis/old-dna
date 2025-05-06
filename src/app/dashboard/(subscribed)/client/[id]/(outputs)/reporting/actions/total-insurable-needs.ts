"use server";

import { revalidatePath } from "next/cache";
import { mightFail } from "@/lib/utils";
import { db } from "@/db";
import {
  keyPeople,
  shareholders,
  totalInsurableNeeds,
} from "@/db/schema/index";
import { eq } from "drizzle-orm";

// Takes: An Id and an priority value.
// Updates the Total Insurable Needs and clears the cache for the layout path.
// Returns: A nullable error.
export async function updateTotalInsurableNeeds(
  id: number,
  priority: number
): Promise<{ error: Error | null }> {
  const { error } = await mightFail(() =>
    db
      .update(totalInsurableNeeds)
      .set({
        priority,
      })
      .where(eq(totalInsurableNeeds.id, id))
  );
  revalidatePath("/", "layout");
  return { error };
}

// Takes: An Id and an priority value.
// Updates the Key Person and clears the cache for the layout path.
// Returns: A nullable error.
export async function updateKeyPersonPriority(
  id: number,
  priority: number
): Promise<{ error: Error | null }> {
  const { error } = await mightFail(() =>
    db
      .update(keyPeople)
      .set({
        priority,
      })
      .where(eq(keyPeople.id, id))
  );
  revalidatePath("/", "layout");
  return { error };
}

// Takes: An Id and an priority value.
// Updates the Shareholder and clears the cache for the layout path.
// Returns: A nullable error.
export async function updateShareholderPriority(
  id: number,
  priority: number
): Promise<{ error: Error | null }> {
  const { error } = await mightFail(() =>
    db
      .update(shareholders)
      .set({
        priority,
      })
      .where(eq(shareholders.id, id))
  );
  revalidatePath("/", "layout");
  return { error };
}
