"use client";

import { moneyFormatter } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Debt } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/debts/schema";

// Takes: An array of Debts.
export function DebtsTable({ debts }: { debts: Debt[] }) {
  // Calculate the total initial value of all debts.
  const totalInitialValue = debts.reduce(
    (acc, cur) => acc + parseFloat(cur.initialValue),
    0
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Name</TableHead>
          <TableHead className="text-center">Initial Value ($)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {debts.map((d) => (
          <DebtsTableRow key={d.id} debt={d} />
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="text-center">Total</TableCell>
          <TableCell className="text-center">
            {moneyFormatter.format(totalInitialValue)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

function DebtsTableRow({ debt }: { debt: Debt }) {
  return (
    <TableRow>
      <TableCell className="text-center font-medium">{debt.name}</TableCell>
      <TableCell className="text-center font-medium">
        {moneyFormatter.format(parseFloat(debt.initialValue))}
      </TableCell>
    </TableRow>
  );
}
