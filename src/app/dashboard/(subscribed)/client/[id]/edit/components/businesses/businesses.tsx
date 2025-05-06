import { Heading } from "@/components/ui/heading";
import { BusinessesTable } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/businesses/businesses-table";
import { BusinessDialog } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/businesses/business-dialog";

// Takes: A Client Id number.
export function Businesses({ clientId }: { clientId: number }) {
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <Heading variant="h1">Businesses</Heading>
        <BusinessDialog mode="add" />
      </div>
      <div className="max-h-[calc(100dvh-72px-350px)] overflow-auto">
        <BusinessesTable clientId={clientId} />
      </div>
    </>
  );
}
