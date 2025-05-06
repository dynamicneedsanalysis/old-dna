import { cn, formatPercentage, moneyFormatter } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BusinessKeyPerson } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/key-person/schema";

// Takes: An array of Business Key People.
export async function KeyPeopleTable({
  businesses,
}: {
  businesses: BusinessKeyPerson[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead className="text-center">Name</TableHead>
          <TableHead className="text-center">% EBITDA Contributed</TableHead>
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
                "border-b border-black": business.keyPeople.length == 0,
              })}
            >
              <TableCell className="text-center font-semibold">
                {business.name}
              </TableCell>
              <TableCell className="text-center">
                {business.client.name}
              </TableCell>
              <TableCell className="text-center">
                {formatPercentage(parseFloat(business.clientEbitdaContributed))}
              </TableCell>
              <TableCell className="text-center">
                {moneyFormatter.format(
                  parseFloat(business.clientEbitdaInsuranceContribution)
                )}
              </TableCell>
            </TableRow>,
            // Key Person Rows
            ...business.keyPeople.map((kp, i) => (
              <TableRow
                key={`${business.id}-shareholder-${kp.id}`} // Unique key for shareholder row
                className={cn({
                  "border-b border-black": business.keyPeople.length - 1 === i,
                })}
              >
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-center">{kp.name}</TableCell>
                <TableCell className="text-center">
                  {formatPercentage(
                    parseFloat(kp.ebitdaContributionPercentage)
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {moneyFormatter.format(parseFloat(kp.insuranceCoverage))}
                </TableCell>
              </TableRow>
            )),
          ];
        })}
      </TableBody>
    </Table>
  );
}
