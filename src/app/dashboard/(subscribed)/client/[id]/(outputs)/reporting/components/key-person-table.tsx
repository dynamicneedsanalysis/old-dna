"use client";

import { calculateFinalEbitdaContribution } from "@/lib/businesses/utils";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BusinessKeyPeopleShareholders } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/schemas/businesses";
import { KeyPersonTableRow } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components/key-person-row";

// Takes: An array of BusinessKeyPeopleShareholders and a life expectancy value.
export function KeyPersonTable({
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
          const businessKeyPeople = b.keyPeople;
          if (businessKeyPeople.length > 0) {
            return businessKeyPeople.map((kp, index) => (
              <KeyPersonTableRow
                key={kp.id}
                item={{
                  id: kp.id,
                  name: kp.name,
                  need: calculateFinalEbitdaContribution(b, kp, lifeExpectancy),
                  priority: kp.priority,
                  businessName: b.name,
                  rowIndex: index,
                  isLastRowOfBusiness: businessKeyPeople.length - 1 === index,
                }}
              />
            ));
          }
        })}
      </TableBody>
    </Table>
  );
}
