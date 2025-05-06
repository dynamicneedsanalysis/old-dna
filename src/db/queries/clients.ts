import { mightFail } from "@/lib/utils";
import { db } from "@/db";
import {
  budgets,
  clients,
  settlingRequirements,
  newBusiness,
  totalInsurableNeeds,
} from "@/db/schema/index";
import { and, desc, eq, ilike, sql, type Column } from "drizzle-orm";
import { selectAllAssetsWithBeneficiaries } from "@/db/queries/index";
import { calculateTotalNetWorthForCurrentYear } from "@/lib/asset/utils";
import { calculateBudgetRecommendation } from "@/lib/budget/utils";
import type { InsertClient } from "@/app/dashboard/(subscribed)/clients/lib/schema";

const age = (col: Column) => sql<number>`date_part('year', age(${col}))`;

const selectBaseQuery = db.select({
  id: clients.id,
  name: clients.name,
  age: age(clients.birthDate),
  birthDate: clients.birthDate,
  province: clients.province,
  annualIncome: clients.annualIncome,
  liquidityAllocatedTowardsGoals: clients.liquidityAllocatedTowardsGoals,
  taxFreezeAtYear: clients.taxFreezeAtYear,
  lifeExpectancy: clients.lifeExpectancy,
  hasOnboarded: clients.hasOnboarded,
  health: clients.health,
  sex: clients.sex,
  smokingStatus: clients.smokingStatus,
});

const selectAllClientsQuery = selectBaseQuery
  .from(clients)
  .where(eq(clients.kindeId, sql.placeholder("kindeId")))
  .orderBy(desc(clients.createdAt))
  .prepare("get_all_clients");

// Takes: A Kinde Id and an optional name.
// Selects all Clients for a given Kinde Id. If a name is provided, filters Clients by like name.
// Returns: The Clients and the nullable error value.
export async function selectAllClients(kindeId: string, name: string | null) {
  const { data, error } = await mightFail(() =>
    !name
      ? selectAllClientsQuery.execute({ kindeId })
      : selectBaseQuery
          .from(clients)
          .where(
            and(
              eq(clients.kindeId, sql.placeholder("kindeId")),
              ilike(clients.name, `%${name}%`)
            )
          )
          .orderBy(desc(clients.createdAt))
          .execute({ kindeId })
  );
  return { clients: data, error };
}

// Takes: A Client Id and a Kinde Id.
// Selects a single Client for a given Client Id and Kinde Id.
// Returns: The Client and the nullable error value.
export async function selectSingleClient({
  id,
  kindeId,
}: {
  id: number;
  kindeId: string;
}) {
  const { data, error } = await mightFail(() =>
    db.query.clients
      .findFirst({
        extras: {
          age: sql<number>`date_part('year', age(${clients.birthDate}))`.as(
            "age"
          ),
        },
        where: (clients, { eq, and }) =>
          and(
            eq(clients.id, sql.placeholder("id")),
            eq(clients.kindeId, sql.placeholder("kindeId"))
          ),
        with: {
          assets: {
            with: {
              assetBeneficiaries: {
                with: {
                  beneficiaries: true,
                },
              },
            },
          },
          businesses: {
            with: {
              client: true,
              keyPeople: true,
              shareholders: true,
            },
          },
          beneficiaries: {
            with: {
              assetBeneficiaries: true,
            },
          },
          debts: true,
          goals: true,
          budgets: true,
        },
      })
      .prepare("get_single_client")
      .execute({ id, kindeId })
  );
  return { client: data, error };
}

// Export the result of the Query for a Single Client as a type.
export type Client = NonNullable<
  Awaited<ReturnType<typeof selectSingleClient>>["client"]
>;

// Takes: A Client object.
// Inserts the Client into the database.
// Returns: The new Client's Id and the nullable error value.
export async function insertClient(client: typeof clients.$inferInsert) {
  const { data, error } = await mightFail(() =>
    db
      .insert(clients)
      .values({
        annualIncome: client.annualIncome,
        birthDate: client.birthDate,
        province: client.province,
        name: client.name,
        kindeId: client.kindeId,
        liquidityAllocatedTowardsGoals: "100",
        lifeExpectancy: client.lifeExpectancy,
        health: client.health,
        sex: client.sex,
        smokingStatus: client.smokingStatus,
        reasonsWhy: "",
        coverLetter: "",
      })
      .returning({ id: clients.id })
      .then((res) => res[0])
  );
  return { id: data?.id, error };
}

// Takes: A Client Id.
// Inserts the Client's total insurable needs into the database.
// Returns: The nullable data and error results of the mightFail call for database insertion.
export async function insertTotalInsurableNeeds(clientId: number) {
  return await mightFail(() =>
    db.insert(totalInsurableNeeds).values([
      { purpose: "Income Replacement", clientId },
      { purpose: "Tax Burden", clientId },
      { purpose: "Equalization", clientId },
      { purpose: "Debt Current Liability", clientId },
      { purpose: "Goal Shortfall", clientId },
    ])
  );
}

// Takes: A Client Id.
// Inserts the Client's Settling Requirements into the database.
// Returns: The nullable data and error results of the mightFail call for database insertion.
export async function insertSettlingRequirements(clientId: number) {
  return await mightFail(() =>
    db.insert(settlingRequirements).values({ clientId })
  );
}

// Takes: A Client Id.
// Inserts the Client's total insurable needs into the database.
// Returns: The nullable data and error results of the mightFail call for database insertion.
export async function insertNewBusiness(clientId: number) {
  return await mightFail(() => db.insert(newBusiness).values({ clientId }));
}

