import { mightFail } from "@/lib/utils";
import { db } from "@/db";
import { goals } from "@/db/schema/index";
import { and, desc, eq, sql } from "drizzle-orm";
import type { InsertGoal } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/goals/schema";

const selectAllGoalsQuery = db
  .select()
  .from(goals)
  .where(eq(goals.clientId, sql.placeholder("clientId")))
  .prepare("get_all_goals");

// Takes: A Client Id.
// Selects all Goals for a given Client Id.
// Returns: The Goals and the nullable error value.
export async function selectAllGoals(clientId: number) {
  const { data, error } = await mightFail(() =>
    selectAllGoalsQuery.execute({ clientId })
  );
  return { goals: data, error };
}

const selectSingleGoalQuery = db
  .select()
  .from(goals)
  .where(
    and(
      eq(goals.id, sql.placeholder("id")),
      eq(goals.clientId, sql.placeholder("clientId"))
    )
  )
  .orderBy(desc(goals.createdAt))
  .prepare("get_single_goal");

// Takes: A Goal Id and a Client Id.
// Selects a Goal from the given Goal Id and Client Id.
// Returns: The Goal and the nullable error value.
export async function selectSingleGoal({
  id,
  clientId,
}: {
  id: number;
  clientId: number;
}) {
  const { data, error } = await mightFail(() =>
    selectSingleGoalQuery.execute({ id, clientId }).then((res) => res[0])
  );
  return { goal: data, error };
}

// Takes: A Client Id and an Insert Goal object.
// Inserts the formatted values from the Insert Goal into the database.
// Returns: The new Goal's Id and the nullable error value.
export async function insertGoal(clientId: number, goal: InsertGoal) {
  const { data, error } = await mightFail(() =>
    db
      .insert(goals)
      .values({
        amount: goal.amount.toString(),
        isPhilanthropic: goal.isPhilanthropic,
        name: goal.name,
        clientId,
      })
      .returning({ id: goals.id })
      .then((res) => res[0])
  );
  return { id: data?.id, error };
}

// Takes: A Goal Id and an Insert Goal object.
// Updates the matching Goal with the Insert Goal data.
// Returns: The nullable error value.
export async function updateGoal(id: number, goal: InsertGoal) {
  const { error } = await mightFail(() =>
    db
      .update(goals)
      .set({
        amount: goal.amount.toString(),
        isPhilanthropic: goal.isPhilanthropic,
        name: goal.name,
      })
      .where(eq(goals.id, id))
  );
  return { error };
}

const deleteGoalQuery = db
  .delete(goals)
  .where(
    and(
      eq(goals.id, sql.placeholder("id")),
      eq(goals.clientId, sql.placeholder("clientId"))
    )
  )
  .returning({ id: goals.id })
  .prepare("delete_single_goal");

// Takes: A Goal Id and a Client Id.
// Deletes the matching Goal with the given Id and Client Id.
// Returns: The deleted Goal's Id and the nullable error value.
export async function deleteGoal({
  id,
  clientId,
}: {
  id: number;
  clientId: number;
}) {
  const { data, error } = await mightFail(() =>
    deleteGoalQuery.execute({ id, clientId }).then((res) => res[0])
  );
  return { id: data?.id, error };
}
