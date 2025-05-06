"use client";

import { TableCell, TableRow } from "@/components/ui/table";

// Takes: A parameter string and a string or number value.
export function IncomeReplacementRow({
  parameter,
  value,
}: {
  parameter: string;
  value: string | number;
}) {
  return (
    <TableRow>
      <TableCell className="font-semibold">{parameter}</TableCell>
      <TableCell>{value}</TableCell>
    </TableRow>
  );
}
