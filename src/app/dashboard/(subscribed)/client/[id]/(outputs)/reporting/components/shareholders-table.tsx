import React from "react";
import { cn, formatPercentage, moneyFormatter } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BusinessShareholder } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/shareholders/schema";

// Takes: An array of Business Shareholders.
export async function ShareholdersTable({
  businesses,
}: {
  businesses: BusinessShareholder[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead className="text-center">Name</TableHead>
          <TableHead className="text-center">Share Percentage</TableHead>
          <TableHead className="text-center">Insurance Coverage</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {businesses.flatMap((business) => {
          return [
            // Business Row
            <TableRow
              key={`business-${business.id}`} // Unique key for business row
              className={cn({
                "border-b border-black": business.shareholders.length == 0,
              })}
            >
              <TableCell className="text-center font-semibold">
                {business.name}
              </TableCell>
              <TableCell className="text-center">
                {business.client.name}
              </TableCell>
              <TableCell className="text-center">
                {formatPercentage(parseFloat(business.clientSharePercentage))}
              </TableCell>
              <TableCell className="text-center">
                {moneyFormatter.format(
                  parseFloat(business.clientShareholderInsuranceContribution)
                )}
              </TableCell>
            </TableRow>,
            // Shareholder Rows
            ...business.shareholders.map((shareholder, i) => (
              <TableRow
                key={`${business.id}-shareholder-${shareholder.id}`} // Unique key for shareholder row
                className={cn({
                  "border-b border-black":
                    business.shareholders.length - 1 === i,
                })}
              >
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-center">
                  {shareholder.name}
                </TableCell>
                <TableCell className="text-center">
                  {formatPercentage(parseFloat(shareholder.sharePercentage))}
                </TableCell>
                <TableCell className="text-center">
                  {moneyFormatter.format(
                    parseFloat(shareholder.insuranceCoverage)
                  )}
                </TableCell>
              </TableRow>
            )),
          ];
        })}
      </TableBody>
    </Table>
  );
}
