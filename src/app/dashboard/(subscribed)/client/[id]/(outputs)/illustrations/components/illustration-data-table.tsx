import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { moneyFormatter } from "@/lib/utils";

function formatAge(age: string | number): number | string {
  if (typeof age === "string" && age.includes("|")) {
    const parts = age
      .split("|")
      .map((p: string) => parseInt(p.trim()))
      .filter((n: number) => !isNaN(n));
    return parts.includes(1)
      ? parts.find((n) => n !== 1) || parts[0]
      : Math.max(...parts);
  }
  return age;
}

export default function IllustrationDataTable({
  data,
  policy,
}: {
  policy: string;
  data: any[];
}) {
  return (
    <AccordionItem value={policy} className="border-primary border-b-2">
      <AccordionTrigger className="text-primary text-xl font-bold hover:no-underline">
        {policy}
      </AccordionTrigger>
      <AccordionContent>
        <div className="mx-auto max-w-6xl overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="text-center font-semibold">Age</TableHead>
                <TableHead className="text-center font-semibold">
                  Premium
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Guaranteed Cash Value
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Total Cash Value
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Total Death Benefit
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Dollar Value
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={row.age}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell className="text-center">
                    {formatAge(row.age)}
                  </TableCell>
                  <TableCell className="text-center">
                    {moneyFormatter.format(row.premium)}
                  </TableCell>
                  <TableCell className="text-center">
                    {moneyFormatter.format(row.guaranteedCashValue)}
                  </TableCell>
                  <TableCell className="text-center">
                    {moneyFormatter.format(row.totalCashValue)}
                  </TableCell>
                  <TableCell className="text-center">
                    {moneyFormatter.format(row.totalDeathBenefit)}
                  </TableCell>
                  <TableCell className="text-center">
                    {moneyFormatter.format(row.dollarValue)}
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
