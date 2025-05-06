"use client";

import { useMemo } from "react";
import { generateTaxBurdenSeries } from "@/lib/total-needs/utils";
import type { ChartConfig } from "@/components/ui/chart";
import type { Asset } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/assets/schema";
import type { Business } from "@/app/dashboard/(subscribed)/client/[id]//edit/lib/businesses/schema";
import { ZoomableChart } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components/zoomable-chart";
import type { ProvinceInitials } from "@/constants/provinces";

interface TaxBurdenChartProps {
  assets: Asset[];
  businesses: Business[];
  province: ProvinceInitials;
  taxFreezeAtYear: number;
  lifeExpectancy: number;
  lifeExpectancyYear: number;
}

// Takes: An array of Assets and Businesses, a ProvinceInitials object,
//        A taxFreeze year val, a lifeExpectancy value, and a lifeExpectancy year.
export function TaxBurdenChart({
  assets,
  businesses,
  province,
  taxFreezeAtYear,
  lifeExpectancy,
  lifeExpectancyYear,
}: TaxBurdenChartProps) {
  // Use passed Assets, Businesses, Province, lifeExpectancy year, and lifeExpectancy to generate chart data.
  const chartData = useMemo(
    () =>
      generateTaxBurdenSeries(
        assets,
        businesses,
        province,
        lifeExpectancyYear,
        lifeExpectancy
      ),
    [assets, businesses, province, lifeExpectancyYear, lifeExpectancy]
  );

  // Define configuration values for the chart.
  const chartConfig = {
    taxBurden: {
      label: "Tax Burden",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <ZoomableChart
      type="area"
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
      }}
    />
  );
}
