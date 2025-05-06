"use client";

import { useMemo } from "react";
import { Pie, PieChart } from "recharts";
import { toCamelCase } from "@/lib/utils";
import { generateRealBeneficiaryDistribution } from "@/lib/beneficiaries/utils";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Beneficiary } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/beneficiaries/schema";
import type { AssetWithAssetBeneficiaries } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/schemas/total-insurable-needs";

// Takes: An array of AssetWithAssetBeneficiaries objects and an array of Beneficiaries.
export function RealBeneficiaryDistributionChart({
  assets,
  beneficiaries,
}: {
  assets: AssetWithAssetBeneficiaries[];
  beneficiaries: Beneficiary[];
}) {
  // Use passed Assets to generate chart data.
  const chartData = useMemo(() => {
    const realBeneficiaries = generateRealBeneficiaryDistribution(assets);
    const chartData = realBeneficiaries.map((rb) => {
      return {
        ...rb,
        realBeneficiary: toCamelCase(rb.realBeneficiary),
        fill: `var(--color-${toCamelCase(rb.realBeneficiary)})`,
      };
    });
    return chartData;
  }, [assets]);

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
          nameKey="realBeneficiary"
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="realBeneficiary" />}
        />
      </PieChart>
    </ChartContainer>
  );
}
