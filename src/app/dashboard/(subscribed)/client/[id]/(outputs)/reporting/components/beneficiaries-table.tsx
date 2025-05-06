"use client";

import { cn, roundNumericToNearestWholeNumber } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Beneficiary } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/beneficiaries/schema";

// Takes: An array of Beneficiaries.
export function BeneficiariesTable({
  beneficiaries,
}: {
  beneficiaries: Beneficiary[];
}) {
  // Find total of all allocation across all Beneficiaries.
  const totalAllocationParts = Math.round(
    beneficiaries.reduce((acc, cur) => acc + parseFloat(cur.allocation), 0)
  );
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className={cn("text-left", {
              "text-center": beneficiaries.length !== 0,
            })}
          >
            Name
          </TableHead>
          <TableHead
            className={cn("text-right", {
              "text-center": beneficiaries.length !== 0,
            })}
          >
            Allocation (parts)
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {beneficiaries.map((b) => (
          <BeneficiaryTableRow
            key={b.id}
            name={b.name}
            allocation={b.allocation}
          />
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="text-center font-bold">Total</TableCell>
          <TableCell className="text-center font-bold">
            {totalAllocationParts}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

// Takes: Name and allocation of a Beneficiary.
function BeneficiaryTableRow({
  name,
  allocation,
}: Pick<Beneficiary, "name" | "allocation">) {
  return (
    <TableRow>
      <TableCell className="text-center font-medium">{name}</TableCell>
      <TableCell className="text-center font-medium">
        {roundNumericToNearestWholeNumber(allocation)}
      </TableCell>
    </TableRow>
  );
}
