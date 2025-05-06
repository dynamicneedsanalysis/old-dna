import { roundNumericToNearestWholeNumber } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { selectAllBeneficiaries } from "@/db/queries/index";
import type { Beneficiary } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/beneficiaries/schema";
import { DeleteBeneficiaryButton } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/beneficiaries/delete-beneficiary-button";
import { BeneficiaryDialog } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/beneficiaries/beneficiary-dialog";

// Takes: A Client Id number.
export async function BeneficiariesTable({ clientId }: { clientId: number }) {
  // Fetch all Beneficiaries for the Client.
  const { beneficiaries, error } = await selectAllBeneficiaries(clientId);

  if (error) {
    throw error;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Name</TableHead>
          <TableHead className="text-center">
            Desired total target allocation of assets (parts)
          </TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {beneficiaries &&
          beneficiaries?.map((b) => (
            <BeneficiaryTableRow key={b.id} beneficiary={b} />
          ))}
      </TableBody>
    </Table>
  );
}

// Takes: A Beneficiary object.
function BeneficiaryTableRow({ beneficiary }: { beneficiary: Beneficiary }) {
  return (
    <TableRow>
      <TableCell className="text-center font-semibold">
        {beneficiary.name}
      </TableCell>
      <TableCell className="text-center">
        {roundNumericToNearestWholeNumber(beneficiary.allocation)}
      </TableCell>
      <TableCell className="text-center">
        <BeneficiaryDialog mode="edit" beneficiary={beneficiary} />
      </TableCell>
      <TableCell className="text-center">
        <DeleteBeneficiaryButton id={beneficiary.id} />
      </TableCell>
    </TableRow>
  );
}
