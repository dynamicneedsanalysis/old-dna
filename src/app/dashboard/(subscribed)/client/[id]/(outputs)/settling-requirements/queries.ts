import { db } from "@/db";
import { settlingRequirements } from "@/db/schema/index";
import { eq } from "drizzle-orm";

// Takes: The Client Id.
// Returns: The matching Settling Requirements for the Client.
export async function getSettlingRequirements(clientId: number) {
  return await db
    .select()
    .from(settlingRequirements)
    .where(eq(settlingRequirements.clientId, clientId))
    .then((res) => res[0]);
}
