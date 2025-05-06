import { mightFail } from "@/lib/utils";
import { db } from "@/db";
import { debts } from "@/db/schema/index";
import { and, desc, eq, sql } from "drizzle-orm";
import type { InsertDebt } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/debts/schema";

const selectAllDebtsQuery = db
  .select()
  .from(debts)
  .where(eq(debts.clientId, sql.placeholder("clientId")))
  .orderBy(desc(debts.createdAt))
  .prepare("get_all_debts");

// Takes: A Client Id.
// Selects all Debts for a given Client Id.
// Returns: The Debts and the nullable error value.
export async function selectAllDebts(clientId: number) {
  const { data, error } = await mightFail(() =>
    selectAllDebtsQuery.execute({ clientId })
  );
  return { debts: data, error };
}

const selectSingleDebtQuery = db
  .select()
  .from(debts)
  .where(
    and(
      eq(debts.id, sql.placeholder("id")),
      eq(debts.clientId, sql.placeholder("clientId"))
    )
  )
  .prepare("get_single_debt");

// Takes: A Debt Id and a Client Id.
// Selects a single Debt for a given Debt Id and Client Id.
// Returns: The Debt and the nullable error value.
export async function selectSingleDebt({
  id,
  clientId,
}: {
  id: number;
  clientId: number;
}) {
  const { data, error } = await mightFail(() =>
    selectSingleDebtQuery.execute({ id, clientId })
  );
  return { debt: data, error };
}

// Takes: A Client Id and an Insert Debt object.
// Inserts the formatted values from the Insert Debt into the database.
// Returns: The new Debt's Id and the nullable error value.
export async function insertDebt(clientId: number, debt: InsertDebt) {
  const { data, error } = await mightFail(() =>
    db
      .insert(debts)
      .values({
        annualPayment: debt.annualPayment.toString(),
        initialValue: debt.initialValue.toString(),
        insurableFutureValue: "0.00",
        rate: debt.rate.toString(),
        term: debt.term.toString(),
        name: debt.name,
        yearAcquired: debt.yearAcquired,
        clientId,
      })
      .returning({ id: debts.id })
      .execute(debt)
      .then((res) => res[0])
  );
  return { id: data?.id, error };
}

// Takes: A Debt Id and an Insert Debt object.
// Updates the matching Debt with the Insert Debt data.
// Returns: The nullable error value.
export async function updateDebt(id: number, debt: InsertDebt) {
  const { error } = await mightFail(() =>
    db
      .update(debts)
      .set({
        annualPayment: debt.annualPayment.toString(),
        initialValue: debt.initialValue.toString(),
        rate: debt.rate.toString(),
        name: debt.name,
        term: debt.term.toString(),
        yearAcquired: debt.yearAcquired,
      })
      .where(eq(debts.id, id))
  );
  return { error };
}

const deleteDebtQuery = db
  .delete(debts)
  .where(
    and(
      eq(debts.id, sql.placeholder("id")),
      eq(debts.clientId, sql.placeholder("clientId"))
    )
  )
  .returning({ id: debts.id })
  .prepare("delete_single_debt");

// Takes: A Debt Id and a Client Id.
// Deletes the matching Debt with the given Id.
// Returns: The deleted Debt's Id and the nullable error value.
export async function deleteDebt({
  id,
  clientId,
}: {
  id: number;
  clientId: number;
}) {
  const { data, error } = await mightFail(() =>
    deleteDebtQuery.execute({ id, clientId }).then((res) => res[0])
  );
  return { id: data?.id, error };
}
