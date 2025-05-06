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
import { selectAllBusinesses } from "@/db/queries/index";
import { DeleteBusinessButton } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/businesses/delete-business-button";
import { BusinessDialog } from "@/app/dashboard/(subscribed)/client/[id]/edit/components/businesses/business-dialog";

// Takes: A Client Id number.
export async function BusinessesTable({ clientId }: { clientId: number }) {
  // Fetch all Businesses for the Client.
  const { businesses, error } = await selectAllBusinesses(clientId);

  if (error) {
    throw error;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Name</TableHead>
          <TableHead className="text-center">Market Value</TableHead>
          <TableHead className="text-center">EBITDA</TableHead>
          <TableHead className="text-center">Growth Rate</TableHead>
          <TableHead className="text-center">Time horizon</TableHead>
          <TableHead className="text-center"></TableHead>
          <TableHead className="text-center"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {businesses &&
          businesses.map((b) => (
            <TableRow key={b.id}>
              <TableCell className="text-center font-semibold">
                {b.name}
              </TableCell>
              <TableCell className="text-center">
                {moneyFormatter.format(parseFloat(b.valuation))}
              </TableCell>
              <TableCell className="text-center">
                {moneyFormatter.format(parseFloat(b.ebitda))}
              </TableCell>
              <TableCell className="text-center">
                {formatPercentage(parseFloat(b.appreciationRate))}
              </TableCell>
              <TableCell className="text-center">
                {b.term
                  ? `${roundNumericToNearestWholeNumber(b.term)} years`
                  : "-"}
              </TableCell>
              <TableCell className="text-right">
                <BusinessDialog mode="edit" business={b} />
              </TableCell>
              <TableCell className="text-right">
                <DeleteBusinessButton id={b.id} />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
