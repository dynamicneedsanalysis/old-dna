import { getClientCoverLetter } from "@/db/queries/clients";
import CoverLetter from "./cover-letter";
import { getUser } from "@/lib/kinde";

export const dynamic = "force-dynamic";

// Takes: A promise that resolves to an object with an Id value.
export default async function CoverLetterPage(props: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await props.params;

  const user = await getUser();

  const { coverLetter, error } = await getClientCoverLetter({
    id,
    kindeId: user.id,
  });

  if (error) {
    throw error;
  }

  return <CoverLetter clientId={id} coverLetter={coverLetter} />;
}
