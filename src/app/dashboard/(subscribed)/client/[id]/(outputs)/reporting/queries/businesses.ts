import { mightFail } from "@/lib/utils";
import { db } from "@/db";
import { businesses } from "@/db/schema/index";
import { eq } from "drizzle-orm";

// Takes: A Client Id and finds all Businesses with that Client Id.
// Orders the Key People and Shareholders by descending Id.
// Returns: The selected Businesses or a nullable error.
export async function selectAllBusinessKeyPeopleAndShareholders(
  clientId: number
) {
  const { data, error } = await mightFail(() =>
    db.query.businesses.findMany({
      where: eq(businesses.clientId, clientId),
      with: {
        client: true,
        keyPeople: {
          orderBy: (keyPeople, { desc }) => [desc(keyPeople.id)],
        },
        shareholders: {
          orderBy: (shareholders, { desc }) => [desc(shareholders.id)],
        },
      },
    })
  );

  return { businesses: data, error };
}
