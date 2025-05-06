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
import { DeleteShareholderButton } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/shareholders/delete-shareholder-button";
import { ShareholderDialog } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/shareholders/shareholder-dialog";

// Takes: An array of Business Shareholder objects.
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
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {businesses.flatMap((b, businessIndex) => {
          return [
            // Business Row
            <TableRow
              key={`${b.id}-business-${businessIndex}`}
              className={cn({
                "border-b border-black": b.shareholders.length === 0,
              })}
            >
              <TableCell className="text-center font-semibold">
                {b.name}
              </TableCell>
              <TableCell className="text-center">{b.client.name}</TableCell>
              <TableCell className="text-center">
                {formatPercentage(parseFloat(b.clientSharePercentage))}
              </TableCell>
              <TableCell className="text-center">
                {moneyFormatter.format(
                  parseFloat(b.clientShareholderInsuranceContribution)
                )}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>,
            // Shareholder Rows
            ...b.shareholders.map((s, shareholderIndex) => (
              <TableRow
                key={`${b.id}-shareholder-${s.id}-${shareholderIndex}`}
                className={cn({
                  "border-b border-black":
                    b.shareholders.length - 1 === shareholderIndex,
                })}
              >
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-center">{s.name}</TableCell>
                <TableCell className="text-center">
                  {formatPercentage(parseFloat(s.sharePercentage))}
                </TableCell>
                <TableCell className="text-center">
                  {moneyFormatter.format(parseFloat(s.insuranceCoverage))}
                </TableCell>
                <TableCell className="text-right">
                  <ShareholderDialog
                    mode="edit"
                    shareholder={s}
                    businesses={businesses}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <DeleteShareholderButton
                    businessId={s.businessId}
                    id={s.id}
                  />
                </TableCell>
              </TableRow>
            )),
          ];
        })}
      </TableBody>
    </Table>
  );
}
