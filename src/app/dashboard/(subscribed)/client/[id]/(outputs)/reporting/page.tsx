import protectRoute from "@/lib/auth/protect-route";
import { Pdf } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components/pdf";

// Takes: A promise that resolves to an object with an Id value.
export default async function Reporting(props: {
  params: Promise<{ id: number }>;
}) {
  // Check user authentication and get the Client Id from the params.
  const { id } = await props.params;
  await protectRoute();

  return <Pdf clientId={id} />;
}
