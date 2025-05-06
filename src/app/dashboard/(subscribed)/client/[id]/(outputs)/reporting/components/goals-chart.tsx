"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { moneyFormatter } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  amount: {
    label: "Amount",
  },
} satisfies ChartConfig;

// Takes: A total future value of liquid assets, the liquidity preserved, the liquidity allocated to Goals,
//        the total sum of Goals, and the surplus shortfall.
export function GoalsChart({
  totalFutureValueLiquidAssets,
  liquidityPreserved,
  liquidityAllocatedToGoals,
  totalSumGoals,
  surplusShortfall,
}: {
  totalFutureValueLiquidAssets: number;
  liquidityPreserved: number;
  liquidityAllocatedToGoals: number;
  totalSumGoals: number;
  surplusShortfall: number;
}) {
  const chartData = [
    { label: "Future Liquidity", amount: totalFutureValueLiquidAssets },
    { label: "Preserved Liquidity", amount: liquidityPreserved },
    { label: "Allocated to Goals", amount: liquidityAllocatedToGoals },
    { label: "Total Goals", amount: -totalSumGoals },
    { label: "Surplus / Shortfall", amount: surplusShortfall },
  ];
  return (
    <ChartContainer className="h-[400px] w-full" config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={false}
          tickMargin={8}
        />
        <YAxis
          dataKey="amount"
          tickLine={false}
          axisLine={false}
          width={100}
          tickFormatter={(value) => moneyFormatter.format(value)}
          domain={[
            (dataMin: number) => Math.round(dataMin * 1.15) * -1,
            (dataMax: number) => Math.round(dataMax * 1.15),
          ]}
        />
        <CartesianGrid vertical={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent money />} />
        <Bar dataKey="amount">
          <LabelList position="top" dataKey="label" fillOpacity={1} />
          {chartData.map((item) => (
            <Cell
              key={item.amount}
              fill={item.amount > 0 ? "var(--chart-1)" : "var(--chart-2)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
