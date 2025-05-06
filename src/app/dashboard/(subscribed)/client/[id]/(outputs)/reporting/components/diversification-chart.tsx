"use client";

import { useMemo } from "react";
import { Pie, PieChart } from "recharts";
import { moneyFormatter, toCamelCase } from "@/lib/utils";
import { generateDiversification } from "@/lib/asset/utils";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Asset } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/assets/schema";
import type { Business } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/businesses/schema";

// Takes: An Asset type or "Businesses".
const getChartColor = (type: Asset["type"] | "Businesses") => {
  switch (type) {
    case "Cash":
      return "var(--chart-8)";
    case "Stocks":
      return "var(--chart-1)";
    case "Bonds":
      return "var(--chart-4)";
    case "Real Estate":
      return "var(--chart-20)";
    case "Mutual Funds":
      return "var(--chart-5)";
    case "Retirement Account":
      return "var(--chart-7)";
    case "Crypto":
      return "var(--chart-19)";
    case "Life Insurance":
      return "var(--chart-9)";
    case "Businesses":
      return "var(--chart-2)";
  }
};

// Takes: An array of Assets and an array of Businesses.
export function DiversificationChart({
  assets,
  businesses,
}: {
  assets: Asset[];
  businesses: Business[];
}) {
  // Use passed Assets and Businesses to generate chart data.
  const chartData = useMemo(() => {
    // Generate an array of Asset types and their total values.
    const assetDiversification = generateDiversification(assets, businesses);
    const chartData = assetDiversification.map((ad) => {
      return {
        ...ad,
        assetType: toCamelCase(ad.assetType),
        fill: `var(--color-${toCamelCase(ad.assetType)})`,
      };
    });
    return chartData;
  }, [assets, businesses]);

  // Define configuration values for the chart.
  const chartConfig = useMemo(() => {
    const config: Record<
      string,
      {
        label: string;
        color: string;
      }
    > = {};
    assets.forEach((a) => {
      config[toCamelCase(a.type)] = {
        label: a.type,
        color: getChartColor(a.type),
      };
      return config;
    });
    config["businesses"] = {
      label: "Businesses",
      color: getChartColor("Businesses"),
    };
    return config;
  }, [assets]) satisfies ChartConfig;

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
        <ChartTooltip content={<ChartTooltipContent money hideLabel />} />
        <Pie
          labelLine={false}
          data={chartData}
          dataKey="value"
          label={({ value }) => moneyFormatter.format(value)}
          nameKey="assetType"
        />
        <ChartLegend content={<ChartLegendContent nameKey="assetType" />} />
      </PieChart>
    </ChartContainer>
  );
}
