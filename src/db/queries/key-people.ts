import { mightFail } from "@/lib/utils";
import { db } from "@/db";
import { businesses, debts, keyPeople } from "@/db/schema/index";
import { and, eq, sql } from "drizzle-orm";
import type { InsertKeyPerson } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/key-person/schema";

// Takes: A Client Id.
// Selects all Businesses with a Client and Key People that match the Client Id.
// Returns: The Businesses and the nullable error value.
export async function selectAllBusinessKeyPeople(clientId: number) {
  const { data, error } = await mightFail(() =>
    db.query.businesses.findMany({
      where: eq(businesses.clientId, clientId),
      with: {
        keyPeople: true,
        client: true,
      },
    })
  );
  return { businesses: data, error };
}

// Takes: An Insert Key Person object.
// Inserts the formatted values from the Insert Key Person into the database.
// Returns: The new Key Person's Id and the nullable error value.
export async function insertKeyPerson(keyPerson: InsertKeyPerson) {
  const { data, error } = await mightFail(() =>
    db
      .insert(keyPeople)
      .values({
        ebitdaContributionPercentage:
          keyPerson.ebitdaContributionPercentage.toString(),
        insuranceCoverage: keyPerson.insuranceCoverage.toString(),
        name: keyPerson.name,
        businessId: parseInt(keyPerson.business.value),
      })
      .returning({ id: keyPeople.id })
      .then((res) => res[0])
  );
  return { id: data?.id, error };
}

// Takes: A Key Person Id and an Insert Key Person object.
// Updates the matching Key Person with the Insert Key Person data.
// Returns: The nullable error value.
export async function updateKeyPerson(id: number, keyPerson: InsertKeyPerson) {
  const { error } = await mightFail(() =>
    db
      .update(keyPeople)
      .set({
        ebitdaContributionPercentage:
          keyPerson.ebitdaContributionPercentage.toString(),
        insuranceCoverage: keyPerson.insuranceCoverage.toString(),
        name: keyPerson.name,
        businessId: parseInt(keyPerson.business.value),
      })
      .where(eq(keyPeople.id, id))
  );
  return { error };
}

const deleteKeyPersonQuery = db
  .delete(keyPeople)
  .where(
    and(
      eq(keyPeople.id, sql.placeholder("id")),
      eq(keyPeople.businessId, sql.placeholder("businessId"))
    )
  )
  .returning({ id: debts.id })
  .prepare("delete_single_key_person");

// Takes: A Key Person Id and a Business Id.
// Deletes the matching Key Person with the given Id and Business Id.
// Returns: The deleted Key Person's Id and the nullable error value.
export async function deleteKeyPerson({
  id,
  businessId,
}: {
  id: number;
  businessId: number;
}) {
  const { data, error } = await mightFail(() =>
    deleteKeyPersonQuery.execute({ id, businessId }).then((res) => res[0])
  );
  return { id: data?.id, error };
}
