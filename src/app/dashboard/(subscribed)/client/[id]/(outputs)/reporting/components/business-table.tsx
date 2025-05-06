"use client";

import { moneyFormatter } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Business } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/businesses/schema";

// Takes: An array of Businesses.
export function BusinessTable({ businesses }: { businesses: Business[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Name</TableHead>
          <TableHead className="text-center">Valuation ($)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {businesses.map((b) => (
          <TableRow key={b.id}>
            <TableCell className="text-center font-medium">{b.name}</TableCell>
            <TableCell className="text-center">
              {moneyFormatter.format(parseFloat(b.valuation))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
