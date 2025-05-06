import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { moneyFormatter } from "@/lib/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function SummaryTable({
  tableData,
}: {
  tableData: {
    policy: string;
    totalPremiumPaid: number;
    totalCashValueAtPolicyYears: Record<number, number>;
  }[];
}) {
  return (
    <AccordionItem value="summary" className="border-primary border-b-2">
      <AccordionTrigger className="text-primary text-xl font-bold hover:no-underline">
        Summary
      </AccordionTrigger>
      <AccordionContent>
        <div className="mx-auto max-w-6xl overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Name</TableHead>
                <TableHead>Total Premium Paid</TableHead>
                <TableHead>TCV at Policy Year 10</TableHead>
                <TableHead>TCV at Policy Year 20</TableHead>
                <TableHead>TCV at Policy Year 30</TableHead>
                <TableHead>TCV at Policy Year 40</TableHead>
                <TableHead>TCV at Policy Year 50</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((d, i) => (
                <TableRow key={i}>
                  <TableCell>{d.policy}</TableCell>
                  <TableCell>
                    {moneyFormatter.format(d.totalPremiumPaid)}
                  </TableCell>
                  <TableCell>
                    {moneyFormatter.format(
                      d.totalCashValueAtPolicyYears[10] ?? 0
                    )}
                  </TableCell>
                  <TableCell>
                    {moneyFormatter.format(
                      d.totalCashValueAtPolicyYears[20] ?? 0
                    )}
                  </TableCell>
                  <TableCell>
                    {moneyFormatter.format(
                      d.totalCashValueAtPolicyYears[30] ?? 0
                    )}
                  </TableCell>
                  <TableCell>
                    {moneyFormatter.format(
                      d.totalCashValueAtPolicyYears[40] ?? 0
                    )}
                  </TableCell>
                  <TableCell>
                    {moneyFormatter.format(
                      d.totalCashValueAtPolicyYears[50] ?? 0
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
