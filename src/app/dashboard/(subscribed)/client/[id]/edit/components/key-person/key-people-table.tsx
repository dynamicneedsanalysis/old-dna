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
import { DeleteKeyPersonButton } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/key-person/delete-key-person-button";
import { KeyPersonDialog } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/key-person/key-person-dialog";

// Takes: An array of Business KeyPerson objects.
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
                "border-b border-black": b.keyPeople.length === 0,
              })}
            >
              <TableCell className="text-center font-semibold">
                {b.name}
              </TableCell>
              <TableCell className="text-center">{b.client.name}</TableCell>
              <TableCell className="text-center">
                {formatPercentage(parseFloat(b.clientEbitdaContributed))}
              </TableCell>
              <TableCell className="text-center">
                {moneyFormatter.format(
                  parseFloat(b.clientEbitdaInsuranceContribution)
                )}
              </TableCell>
              <TableCell></TableCell> {/* Placeholder for Actions */}
            </TableRow>,
            ...b.keyPeople.map((kp, kpIndex) => (
              <TableRow
                key={`${b.id}-key-person-${kp.id}-${kpIndex}`}
                className={cn({
                  "border-b-muted-foreground border-b":
                    b.keyPeople.length - 1 === kpIndex,
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
                <TableCell className="text-right">
                  <KeyPersonDialog
                    mode="edit"
                    keyPerson={kp}
                    businesses={businesses}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <DeleteKeyPersonButton
                    id={kp.id}
                    businessId={kp.businessId}
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
