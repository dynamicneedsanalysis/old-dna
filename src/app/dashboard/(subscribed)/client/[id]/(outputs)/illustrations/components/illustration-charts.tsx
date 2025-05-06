"use client";

import { ZoomableChart } from "../../reporting/components/zoomable-chart";
import { toCamelCase } from "drizzle-orm/casing";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function IllustrationCharts({
  data,
}: {
  data: { policy: string; data: any[] }[];
}) {
  const dataByAge: Record<number, any> = {};
  const premiumChartData: any[] = [];
  const guaranteedCashValueChartData: any[] = [];
  const totalCashValueChartData: any[] = [];
  const totalDeathBenefitChartData: any[] = [];
  const dollarValueChartData: any[] = [];
  const chartConfig: Record<
    string,
    {
      label: string;
      color: string;
    }
  > = {};

  let i = 1;
  for (const carrierData of data) {
    const { policy } = carrierData;
    const camelCasePolicy = toCamelCase(policy);
    chartConfig[camelCasePolicy] = {
      label: policy,
      color: `var(--chart-${i})`,
    };
    i++;

    for (const entry of carrierData.data) {
      const {
        age: rawAge,
        premium,
        guaranteedCashValue,
        totalCashValue,
        totalDeathBenefit,
        dollarValue,
      } = entry;

      let age = 0;
      if (typeof rawAge === "string" && rawAge.includes("|")) {
        const parts = rawAge
          .split("|")
          .map((p) => parseInt(p.trim()))
          .filter((n) => !isNaN(n));
        if (parts.length === 2) {
          age = parts.includes(1)
            ? parts.find((n) => n !== 1) || parts[0]
            : Math.max(...parts);
        }
      } else {
        const match = String(rawAge).match(/\d{2,3}/);
        age = match ? parseInt(match[0]) : 0;
      }

      if (!dataByAge[age]) {
        dataByAge[age] = {
          age: age.toString(),
          premium: {},
          guaranteedCashValue: {},
          totalCashValue: {},
          totalDeathBenefit: {},
          dollarValue: {},
        };
      }

      dataByAge[age].premium[camelCasePolicy] = premium || 0;
      dataByAge[age].guaranteedCashValue[camelCasePolicy] =
        guaranteedCashValue || 0;
      dataByAge[age].totalCashValue[camelCasePolicy] = totalCashValue || 0;
      dataByAge[age].totalDeathBenefit[camelCasePolicy] =
        totalDeathBenefit || 0;
      dataByAge[age].dollarValue[camelCasePolicy] = dollarValue || 0;
    }
  }

  const allPolicies = Object.keys(chartConfig);

  for (const ageData of Object.values(dataByAge)) {
    for (const policy of allPolicies) {
      if (ageData.premium[policy] === undefined) ageData.premium[policy] = 0;
      if (ageData.guaranteedCashValue[policy] === undefined)
        ageData.guaranteedCashValue[policy] = 0;
      if (ageData.totalCashValue[policy] === undefined)
        ageData.totalCashValue[policy] = 0;
      if (ageData.totalDeathBenefit[policy] === undefined)
        ageData.totalDeathBenefit[policy] = 0;
      if (ageData.dollarValue[policy] === undefined)
        ageData.dollarValue[policy] = 0;
    }

    premiumChartData.push({ age: ageData.age, ...ageData.premium });
    guaranteedCashValueChartData.push({
      age: ageData.age,
      ...ageData.guaranteedCashValue,
    });
    totalCashValueChartData.push({
      age: ageData.age,
      ...ageData.totalCashValue,
    });
    totalDeathBenefitChartData.push({
      age: ageData.age,
      ...ageData.totalDeathBenefit,
    });
    dollarValueChartData.push({ age: ageData.age, ...ageData.dollarValue });
  }

  return (
    <Accordion type="multiple">
      <h2 className="text-2xl font-semibold">Graphs</h2>
      <AccordionItem value="premium-age" className="border-primary border-b-2">
        <AccordionTrigger className="text-primary text-xl font-bold hover:no-underline">
          Premium vs Age
        </AccordionTrigger>
        <AccordionContent>
          <ZoomableChart
            xAxisDataKey="age"
            data={premiumChartData}
            config={chartConfig}
            height={400}
            yAxisWidth={100}
            tooltipOptions={{
              money: true,
              indicator: "line",
              wrapperStyle: {
                width: "fit-content",
              },
            }}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="gcv-age" className="border-primary border-b-2">
        <AccordionTrigger className="text-primary text-xl font-bold hover:no-underline">
          Guaranteed Cash Value vs Age
        </AccordionTrigger>
        <AccordionContent>
          <ZoomableChart
            xAxisDataKey="age"
            data={guaranteedCashValueChartData}
            config={chartConfig}
            height={400}
            yAxisWidth={100}
            tooltipOptions={{
              money: true,
              indicator: "line",
              wrapperStyle: {
                width: "fit-content",
              },
            }}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="tcv-age" className="border-primary border-b-2">
        <AccordionTrigger className="text-primary text-xl font-bold hover:no-underline">
          Total Cash Value vs Age
        </AccordionTrigger>
        <AccordionContent>
          <ZoomableChart
            xAxisDataKey="age"
            data={totalCashValueChartData}
            config={chartConfig}
            height={400}
            yAxisWidth={100}
            tooltipOptions={{
              money: true,
              indicator: "line",
              wrapperStyle: {
                width: "fit-content",
              },
            }}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="tdb-age" className="border-primary border-b-2">
        <AccordionTrigger className="text-primary text-xl font-bold hover:no-underline">
          Total Death Benefit vs Age
        </AccordionTrigger>
        <AccordionContent>
          <ZoomableChart
            xAxisDataKey="age"
            data={totalDeathBenefitChartData}
            config={chartConfig}
            height={400}
            yAxisWidth={100}
            tooltipOptions={{
              money: true,
              indicator: "line",
              wrapperStyle: {
                width: "fit-content",
              },
            }}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="dv-age" className="border-primary border-b-2">
        <AccordionTrigger className="text-primary text-xl font-bold hover:no-underline">
          Dollar Value vs Age
        </AccordionTrigger>
        <AccordionContent>
          <ZoomableChart
            xAxisDataKey="age"
            data={dollarValueChartData}
            config={chartConfig}
            height={400}
            yAxisWidth={100}
            tooltipOptions={{
              money: true,
              indicator: "line",
              wrapperStyle: {
                width: "fit-content",
              },
            }}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
