import { MIN_INCOME_PERCENTAGE } from "@/constants";

type ValueRange = {
  min: number;
  max: number;
  percentageRange: readonly [number, number];
};

type BudgetRecommendation = {
  minBudget: number;
  maxBudget: number;
  maxBudgetPercentage: number;
  isFromMaxIncome: boolean;
};

const incomeRanges: ValueRange[] = [
  { min: 0, max: 50000, percentageRange: [10, 10] },
  { min: 50001, max: 100000, percentageRange: [10, 15] },
  { min: 100001, max: 250000, percentageRange: [15, 20] },
  { min: 250001, max: 2000000, percentageRange: [20, 30] },
];

const netWorthRanges: ValueRange[] = [
  { min: 0, max: 999999, percentageRange: [10, 10] },
  { min: 1000000, max: 5000000, percentageRange: [10, 25] },
  { min: 5000001, max: 10000000, percentageRange: [25, 35] },
  { min: 10000001, max: Infinity, percentageRange: [35, 40] },
];

// Takes: A value and a set of ranges.
// Returns: The range the passed value falls under (or undefined if none exist).
function findRange<T extends { min: number; max: number }>(
  value: number,
  ranges: T[]
): T | undefined {
  return ranges.find((range) => value >= range.min && value <= range.max);
}

// Takes: A value and an optional range.
// Return: The product of the amount and the max percentage of the range.
// If no range is provided, returns 0.
function calculateBudgetFromPercentage(
  amount: number,
  range: ValueRange | undefined
): number {
  return amount * ((range ? range.percentageRange[1] : 0) / 100);
}

// Takes: The income and net worth Budgets.
// Returns: If the highest Budget is determined from the income, and the highest Budget amount.
function determineMaxBudget(
  incomeBudget: number,
  netWorthBudget: number
): { maxBudget: number; isFromMaxIncome: boolean } {
  const isFromMaxIncome = incomeBudget >= netWorthBudget;
  return {
    isFromMaxIncome,
    maxBudget: isFromMaxIncome ? incomeBudget : netWorthBudget,
  };
}

function getMaxPercentage(range: ValueRange | undefined): number {
  return range ? range.percentageRange[1] : 0;
}

// Takes: The income and net worth.
// Returns: The min and max Budget, the max Budget percentage,
//          And if the max Budget is determined from income.
export function calculateBudgetRecommendation(
  income: number,
  netWorth: number
): BudgetRecommendation {
  const minBudget = income * (MIN_INCOME_PERCENTAGE / 100);

  // Find ranges for income and net worth.
  const incomeRange = findRange(income, incomeRanges);
  const netWorthRange = findRange(netWorth, netWorthRanges);

  // Calculate the max Budget for income and net worth by the range percentages.
  const maxBudgetIncome = calculateBudgetFromPercentage(income, incomeRange);
  const maxBudgetNetWorth = calculateBudgetFromPercentage(
    netWorth,
    netWorthRange
  );

  // Determine the max Budget and if it is from income.
  const { isFromMaxIncome, maxBudget } = determineMaxBudget(
    maxBudgetIncome,
    maxBudgetNetWorth
  );

  // Get the max Budget percentage from the found ranges.
  const maxBudgetPercentage = isFromMaxIncome
    ? getMaxPercentage(incomeRange)
    : getMaxPercentage(netWorthRange);

  return {
    minBudget,
    maxBudget,
    maxBudgetPercentage,
    isFromMaxIncome,
  };
}
