"use server";

import { revalidatePath } from "next/cache";
import { mightFail } from "@/lib/utils";
import { db } from "@/db";
import { budgets } from "@/db/schema/index";
import { eq } from "drizzle-orm";

// Takes: An Id and an income value.
// Updates the Budget and clears the cache for the layout path
// Returns: A nullable error.
export async function updateBudgetIncome(
  id: number,
  income: string
): Promise<{ error: Error | null }> {
  const { error } = await mightFail(() =>
    db
      .update(budgets)
      .set({
        income,
      })
      .where(eq(budgets.id, id))
  );
  revalidatePath("/", "layout");
  return { error };
}
