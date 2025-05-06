"use client";

import { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { moneyFormatter, toCamelCase } from "@/lib/utils";
import { generateAssetValueDistribution } from "@/lib/beneficiaries/utils";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Asset } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/assets/schema";
import type { Beneficiary } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/beneficiaries/schema";

// Takes: An array of Assets and an array of Beneficiaries.
export function AssetValueDistributionChart({
  assets,
  beneficiaries,
}: {
  assets: Asset[];
  beneficiaries: Beneficiary[];
}) {
  // Use passed assets to generate chart data and keys.
  const chartData = useMemo(
    () => generateAssetValueDistribution(assets),
    [assets]
  );
  const keys = Array.from(new Set(chartData.flatMap(Object.keys))).filter(
    (key) => key !== "asset"
  );

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
    <ChartContainer config={chartConfig} className="mx-auto max-h-[500px]">
      <BarChart accessibilityLayer data={chartData} barSize={100}>
        <XAxis
          dataKey="asset"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          minTickGap={-200}
          height={100}
          angle={-45}
          textAnchor="end"
        />
        <YAxis
          width={100}
          tickFormatter={(value) => moneyFormatter.format(value)}
        />
        {keys.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="a"
            radius={i === 0 ? [0, 0, 4, 4] : [4, 4, 0, 0]}
            fill={`var(--color-${key})`}
          />
        ))}
        <ChartTooltip
          content={<ChartTooltipContent money indicator="line" />}
          cursor={false}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  );
}
