import { mightFail } from "@/lib/utils";
import { db } from "@/db";
import { totalInsurableNeeds } from "@/db/schema/index";
import { asc, eq, sql } from "drizzle-orm";

const selectAllTotalInsurableNeedsQuery = db
  .select({
    id: totalInsurableNeeds.id,
    purpose: totalInsurableNeeds.purpose,
    priority: totalInsurableNeeds.priority,
    clientId: totalInsurableNeeds.clientId,
  })
  .from(totalInsurableNeeds)
  .where(eq(totalInsurableNeeds.clientId, sql.placeholder("clientId")))
  .orderBy(asc(totalInsurableNeeds.id))
  .prepare("get_all_total_insurable_needs");

// Takes: A Client Id and finds all Total Insurable Needs with that Client Id.
// Returns: The Id, Purpose, Priority, and Client Id for the selected Total Insurable Needs.
//          Or a nullable error.
export async function selectAllTotalInsurableNeeds(clientId: number): Promise<{
  totalInsurableNeeds:
    | {
        id: number;
        purpose: string;
        priority: number;
        clientId: number;
      }[]
    | null;
  error: Error | null;
}> {
  const { data, error } = await mightFail(() =>
    selectAllTotalInsurableNeedsQuery.execute({ clientId })
  );

  return { totalInsurableNeeds: data, error };
}

// Define and export a type based on the success result of the All Total Insurable Needs query.
export type TotalInsurableNeeds = Awaited<
  ReturnType<typeof selectAllTotalInsurableNeedsQuery.execute>
>[number];
