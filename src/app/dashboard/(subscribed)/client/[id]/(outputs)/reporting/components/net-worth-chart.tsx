"use client";

import { useMemo } from "react";
import { toCamelCase } from "@/lib/utils";
import { generateNetWorth } from "@/lib/asset/utils";
import type { ChartConfig } from "@/components/ui/chart";
import type { Asset } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/assets/schema";
import { ZoomableChart } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components/zoomable-chart";

// Takes: An array of Assets, a tax freeze year, a life expectancy value, and a life expectancy year.
export function NetWorthChart({
  assets,
  taxFreezeAtYear,
  lifeExpectancy,
  lifeExpectancyYear,
}: {
  assets: Asset[];
  taxFreezeAtYear: number;
  lifeExpectancy: number;
  lifeExpectancyYear: number;
}) {
  // Use passed Assets, tax freeze year, and life expectancy to generate chart data.
  const chartData = useMemo(
    () => generateNetWorth(assets, lifeExpectancyYear, lifeExpectancy),
    [assets, lifeExpectancyYear, lifeExpectancy]
  );

  // Define configuration values for the chart.
  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};
    assets.forEach((d, i) => {
      config[toCamelCase(d.name)] = {
        label: d.name,
        color: `var(--chart-${i + 1})`,
      };
    });
    return config;
  }, [assets]) satisfies ChartConfig;

  return (
    <ZoomableChart
      data={chartData}
      config={chartConfig}
      height={400}
      referenceLines={[
        {
          year: new Date().getFullYear(),
          label: "Current Year",
        },
        {
          year: taxFreezeAtYear,
          label: "Tax Freeze",
        },
      ]}
      yAxisWidth={100}
      tooltipOptions={{
        money: true,
        indicator: "line",
        wrapperStyle: {
          width: "fit-content",
        },
      }}
    />
  );
}
