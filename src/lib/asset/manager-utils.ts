import type { Asset } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/assets/schema";
import type { Beneficiary } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/beneficiaries/schema";
import type { Business } from "@/app/dashboard/(subscribed)/client/[id]/edit/lib/businesses/schema";

// Takes: An array of Assets and an array of Businesses.
// Returns: The total current value of all Assets and Businesses.
export function calculateTotalCurrentValue(
  assets: Asset[],
  businesses: Business[]
): number {
  const totalAssetValue: number = assets.reduce(
    (acc: number, asset) => acc + (parseFloat(asset.currentValue) || 0),
    0
  );
  const totalBusinessValue: number = businesses.reduce(
    (acc: number, business: Business) =>
      acc + (parseFloat(business.valuation) || 0),
    0
  );
  return totalAssetValue + totalBusinessValue;
}

// Takes: An array of Assets and a life expectancy.
// Returns: The summed future values of all Assets based on life expectancy.
export function calculateTotalFutureValue(
  assets: Asset[],
  lifeExpectancy: number
): number {
  return assets.reduce(
    (acc: number, asset) => acc + calculateFutureValue(asset, lifeExpectancy),
    0
  );
}

// Takes: An Asset and a life expectancy.
// Returns: The future value of the Asset based on the life expectancy.
function calculateFutureValue(asset: Asset, lifeExpectancy: number): number {
  const term = asset.term
    ? Math.min(20, parseFloat(asset.term))
    : lifeExpectancy + 5;

  return (
    parseFloat(asset.currentValue) *
    Math.pow(1 + parseFloat(asset.rate) / 100, term)
  );
}

// Takes: An Asset, a year, and the current year.
// If the year is in the past, returns 0.
// Returns: The future value of the Asset at the given year.
export function calculateFutureValueAtYear(
  asset: Asset,
  year: number,
  currentYear: number
): number {
  const yearsToFuture = year - currentYear;

  if (yearsToFuture < 0) {
    return 0;
  }

  return (
    parseFloat(asset.currentValue) *
    Math.pow(1 + parseFloat(asset.rate) / 100, yearsToFuture)
  );
}

// Takes: An array of Assets.
// Returns: The total value of all liquid Assets.
export function calculateTotalLiquidAssets(assets: Asset[]): number {
  let totalLiquidValue = 0;

  assets.forEach((asset) => {
    if (asset.isLiquid) {
      totalLiquidValue += parseFloat(asset.currentValue);
    }
  });

  return totalLiquidValue;
}

// Takes: An array of Assets and a life expectancy.
// Returns: A record of the Beneficiaries of the Assets to their distributions.
// Distribution: Allocation * Future Value Of Asset / Sum of Allocation
export function calculateBeneficiaryDistributionsTable(
  assets: Asset[],
  lifeExpectancy: number
): Record<string, number> {
  const distributions: Record<string, number> = {};

  assets.forEach((asset): void => {
    // Determine the future value of the Asset and the total of its allocation values.
    const futureValue: number = calculateFutureValue(asset, lifeExpectancy);
    const totalAllocation: number = asset.assetBeneficiaries.reduce(
      (sum: number, beneficiary) => sum + parseFloat(beneficiary.allocation),
      0
    );

    // Calculate and record the total of all distributions for each Beneficiary.
    asset.assetBeneficiaries.forEach((assetBeneficiary): void => {
      const distribution: number =
        (parseFloat(assetBeneficiary.allocation) * futureValue) /
        totalAllocation;

      distributions[assetBeneficiary.beneficiaries.name] =
        (distributions[assetBeneficiary.beneficiaries.name] || 0) +
        distribution;
    });
  });

  return distributions;
}

