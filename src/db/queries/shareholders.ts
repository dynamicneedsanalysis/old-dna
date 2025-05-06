import { mightFail } from "@/lib/utils";
import { db } from "@/db";
import { businesses, keyPeople, shareholders } from "@/db/schema/index";
import { and, eq, sql } from "drizzle-orm";
import type { InsertShareholder } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/shareholders/schema";

// Takes: A Client Id.
// Selects all Businesses for a given Client Id.
// Returns: The Businesses and the nullable error value.
export async function selectAllBusinessShareholders(clientId: number) {
  const { data, error } = await mightFail(() =>
    db.query.businesses.findMany({
      where: eq(businesses.clientId, clientId),
      with: {
        client: true,
        shareholders: true,
      },
    })
  );
  return { businesses: data, error };
}

// Takes: An Insert Shareholder object.
// Inserts the formatted values from the Insert Shareholder into the database.
// Returns: The new Shareholder's Id and the nullable error value.
export async function insertShareholder(shareholder: InsertShareholder) {
  const { data, error } = await mightFail(() =>
    db
      .insert(shareholders)
      .values({
        sharePercentage: shareholder.sharePercentage.toString(),
        insuranceCoverage: shareholder.insuranceCoverage.toString(),
        name: shareholder.name,
        businessId: parseInt(shareholder.business.value),
      })
      .returning({ id: keyPeople.id })
      .execute(shareholder)
      .then((res) => res[0])
  );
  return { id: data?.id, error };
}

// Takes: A Shareholder Id and an Insert Shareholder object.
// Updates the matching Shareholder with the Insert Shareholder data.
// Returns: The nullable error value.
export async function updateShareholder(
  id: number,
  shareholder: InsertShareholder
) {
  const { error } = await mightFail(() =>
    db
      .update(shareholders)
      .set({
        sharePercentage: shareholder.sharePercentage.toString(),
        insuranceCoverage: shareholder.insuranceCoverage.toString(),
        name: shareholder.name,
        businessId: parseInt(shareholder.business.value),
      })
      .where(eq(shareholders.id, id))
  );
  return { error };
}

const deleteShareholderQuery = db
  .delete(shareholders)
  .where(
    and(
      eq(shareholders.id, sql.placeholder("id")),
      eq(shareholders.businessId, sql.placeholder("businessId"))
    )
  )
  .returning({ id: shareholders.id })
  .prepare("delete_shareholder");

// Takes: A Shareholder Id and a Business Id.
// Deletes the matching Shareholder with the given Id and Business Id.
// Returns: The deleted Shareholder's Id and the nullable error value.
export async function deleteShareholder({
  id,
  businessId,
}: {
  id: number;
  businessId: number;
}) {
  const { data, error } = await mightFail(() =>
    deleteShareholderQuery.execute({ id, businessId }).then((res) => res[0])
  );
  return { id: data?.id, error };
}
