import { moneyFormatter } from "@/lib/utils";
import { calculateInsuredIncomeAmount } from "@/lib/client/utils";
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import { type Client } from "@/db/queries/clients";
import { IncomeReplacementRow } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components/income-replacement-row";

// Takes: A Client object.
export async function IncomeReplacementTable({ client }: { client: Client }) {
  const amountInsuredForIncome = calculateInsuredIncomeAmount(
    parseFloat(client.annualIncome),
    client.age
  );
  return (
    <Table>
      <TableHeader></TableHeader>
      <TableBody>
        <IncomeReplacementRow parameter="Age" value={client.age} />
        <IncomeReplacementRow
          parameter="Annual Income"
          value={moneyFormatter.format(parseFloat(client.annualIncome))}
        />
        <IncomeReplacementRow
          parameter="Amount Insured for Income"
          value={moneyFormatter.format(amountInsuredForIncome)}
        />
      </TableBody>
    </Table>
  );
}
