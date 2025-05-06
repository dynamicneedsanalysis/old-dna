"use client";

import { calculateTotalNetWorthForCurrentYear } from "@/lib/asset/utils";
import {
  calculateCurrentFutureTotals,
  calculateLiquidityAllocatedToGoals,
  calculateLiquidityPreserved,
  calculateMaxInsurableAmount,
  calculateSurplusShortfall,
  calculateTotalSumGoals,
} from "@/lib/goals/utils";
import { Heading } from "@/components/ui/heading";
import type { Asset } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/assets/schema";
import type { Goal } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/goals/schema";
import { GoalsChart } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components/goals-chart";
import { LiquidityTable } from "@/app/dashboard/(subscribed)/client/[id]/(outputs)/reporting/components/liquidity-table";

// Takes: An array of Goals, an array of Assets,
//        A liquidity percentage for Goals, and life expectancy value.
export function Liquidity({
  goals,
  assets,
  liquidityToGoalsPercent,
  lifeExpectancy,
}: {
  goals: Goal[];
  assets: Asset[];
  liquidityToGoalsPercent: number;
  lifeExpectancy: number;
}) {
  // Calculate the totals for the different Asset types.
  const {
    totalCurrentValueFixed,
    totalFutureValueFixed,
    totalCurrentValueLiquid,
    totalCurrentValueToBeSold,
    totalFutureValueLiquidAssets,
    totalFutureValueToBeSold,
  } = calculateCurrentFutureTotals(assets, lifeExpectancy);

  // Get allocation to goals factor as a percentage.
  const allocationFactor = liquidityToGoalsPercent / 100;

  // Use Assets to find the net worth to calculate the maximum insurable amount.
  const netWorth = calculateTotalNetWorthForCurrentYear(assets);
  const maxInsurableAmount = calculateMaxInsurableAmount(netWorth);

  // Calculate preserved and allocated liquidity after allocating to Goals.
  const liquidityPreserved = calculateLiquidityPreserved(
    allocationFactor,
    totalFutureValueLiquidAssets
  );
  const liquidityAllocatedToGoals = calculateLiquidityAllocatedToGoals(
    allocationFactor,
    totalFutureValueLiquidAssets
  );

  // Calculate the total value attributed to the Goals and the liquidity surplus if any.
  const totalSumGoals = calculateTotalSumGoals(goals);
  const surplusShortfall = calculateSurplusShortfall(
    liquidityAllocatedToGoals,
    totalSumGoals
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 print:break-before-page print:grid-cols-1">
      <section>
        <Heading variant="h2">Liquidity</Heading>
        <div className="mx-auto max-w-4xl">
          <LiquidityTable
            totalCurrentValueFixed={totalCurrentValueFixed}
            totalFutureValueFixed={totalFutureValueFixed}
            totalCurrentValueLiquid={totalCurrentValueLiquid}
            totalFutureValueLiquidAssets={totalFutureValueLiquidAssets}
            totalCurrentValueToBeSold={totalCurrentValueToBeSold}
            totalFutureValueToBeSold={totalFutureValueToBeSold}
            maxInsurableAmount={maxInsurableAmount}
            liquidityToGoalsPercent={liquidityToGoalsPercent}
            liquidityAllocatedToGoals={liquidityAllocatedToGoals}
            liquidityPreserved={liquidityPreserved}
            totalSumGoals={totalSumGoals}
            surplusShortfall={surplusShortfall}
          />
        </div>
      </section>
      <div>
        <Heading variant="h2">
          Goal Allocation and Liquidity Distribution
        </Heading>
        <GoalsChart
          totalFutureValueLiquidAssets={totalFutureValueLiquidAssets}
          liquidityPreserved={liquidityPreserved}
          liquidityAllocatedToGoals={liquidityAllocatedToGoals}
          totalSumGoals={totalSumGoals}
          surplusShortfall={surplusShortfall}
        />
      </div>
    </div>
  );
}
