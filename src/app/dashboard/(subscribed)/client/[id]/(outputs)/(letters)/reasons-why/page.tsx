import { getUser } from "@/lib/kinde";
import { getClientReasonsWhy } from "@/db/queries/clients";
import ReasonsWhyLetter from "./reasons-why-letter";

export const dynamic = "force-dynamic";

// Takes: A promise that resolves to an object with an Id value.
export default async function ReasonsWhyPage(props: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await props.params;

  // Get the Client Id and User, then use them to fetch the "Reasons Why" letter.

  const user = await getUser();

  const { reasonsWhy, error } = await getClientReasonsWhy({
    id,
    kindeId: user.id,
  });
  if (error) {
    throw error;
  }

  return <ReasonsWhyLetter clientId={id} reasonsWhy={reasonsWhy} />;
}
