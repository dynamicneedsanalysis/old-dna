import { getUser } from "@/lib/kinde";
import { Separator } from "@/components/ui/separator";
import { selectAllIllustrations, selectSingleClient } from "@/db/queries/index";
import { IllustrationList } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/illustrations/components/illustration-list";
import { IllustrationUpload } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/illustrations/components/illustration-upload";
import { notFound } from "next/navigation";
import { read, utils } from "xlsx";
import IllustrationCharts from "./components/illustration-charts";
import IllustrationDataTable from "./components/illustration-data-table";
import SummaryTable from "./components/summary-table";
import { Accordion } from "@/components/ui/accordion";
import { Heading } from "@/components/ui/heading";

interface IllustrationPageProps {
  params: Promise<{ id: number }>;
}

export default async function IllustrationsPage({
  params,
}: IllustrationPageProps) {
  const { id } = await params;

  const user = await getUser();

  const { client } = await selectSingleClient({
    id,
    kindeId: user.id,
  });
  if (!client) {
    notFound();
  }

  const { illustrations } = await selectAllIllustrations(client.id, user.id);
  if (!illustrations) {
    return notFound();
  }

  const data = await Promise.all(
    illustrations.map(async (illustration) => {
      const res = await fetch(illustration.file.url);
      const ab = await res.arrayBuffer();
      const wb = read(ab);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const policy = illustration.policyName;

      const rawData: any[][] = utils.sheet_to_json(ws, {
        header: 1,
        defval: "",
      });

      const headerRowIndex = rawData.findIndex(
        (row) => row[0] && /age|year/i.test(row[0].toString())
      );

      if (headerRowIndex === -1 || headerRowIndex + 1 >= rawData.length) {
        return {
          policy,
          data: [],
        };
      }

      const headers = rawData[headerRowIndex].map((cell: any) =>
        cell ? cell.toString().trim().toLowerCase().replace(/\s+/g, " ") : ""
      );

      const jsonData = rawData.slice(headerRowIndex + 1).map((row) => {
        const formattedRow: Record<string, any> = {};
        headers.forEach((header, index) => {
          formattedRow[header] = row[index] !== undefined ? row[index] : 0;
        });
        return formattedRow;
      });

      const columnMap: Record<string, string[]> = {
        age: ["age", "attained age", "policy year"],
        premium: [
          "annualized scheduled premium",
          "premium",
          "deposit",
          "yearly premium",
          "payments",
          "total yearly premium",
        ],
        gcv: ["guaranteed cash value"],
        tcv: [
          "total cash value",
          "account value",
          "cash surrender value",
          "fund value (primary rate)",
        ],
        tdb: [
          "total death benefit",
          "primary insured person's death benefit",
          "total payout on death",
          "total term",
          "total policy death benefit",
          "total policy death benefit (primary rate)",
          "critical illness insurance benefit",
        ],
      };

      const findColumn = (possibleNames: string[]): string =>
        headers.find((header: string) =>
          possibleNames.some((name) => header.includes(name.toLowerCase()))
        ) || "";

      const ageCol = findColumn(columnMap["age"]) || "age";
      const premiumCol = findColumn(columnMap["premium"]) || "premium";
      const gcvCol = findColumn(columnMap["gcv"]) || "gcv";
      const tcvCol = findColumn(columnMap["tcv"]) || "tcv";
      const tdbCol = findColumn(columnMap["tdb"]) || "tdb";

      let accumulatedPremium = 0;
      const tableData = jsonData.map((row) => {
        const rawAge = row[ageCol];

        let age = 0;
        if (typeof rawAge === "string" && rawAge.includes("|")) {
          const parts = rawAge
            .split("|")
            .map((p: string) => parseInt(p.trim()))
            .filter((n: number) => !isNaN(n));
          age = parts.includes(1)
            ? parts.find((n) => n !== 1) || parts[0]
            : Math.max(...parts);
        } else {
          const match = String(rawAge).match(/\d{2,3}/);
          age = match ? parseInt(match[0]) : 0;
        }

        accumulatedPremium += row[premiumCol] || 0;

        return {
          age,
          premium: row[premiumCol] || 0,
          guaranteedCashValue: row[gcvCol] || 0,
          totalCashValue: row[tcvCol] || 0,
          totalDeathBenefit: row[tdbCol] || 0,
          dollarValue:
            accumulatedPremium > 0
              ? (row[tcvCol] || 0) / accumulatedPremium
              : 0,
        };
      });

      return {
        policy,
        data: tableData,
      };
    })
  );

  const summaryData = data.map((d) => {
    const startAge = d.data[0].age;
    const premium = d.data[0].premium;

    const totalPremiumPaid = premium * d.data.length;

    const policyYearsToCheck = [10, 20, 30, 40, 50];
    const totalCashValueAtPolicyYears: { [key: number]: number } = {};

    policyYearsToCheck.forEach((policyYear) => {
      const correspondingAge = startAge + policyYear;
      const matchingData = d.data.find(
        (entry: any) => entry.age === correspondingAge
      );

      if (matchingData) {
        totalCashValueAtPolicyYears[policyYear] = matchingData.totalCashValue;
      }
    });

    return {
      policy: d.policy,
      totalPremiumPaid,
      totalCashValueAtPolicyYears,
    };
  });
  return (
    <div className="container mx-auto py-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <Heading variant="h1">Illustrations</Heading>
          <p className="text-muted-foreground text-sm">
            Manage and view illustration data for {client.name}
          </p>
        </div>
      </div>
      <Separator className="my-6" />
      <div className="grid gap-6">
        <IllustrationUpload clientId={client.id} />
        <IllustrationList illustrations={illustrations} />
        {data.length > 0 && <IllustrationCharts data={data} />}
        <Accordion type="multiple">
          <h2 className="text-2xl font-semibold">Tables</h2>
          {data.length > 0 &&
            data.map((d, i) => (
              <IllustrationDataTable key={i} data={d.data} policy={d.policy} />
            ))}
        </Accordion>
        <Accordion type="multiple">
          <SummaryTable tableData={summaryData} />
        </Accordion>
      </div>
    </div>
  );
}
