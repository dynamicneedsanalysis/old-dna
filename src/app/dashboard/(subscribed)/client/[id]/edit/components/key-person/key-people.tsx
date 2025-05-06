import { selectAllBusinessKeyPeople } from "@/db/queries/index";
import { Heading } from "@/components/ui/heading";
import { KeyPersonDialog } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/key-person/key-person-dialog";
import { KeyPeopleTable } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/key-person/key-people-table";

// Takes: A Client Id.
export async function KeyPeople({ clientId }: { clientId: number }) {
  // Fetch all Business for the Key People.
  const { businesses, error } = await selectAllBusinessKeyPeople(clientId);
  if (error) {
    throw error;
  }
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <Heading variant="h1">Key People</Heading>
        {businesses && <KeyPersonDialog mode="add" businesses={businesses} />}
      </div>
      <div>{businesses && <KeyPeopleTable businesses={businesses} />}</div>
    </>
  );
}
