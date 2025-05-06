import { selectAllBusinessShareholders } from "@/db/queries/index";
import { Heading } from "@/components/ui/heading";
import { ShareholderDialog } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/shareholders/shareholder-dialog";
import { ShareholdersTable } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/shareholders/shareholders-table";

// Takes: A Client Id.
export async function Shareholders({ clientId }: { clientId: number }) {
  // Get all Shareholder for the Businesses of the passed Client Id.
  const { businesses, error } = await selectAllBusinessShareholders(clientId);
  if (error) {
    throw error;
  }
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <Heading variant="h1">Shareholders</Heading>
        {businesses && <ShareholderDialog mode="add" businesses={businesses} />}
      </div>
      <div>{businesses && <ShareholdersTable businesses={businesses} />}</div>
    </>
  );
}
