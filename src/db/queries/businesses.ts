import { mightFail } from "@/lib/utils";
import { db } from "@/db";
import { businesses } from "@/db/schema/index";
import { and, desc, eq, sql } from "drizzle-orm";
import type { InsertBusiness } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/businesses/schema";

const selectAllBusinessesQuery = db
  .select()
  .from(businesses)
  .where(eq(businesses.clientId, sql.placeholder("clientId")))
  .orderBy(desc(businesses.createdAt))
  .prepare("get_all_businesses");

// Takes: A Client Id.
// Selects all Businesses for a given Client Id.
// Returns: The Businesses and the nullable error value.
export async function selectAllBusinesses(clientId: number) {
  const { data, error } = await mightFail(() =>
    selectAllBusinessesQuery.execute({ clientId })
  );
  return { businesses: data, error };
}

const selectSingleBusinessQuery = db
  .select()
  .from(businesses)
  .where(
    and(
      eq(businesses.id, sql.placeholder("id")),
      eq(businesses.clientId, sql.placeholder("clientId"))
    )
  )
  .prepare("get_single_business");

// Takes: A Business Id and a Client Id.
// Selects a single Business for a given Business Id and Client Id.
// Returns: The Business and the nullable error value.
export async function selectSingleBusiness({
  id,
  clientId,
}: {
  id: number;
  clientId: number;
}) {
  const { data, error } = await mightFail(() =>
    selectSingleBusinessQuery.execute({ id, clientId }).then((res) => res[0])
  );
  return { business: data, error };
}

// Takes: A Client Id and an Insert Business object.
// Inserts the formatted values from the Insert Business into the database.
// Returns: The new Business's Id and the nullable error value.
export async function insertBusiness(
  clientId: number,
  business: InsertBusiness
) {
  const { data, error } = await mightFail(() =>
    db
      .insert(businesses)
      .values({
        clientEbitdaInsuranceContribution:
          business.clientEbitdaInsuranceContribution.toString(),
        clientEbitdaContributed: business.clientEbitdaContributed.toString(),
        clientShareholderInsuranceContribution:
          business.clientShareholderInsuranceContribution.toString(),
        clientSharePercentage: business.clientSharePercentage.toString(),
        purchasePrice: business.purchasePrice.toString(),
        yearAcquired: business.yearAcquired,
        appreciationRate: business.appreciationRate.toString(),
        term: business.term ? business.term.toString() : null,
        name: business.name,
        ebitda: business.ebitda.toString(),
        valuation: business.valuation.toString(),
        toBeSold: business.toBeSold,
        clientId,
      })
      .returning({ id: businesses.id })
      .then((res) => res[0])
  );
  return { id: data?.id, error };
}

// Takes: A Business Id and an Insert Business object.
// Updates the matching Business with the Insert Business data.
// Returns: The nullable error value.
export async function updateBusiness(id: number, business: InsertBusiness) {
  const { error } = await mightFail(() =>
    db
      .update(businesses)
      .set({
        appreciationRate: business.appreciationRate.toString(),
        name: business.name,
        term: business.term ? business.term.toString() : null,
        ebitda: business.ebitda.toString(),
        valuation: business.valuation.toString(),
        clientSharePercentage: business.clientSharePercentage.toString(),
        clientShareholderInsuranceContribution:
          business.clientShareholderInsuranceContribution.toString(),
        clientEbitdaContributed: business.clientEbitdaContributed.toString(),
        clientEbitdaInsuranceContribution:
          business.clientEbitdaInsuranceContribution.toString(),
        purchasePrice: business.purchasePrice.toString(),
        yearAcquired: business.yearAcquired,
        toBeSold: business.toBeSold,
      })
      .where(eq(businesses.id, id))
  );
  return { error };
}

const deleteBusinessQuery = db
  .delete(businesses)
  .where(
    and(
      eq(businesses.id, sql.placeholder("id")),
      eq(businesses.clientId, sql.placeholder("clientId"))
    )
  )
  .returning({ id: businesses.id })
  .prepare("delete_single_business");

// Takes: A Business Id and a Client Id.
// Deletes the matching Business with the given Id and Client Id.
// Returns: The deleted Business's Id and the nullable error value.
export async function deleteBusiness({
  id,
  clientId,
}: {
  id: number;
  clientId: number;
}) {
  const { data, error } = await mightFail(() =>
    deleteBusinessQuery.execute({ id, clientId }).then((res) => res[0])
  );
  return { id: data?.id, error };
}
