import { mightFail } from "@/lib/utils";
import { db } from "@/db";
import { beneficiaries } from "@/db/schema/index";
import { and, desc, eq, sql } from "drizzle-orm";
import type { InsertBeneficiary } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/beneficiaries/schema";

const selectAllBeneficiariesQuery = db
  .select({
    id: beneficiaries.id,
    name: beneficiaries.name,
    allocation: beneficiaries.allocation,
  })
  .from(beneficiaries)
  .where(eq(beneficiaries.clientId, sql.placeholder("clientId")))
  .orderBy(desc(beneficiaries.createdAt))
  .prepare("get_all_beneficiaries");

// Takes: A Client Id.
// Selects all Beneficiaries for a given Client Id.
// Returns: The Beneficiaries and the nullable error value.
export async function selectAllBeneficiaries(clientId: number) {
  const { data, error } = await mightFail(() =>
    selectAllBeneficiariesQuery.execute({ clientId })
  );
  return { beneficiaries: data, error };
}

const selectSingleBeneficiaryQuery = db
  .select()
  .from(beneficiaries)
  .where(
    and(
      eq(beneficiaries.id, sql.placeholder("id")),
      eq(beneficiaries.clientId, sql.placeholder("clientId"))
    )
  )
  .prepare("get_single_beneficiary");

// Takes: A Beneficiary Id and a Client Id.
// Selects a single Beneficiary for a given Beneficiary Id and Client Id.
// Returns: The Beneficiary and the nullable error value.
export async function selectSingleBeneficiary({
  id,
  clientId,
}: {
  id: number;
  clientId: number;
}) {
  const { data, error } = await mightFail(() =>
    selectSingleBeneficiaryQuery.execute({ id, clientId }).then((res) => res[0])
  );
  return { beneficiary: data, error };
}

// Takes: A Client Id and an Insert Beneficiary object.
// Inserts the values from the Insert Beneficiary into the database.
// Returns: The new Beneficiary's Id and the nullable error value.
export async function insertBeneficiary(
  clientId: number,
  beneficiary: InsertBeneficiary
) {
  const { data, error } = await mightFail(() =>
    db
      .insert(beneficiaries)
      .values({
        allocation: beneficiary.allocation.toString(),
        name: beneficiary.name,
        clientId,
      })
      .returning({ id: beneficiaries.id })
      .then((res) => res[0])
  );
  return { id: data?.id, error };
}

// Takes: A Beneficiary Id and an Insert Beneficiary object.
// Updates the matching Beneficiary with the Insert Beneficiary data.
// Returns: The nullable error value.
export async function updateBeneficiary(
  id: number,
  beneficiary: InsertBeneficiary
) {
  const { error } = await mightFail(() =>
    db
      .update(beneficiaries)
      .set({
        allocation: beneficiary.allocation.toString(),
        name: beneficiary.name,
      })
      .where(eq(beneficiaries.id, id))
  );
  return { error };
}

const deleteBeneficiaryQuery = db
  .delete(beneficiaries)
  .where(
    and(
      eq(beneficiaries.id, sql.placeholder("id")),
      eq(beneficiaries.clientId, sql.placeholder("clientId"))
    )
  )
  .returning({ id: beneficiaries.id })
  .prepare("delete_single_beneficiary");

// Takes: A Beneficiary Id and a Client Id.
// Deletes the matching Beneficiary with the given Id.
// Returns: The deleted Beneficiary's Id and the nullable error value.
export async function deleteBeneficiary({
  id,
  clientId,
}: {
  id: number;
  clientId: number;
}) {
  const { data, error } = await mightFail(() =>
    deleteBeneficiaryQuery.execute({ id, clientId }).then((res) => res[0])
  );
  return { id: data?.id, error };
}
