import { Heading } from "@/components/ui/heading";
import { BeneficiariesTable } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/beneficiaries/beneficiaries-table";
import { BeneficiaryDialog } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/beneficiaries/beneficiary-dialog";

// Takes: A Client Id number.
export function Beneficiaries({ clientId }: { clientId: number }) {
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <Heading variant="h1">Beneficiaries</Heading>
        <div>
          <BeneficiaryDialog mode="add" />
        </div>
      </div>
      <div className="max-h-[calc(100dvh-72px-350px)] overflow-auto">
        <BeneficiariesTable clientId={clientId} />
      </div>
    </>
  );
}
