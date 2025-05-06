import {
  formatPercentage,
  moneyFormatter,
  roundNumericToNearestWholeNumber,
} from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { selectAllDebts } from "@/db/queries/index";
import type { Debt } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/debts/schema";
import { DeleteDebtButton } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/debts/delete-debt-button";
import { DebtDialog } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/debts/debt-dialog";

// Takes: A Client Id.
export async function DebtsTable({ clientId }: { clientId: number }) {
  // Fetch all Debts for the Client.
  const { debts, error } = await selectAllDebts(clientId);

  if (error) {
    throw error;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Name</TableHead>
          <TableHead className="text-center">Initial Value</TableHead>
          <TableHead className="text-center">Interest Rate</TableHead>
          <TableHead className="text-center">Annual payment</TableHead>
          <TableHead className="text-center">Years Acquired</TableHead>
          <TableHead className="text-center">Actual term</TableHead>
          <TableHead></TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {debts && debts.map((d) => <DebtTableRow key={d.id} debt={d} />)}
      </TableBody>
    </Table>
  );
}

// Takes: A Debt object.
function DebtTableRow({ debt }: { debt: Debt }) {
  return (
    <TableRow>
      <TableCell className="text-center font-semibold">{debt.name}</TableCell>
      <TableCell className="text-center">
        {moneyFormatter.format(parseFloat(debt.initialValue))}
      </TableCell>
      <TableCell className="text-center">
        {formatPercentage(parseFloat(debt.rate))}
      </TableCell>
      <TableCell className="text-center">
        {moneyFormatter.format(parseFloat(debt.annualPayment))}
      </TableCell>
      <TableCell className="text-center">{debt.yearAcquired}</TableCell>
      <TableCell className="text-center">
        {roundNumericToNearestWholeNumber(debt.term)} years
      </TableCell>
      <TableCell className="text-center">
        <DebtDialog mode="edit" debt={debt} />
      </TableCell>
      <TableCell className="text-center">
        <DeleteDebtButton id={debt.id} />
      </TableCell>
    </TableRow>
  );
}