// Takes: An array of Assets, a tax freeze year, current year,
//        A life expectancy, and a life expectancy year.
// Calculates the distribution of the Assets, same as above but based on future Asset values.
// Returns: A record of the Assets Beneficiaries to their total distribution.
export function calculateBeneficiaryDistributions(
  assets: Asset[],
  taxFreezeYear: number,
  currentYear: number,
  lifeExpectancy: number,
  lifeExpectancyYear: number
): Record<string, number> {
  const distributions: Record<string, number> = {};

  assets.forEach((asset): void => {
    const term = asset.term
      ? Math.min(20, parseInt(asset.term))
      : lifeExpectancy + 5;

    // Determine range of years to calculate distribution.
    const assetTermEndYear = currentYear + term;

    const calculationYear =
      taxFreezeYear > assetTermEndYear ? assetTermEndYear : lifeExpectancyYear;

    // Calculate future value at the appropriate year
    const futureValue = calculateFutureValueAtYear(
      asset,
      calculationYear,
      currentYear
    );

    // Only include Asset in distributions if taxFreezeYear is before or at Asset sale date.
    const totalAllocation: number = asset.assetBeneficiaries.reduce(
      (sum: number, beneficiary) => sum + parseFloat(beneficiary.allocation),
      0
    );

    // Calculate and record the distribution for each Beneficiary based on value and allocation.
    asset.assetBeneficiaries.forEach((assetBeneficiary): void => {
      const distribution: number =
        (parseFloat(assetBeneficiary.allocation) * futureValue) /
        totalAllocation;

      distributions[assetBeneficiary.beneficiaries.name] =
        (distributions[assetBeneficiary.beneficiaries.name] || 0) +
        distribution;
    });
    // Otherwise, treat as liquid cash (handled elsewhere).
  });

  return distributions;
}

// Takes an array of Beneficiaries.
// Returns: A record of Beneficiaries to their ideal distribution.
// Ideal distribution is always equal to their allocation value.
export function calculateIdealDistributions(
  beneficiaries: Beneficiary[]
): Record<string, number> {
  const idealDistributions: Record<string, number> = {};

  beneficiaries.forEach((beneficiary: Beneficiary): void => {
    idealDistributions[beneficiary.name] = parseFloat(beneficiary.allocation);
  });

  return idealDistributions;
}

// Takes: A record of ideal distributions, a record of real distributions, and the total liquid assets.
// Calculates the additional money required for each Beneficiary to reach their ideal distribution.
// Returns: A record of Beneficiaries to their additional money required.
export function calculateAdditionalMoneyRequired(
  idealDistributions: Record<string, number>,
  distributions: Record<string, number>,
  totalLiquidAssets: number // Add this parameter
): Record<string, number> {
  const additionalMoneyRequired: Record<string, number> = {};
  let totalEqualizationNeeded = 0;

  // Use current amount and allocation to determine the total needed.
  // (current amount = allocation % of ideal total)
  Object.keys(idealDistributions).forEach((beneficiaryName: string): void => {
    const currentAmount: number = distributions?.[beneficiaryName] ?? 0;
    const idealPercentage: number = idealDistributions[beneficiaryName] / 100;
    const idealAmount: number = currentAmount / idealPercentage;

    // If amount needed is greater than current recorded amount, update the amount needed.
    totalEqualizationNeeded = Math.max(totalEqualizationNeeded, idealAmount);
  });

  // Subtract liquid assets from total equalization needed.
  totalEqualizationNeeded = Math.max(
    0,
    totalEqualizationNeeded - totalLiquidAssets
  );

  // Determine how the total equalization needed should be distributed among the Beneficiaries.
  Object.keys(idealDistributions).forEach((beneficiaryName: string): void => {
    const currentAmount: number = distributions?.[beneficiaryName] ?? 0;
    const desiredPercentage: number = idealDistributions[beneficiaryName] / 100;
    const idealAmount: number = totalEqualizationNeeded * desiredPercentage;

    // Record the amount of money required for the Beneficiary to reach their ideal allocation of the total value.
    additionalMoneyRequired[beneficiaryName] = Math.max(
      0,
      idealAmount - currentAmount
    );
  });

  return additionalMoneyRequired;
}

// Takes: A record of additional money required for ideal allocation across Beneficiaries.
// Returns: The total additional money required across all Beneficiaries.
export function calculateTotalAdditionalMoneyRequired(
  additionalMoneyRequired: Record<string, number>
): number {
  return Object.values(additionalMoneyRequired).reduce(
    (total: number, amount: number) => total + amount,
    0
  );
}

// Takes: A record of Beneficiary distributions and the total future value of the Assets.
// Returns: The total percentage of the future value that will be distributed across Beneficiaries.
export function calculateTotalPercentage(
  distributions: Record<string, number>,
  totalFutureValue: number
): number {
  const totalDistributions: number = Object.values(distributions ?? {}).reduce(
    (total: number, amount: number) => total + amount,
    0
  );
  return totalDistributions > 0
    ? (totalDistributions / totalFutureValue) * 100
    : 0;
}

// Takes: A record of ideal distributions (allocations).
// Returns: The total ideal parts (allocation) across all Beneficiaries.
export function calculateTotalIdealParts(
  idealDistributions: Record<string, number>
): number {
  return Object.values(idealDistributions).reduce(
    (total: number, percentage: number) => total + percentage,
    0
  );
}
