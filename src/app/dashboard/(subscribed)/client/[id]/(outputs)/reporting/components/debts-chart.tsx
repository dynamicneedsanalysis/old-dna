"use client";

import { useMemo } from "react";
import { toCamelCase } from "@/lib/utils";
import { generateDebts } from "@/lib/debts/utils";
import type { ChartConfig } from "@/components/ui/chart";
import type { Debt } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/debts/schema";
import { ZoomableChart } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components/zoomable-chart";

// Takes: An array of Debts and a life expectancy year.
export function DebtsChart({
  debts,
  lifeExpectancyYear,
}: {
  debts: Debt[];
  lifeExpectancyYear: number;
}) {
  // Use passed Debts and life expectancy year to generate chart data.
  const chartData = useMemo(
    () => generateDebts(debts, lifeExpectancyYear),
    [debts, lifeExpectancyYear]
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
    debts.forEach((d, i) => {
      config[toCamelCase(d.name)] = {
        label: d.name,
        color: `var(--chart-${i + 1})`,
      };
      return config;
    });
    return config;
  }, [debts]) satisfies ChartConfig;

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
