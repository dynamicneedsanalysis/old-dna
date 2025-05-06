import { calculateFinalShareValue } from "@/lib/businesses/utils";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BusinessKeyPeopleShareholders } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/schemas/businesses";
import { ShareholderTableRow } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components/shareholder-row";

// Takes: An array of BusinessKeyPeopleShareholders objects and a lifeExpectancy value.
export async function ShareholderTable({
  businesses,
  lifeExpectancy,
}: {
  businesses: BusinessKeyPeopleShareholders[];
  lifeExpectancy: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Need</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Want</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {businesses.map((b) => {
          const businessShareholders = b.shareholders;
          if (businessShareholders.length > 0) {
            return businessShareholders.map((s, index) => (
              <ShareholderTableRow
                key={s.id}
                item={{
                  id: s.id,
                  name: s.name,
                  need: calculateFinalShareValue(b, s, lifeExpectancy),
                  priority: s.priority,
                  businessName: b.name,
                  rowIndex: index,
                  isLastRowOfBusiness:
                    businessShareholders.length - 1 === index,
                }}
              />
            ));
          }
        })}
      </TableBody>
    </Table>
  );
}
