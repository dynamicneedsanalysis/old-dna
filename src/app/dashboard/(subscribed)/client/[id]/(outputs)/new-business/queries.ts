import { db } from "@/db";
import { newBusiness } from "@/db/schema/index";
import { eq } from "drizzle-orm";

// Takes: The Client Id.
// Returns: The matching New Business for the Client.
export async function getNewBusiness(clientId: number) {
  return await db
    .select()
    .from(newBusiness)
    .where(eq(newBusiness.clientId, clientId))
    .then((res) => res[0]);
}
