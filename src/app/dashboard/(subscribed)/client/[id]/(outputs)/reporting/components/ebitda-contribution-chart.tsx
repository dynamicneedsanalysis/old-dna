"use client";

import { useMemo } from "react";
import { toCamelCase } from "@/lib/utils";
import { generateEbitdaSeries } from "@/lib/businesses/utils";
import type { ChartConfig } from "@/components/ui/chart";
import type { BusinessKeyPeopleShareholders } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/schemas/businesses";
import { ZoomableChart } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components/zoomable-chart";

// Takes: An array of Business Key People Shareholders.
export function EBITDAContributionChart({
  businesses,
}: {
  businesses: BusinessKeyPeopleShareholders[];
}) {
  // Use passed Businesses to generate chart data.
  const chartData = useMemo(
    // Generate an array of years to EBITDA contributors and their contributions.
    () => generateEbitdaSeries(businesses),
    [businesses]
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
    let i = 1;
    businesses.forEach((b) => {
      config[`${toCamelCase(b.name)}-${toCamelCase(b.client.name)}`] = {
        label: `${b.name} - ${b.client.name}`,
        color: `var(--chart-${i})`,
      };
      i++;
      b.keyPeople.forEach((kp) => {
        config[`${toCamelCase(b.name)}-${toCamelCase(kp.name)}`] = {
          label: `${b.name} - ${kp.name}`,
          color: `var(--chart-${i})`,
        };
        i++;
      });
    });
    return config;
  }, [businesses]) satisfies ChartConfig;

  return (
    <ZoomableChart
      data={chartData}
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
  );
}
