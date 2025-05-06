import { mightFail } from "@/lib/utils";
import { db } from "@/db";
import { budgets } from "@/db/schema/index";
import { asc, eq, sql } from "drizzle-orm";

const selectSingleBudgetQuery = db
  .select({
    id: budgets.id,
    income: budgets.income,
    clientId: budgets.clientId,
  })
  .from(budgets)
  .where(eq(budgets.clientId, sql.placeholder("clientId")))
  .orderBy(asc(budgets.id))
  .prepare("get_single_budget");

// Takes: A Client Id and finds the budget for that Client.
// Returns: The Budget Id, Income, and Client Id of the selected Budget or a nullable error.
export async function selectSingleBudget(clientId: number) {
  const { data, error } = await mightFail(() =>
    selectSingleBudgetQuery.execute({ clientId }).then((result) => result[0])
  );
  return { budget: data, error };
}

// Define and export a type based on the success result of the Single Budget query.
export type Budget = Awaited<
  ReturnType<typeof selectSingleBudgetQuery.execute>
>[number];
