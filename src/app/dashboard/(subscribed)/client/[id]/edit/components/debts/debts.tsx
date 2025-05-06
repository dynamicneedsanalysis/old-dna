import { Heading } from "@/components/ui/heading";
import { DebtsTable } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/debts/debts-table";
import { DebtDialog } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/debts/debt-dialog";

// Takes: A Client Id.
export function Debts({ clientId }: { clientId: number }) {
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <Heading variant="h1">Debts</Heading>
        <DebtDialog mode="add" />
      </div>
      <div className="max-h-[calc(100dvh-72px-350px)] overflow-auto">
        <DebtsTable clientId={clientId} />
      </div>
    </>
  );
}
