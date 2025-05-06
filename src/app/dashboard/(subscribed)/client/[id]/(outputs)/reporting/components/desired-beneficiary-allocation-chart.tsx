"use client";

import { useMemo } from "react";
import { Pie, PieChart } from "recharts";
import { toCamelCase } from "@/lib/utils";
import { generateDesiredBeneficiaryDistribution } from "@/lib/beneficiaries/utils";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Beneficiary } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/beneficiaries/schema";

// Takes: An array of Beneficiaries.
export function DesiredBeneficiaryAllocationChart({
  beneficiaries,
}: {
  beneficiaries: Beneficiary[];
}) {
  // Use passed Beneficiaries to generate chart data.
  const chartData = useMemo(() => {
    // Get an array of the Beneficiaries and their totaled allocation.
    const desiredBeneficiaries =
      generateDesiredBeneficiaryDistribution(beneficiaries);
    const chartData = desiredBeneficiaries.map((db) => {
      return {
        ...db,
        desiredBeneficiary: toCamelCase(db.desiredBeneficiary),
        fill: `var(--color-${toCamelCase(db.desiredBeneficiary)})`,
      };
    });
    return chartData;
  }, [beneficiaries]);

  // Define configuration values for the chart.
  const chartConfig = useMemo(() => {
    const config: Record<
      string,
      {
        label: string;
        color: string;
      }
    > = {};
    beneficiaries.forEach((b, i) => {
      config[toCamelCase(b.name)] = {
        label: b.name,
        color: `var(--chart-${i + 1})`,
      };
      return config;
    });
    return config;
  }, [beneficiaries]) satisfies ChartConfig;

  return (
    <ChartContainer
      style={{
        minWidth: 600,
        overflow: "auto",
      }}
      config={chartConfig}
      className="[&_.recharts-pie-label-text]:fill-foreground mx-auto max-h-[350px] pb-0"
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={chartData}
          labelLine={false}
          dataKey="allocation"
          label={({ value }) =>
            value.toLocaleString("en", { useGrouping: true })
          }
          nameKey="desiredBeneficiary"
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="desiredBeneficiary" />}
        />
      </PieChart>
    </ChartContainer>
  );
}