// Takes: A Client Id and an income value.
// Inserts the Client's Budget into the database.
// Returns: The nullable data and error results of the mightFail call for database insertion.
export async function insertBudget(clientId: number, income: number) {
  const { assets, error: assetsError } =
    await selectAllAssetsWithBeneficiaries(clientId);

  // If selection of assets fails or assets are not found, throw an error.
  if (assetsError) {
    throw assetsError;
  }
  if (!assets) {
    throw new Error("Assets not found");
  }

  // Calculate the total net worth for the current year and use it to get the Budget recommendation.
  const netWorth = calculateTotalNetWorthForCurrentYear(assets);
  const { maxBudget } = calculateBudgetRecommendation(income, netWorth);

  // Insert the Budget into the database.
  return await mightFail(() =>
    db.insert(budgets).values({ income: maxBudget.toString(), clientId })
  );
}

// Takes: A Client Id and an Insert Client object.
// Updates the matching Client with the Insert Client data.
// Returns: The nullable error value.
export async function updateClient(id: number, client: InsertClient) {
  const { error } = await mightFail(() =>
    db
      .update(clients)
      .set({
        annualIncome: client.annualIncome.toString(),
        birthDate: client.birthDate,
        province: client.province,
        name: client.name,
        lifeExpectancy: client.lifeExpectancy,
        health: client.health,
        sex: client.sex,
        smokingStatus: client.smokingStatus,
      })
      .where(eq(clients.id, id))
  );
  return { error };
}

const deleteClientQuery = db
  .delete(clients)
  .where(
    and(
      eq(clients.id, sql.placeholder("id")),
      eq(clients.kindeId, sql.placeholder("kindeId"))
    )
  )
  .returning({ id: clients.id })
  .prepare("delete_single_client");

// Takes: A Client Id and a Kinde Id.
// Deletes the Client with the given Id and Kinde Id.
// Return: The deleted Client's Id and the nullable error value.
export const deleteClient = async ({
  id,
  kindeId,
}: {
  id: number;
  kindeId: string;
}) => {
  const { data, error } = await mightFail(() =>
    deleteClientQuery.execute({ id, kindeId }).then((res) => res[0])
  );
  return { id: data?.id, error };
};

const deleteAllClientsQuery = db
  .delete(clients)
  .where(eq(clients.kindeId, sql.placeholder("kindeId")))
  .prepare("delete_all_clients");

// Takes: A Kinde Id.
// Deletes all Clients with the given Kinde Id.
// Returns: The nullable error value.
export const deleteAllClients = async ({ kindeId }: { kindeId: string }) => {
  const { error } = await mightFail(() =>
    deleteAllClientsQuery.execute({ kindeId })
  );
  return { error };
};

const selectTaxFreezeAtYearAndLifeExpectancyQuery = db
  .select({
    id: clients.id,
    age: age(clients.birthDate),
    taxFreezeAtYear: clients.taxFreezeAtYear,
    lifeExpectancy: clients.lifeExpectancy,
  })
  .from(clients)
  .where(eq(clients.id, sql.placeholder("clientId")))
  .prepare("get_tax_freeze_at_year_and_life_expectancy");

// Export the result of the Query for Tax Freeze with Year and Life Expectancy as a type.
export type TaxFreezeAtYearClient = Awaited<
  ReturnType<typeof selectTaxFreezeAtYearAndLifeExpectancyQuery.execute>
>[0];

// Takes: A Client Id.
// Selects specific tax freeze related Client fields for a given Client Id.
// Returns: The Client and the nullable error value.
export async function selectTaxFreezeAtYearAndLifeExpectancy(clientId: number) {
  const { data, error } = await mightFail(() =>
    selectTaxFreezeAtYearAndLifeExpectancyQuery
      .execute({ clientId })
      .then((res) => res[0])
  );
  return { client: data, error };
}

// Takes: A Client Id
// Updates the Client with the given Id to have onboarded.
// Returns: The nullable error value.
export async function updateClientOnboardingStatus(id: number) {
  const { error } = await mightFail(() =>
    db
      .update(clients)
      .set({
        hasOnboarded: true,
      })
      .where(eq(clients.id, id))
  );
  return { error };
}

// Takes: A Client Id and a Kinde Id.
//  Selects a Client with the given Id and Kinde Id and gets their 'cover letter'.
// Returns: The 'cover letter' and the nullable error value.
export async function getClientCoverLetter({
  id,
  kindeId,
}: {
  id: number;
  kindeId: string;
}) {
  const { data, error } = await mightFail(() =>
    db
      .select()
      .from(clients)
      .where(and(eq(clients.id, id), eq(clients.kindeId, kindeId)))
      .then((res) => res[0])
  );

  const coverLetter = data?.coverLetter ?? "";

  return { coverLetter, error };
}

// Takes: A Client Id and a Kinde Id.
// Selects a Client with the given Id and Kinde Id and gets their 'reasons why'.
// Returns: The 'reasons why' and the nullable error value.
export async function getClientReasonsWhy({
  id,
  kindeId,
}: {
  id: number;
  kindeId: string;
}) {
  const { data, error } = await mightFail(() =>
    db
      .select()
      .from(clients)
      .where(and(eq(clients.id, id), eq(clients.kindeId, kindeId)))
      .then((res) => res[0])
  );

  const reasonsWhy = data?.reasonsWhy ?? "";

  return { reasonsWhy, error };
}
