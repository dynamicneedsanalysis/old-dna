"use client";

import { formatPercentage, moneyFormatter } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Takes: Total values: current and future fixed and liquid assets, and assets to be sold,
//        Maximum insurable amount, liquidity percentage for Goals, liquidity allocated to Goals,
//        Liquidity preserved, total sum of Goals, and surplus or shortfall.
export function LiquidityTable({
  totalCurrentValueFixed,
  totalFutureValueFixed,
  totalCurrentValueLiquid,
  totalFutureValueLiquidAssets,
  totalCurrentValueToBeSold,
  totalFutureValueToBeSold,
  maxInsurableAmount,
  liquidityToGoalsPercent,
  liquidityAllocatedToGoals,
  liquidityPreserved,
  totalSumGoals,
  surplusShortfall,
}: {
  totalCurrentValueFixed: number;
  totalFutureValueFixed: number;
  totalCurrentValueLiquid: number;
  totalFutureValueLiquidAssets: number;
  totalCurrentValueToBeSold: number;
  totalFutureValueToBeSold: number;
  maxInsurableAmount: number;
  liquidityToGoalsPercent: number;
  liquidityAllocatedToGoals: number;
  liquidityPreserved: number;
  totalSumGoals: number;
  surplusShortfall: number;
}) {
  const liquidityData = [
    {
      item: "Fixed Assets",
      currentValue: moneyFormatter.format(totalCurrentValueFixed),
      futureValue: moneyFormatter.format(totalFutureValueFixed),
    },
    {
      item: "Liquid Assets",
      currentValue: moneyFormatter.format(totalCurrentValueLiquid),
      futureValue: moneyFormatter.format(totalFutureValueLiquidAssets),
    },
    {
      item: "Assets to be Sold",
      currentValue: moneyFormatter.format(totalCurrentValueToBeSold),
      futureValue: moneyFormatter.format(totalFutureValueToBeSold),
    },
    {
      item: "Maximum Insurable Amount",
      currentValue: moneyFormatter.format(maxInsurableAmount),
      futureValue: moneyFormatter.format(maxInsurableAmount),
    },
    {
      item: "% Liquidity Allocated Towards Goals",
      currentValue: null,
      futureValue: formatPercentage(liquidityToGoalsPercent),
    },
    {
      item: "Liquidity Allocated Towards Goals",
      currentValue: null,
      futureValue: moneyFormatter.format(liquidityAllocatedToGoals),
    },
    {
      item: "Liquidity Preserved",
      currentValue: null,
      futureValue: moneyFormatter.format(liquidityPreserved),
    },
    {
      item: "Total Sum of All Goals",
      currentValue: null,
      futureValue: moneyFormatter.format(totalSumGoals),
    },
    {
      item: `${surplusShortfall > 0 ? "Surplus" : "Shortfall"}`,
      currentValue: null,
      futureValue: moneyFormatter.format(Math.abs(surplusShortfall)),
    },
  ];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Current Value</TableHead>
          <TableHead>Future Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {liquidityData.map((row) => (
          <TableRow key={row.item}>
            <TableCell>{row.item}</TableCell>
            <TableCell>{row.currentValue ?? "-"}</TableCell>
            <TableCell>{row.futureValue ?? "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
