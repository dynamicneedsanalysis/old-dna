import type { Asset } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/assets/schema";
import type { Goal } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/goals/schema";

export function calculateTotalSumGoals(goals: Goal[]): number {
  return goals.reduce((total, goal) => total + parseFloat(goal.amount), 0);
}

// Calculates the liquidity preserved of future liquid Assets.
// Returns: Liquidity Preserved of the Assets value.
// Value * Allocation Factor as Percentage = Liquidity Preserved.
export function calculateLiquidityPreserved(
  allocationFactor: number,
  totalFutureValueLiquidAssets: number
): number {
  return totalFutureValueLiquidAssets * (1 - allocationFactor);
}

// Takes: The Allocation factor and the total future value of liquid Assets.
// Returns: The liquidity allocated to Goals based on the Allocation Factor.
export function calculateLiquidityAllocatedToGoals(
  allocationFactor: number,
  totalFutureValueLiquidAssets: number
): number {
  return totalFutureValueLiquidAssets * allocationFactor;
}

// Takes: The liquidity allocated to Goals and the total sum of Goals.
// Returns: The remaining liquidity after allocating to Goals.
// If the total sum of Goals is 0, returns 0 instead of the liquidity value.
export function calculateSurplusShortfall(
  liquidityAllocatedToGoals: number,
  totalSumGoals: number
): number {
  return totalSumGoals === 0 ? 0 : liquidityAllocatedToGoals - totalSumGoals;
}

// Takes: An array of Assets and a life expectancy.
// Returns: The total current and future value of liquid and fixed Assets,
//          And the total current and future value of Assets to be sold (always 0).
export function calculateCurrentFutureTotals(
  assets: Asset[],
  lifeExpectancy: number
): { [key: string]: number } {
  const result = {
    totalCurrentValueFixed: 0,
    totalFutureValueFixed: 0,
    totalCurrentValueLiquid: 0,
    totalFutureValueLiquidAssets: 0,
    totalCurrentValueToBeSold: 0,
    totalFutureValueToBeSold: 0,
  };

  // Find the future value of each Asset and use it to calculate the current and future totals.
  assets.forEach((asset): void => {
    const term = asset.term
      ? Math.min(20, parseFloat(asset.term))
      : lifeExpectancy + 5;

    const futureValue: number =
      parseFloat(asset.currentValue) *
      Math.pow(1 + parseFloat(asset.rate) / 100, term);

    // Only record the value to the fixed or liquid values based on Asset liquidity type.
    if (asset.isLiquid) {
      result.totalCurrentValueLiquid += parseFloat(asset.currentValue);
      result.totalFutureValueLiquidAssets += futureValue;
    } else {
      result.totalCurrentValueFixed += parseFloat(asset.currentValue);
      result.totalFutureValueFixed += futureValue;
    }
  });
  return result;
}

// Returns 25% of the passed net worth with a maximum of 100,000.
export function calculateMaxInsurableAmount(netWorth: number): number {
  return Math.max(100000, 0.25 * netWorth);
}
